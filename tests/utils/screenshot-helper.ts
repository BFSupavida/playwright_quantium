import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { test, Locator } from '@playwright/test';
import { testparam } from '../data/testParam';

type CaptureOptions = {
  trimThreshold?: number;
  cropWidth?: number;
  cropHeight?: number;
  anchorX?: 'left' | 'center' | 'right';
  anchorY?: 'top' | 'center' | 'bottom';
  logWidthAndHeight?: boolean;
  fullscreen?: boolean;
  omitBackground?: boolean;

  bgTopK?: number;
  edgeInset?: number;
  trimPadding?: number;
  minContentPixelsPerCol?: number;

  trimLeft?: boolean;
  trimRight?: boolean;
  trimTop?: boolean;
  trimBottom?: boolean;
};

export async function captureLocatorScreenshot(
  locator: Locator,
  outputFolder: string,
  fileName?: string,
  options?: CaptureOptions
): Promise<string> {
  const trimThreshold = options?.trimThreshold ?? 10;
  const logWidthAndHeight = options?.logWidthAndHeight ?? false;
  const fullscreen = options?.fullscreen ?? false;
  const omitBackground = options?.omitBackground ?? false;

  const baseDir = test.info().outputDir;
  const dir = path.join(baseDir, outputFolder);
  await fs.promises.mkdir(dir, { recursive: true });

  const finalName = fileName
    ? fileName.endsWith('.png')
      ? fileName
      : `${fileName}.png`
    : `${Date.now()}.png`;

  const filePath = path.join(dir, finalName);

  let buffer: Buffer;

  if (fullscreen) {
    buffer = await locator.page().screenshot({
      fullPage: true,
      animations: 'disabled',
      caret: 'hide',
    });

    if (logWidthAndHeight) {
      await logSize(`${fileName ?? finalName} Fullscreen`, buffer);
    }
  } else {
    await locator.waitFor({ state: 'visible' });
    await locator.waitFor({ state: 'attached' });

    buffer = await locator.screenshot({
      animations: 'disabled',
      caret: 'hide',
      omitBackground,
    });

    if (logWidthAndHeight) {
      await logSize(`${fileName ?? finalName} Before trim`, buffer);
    }

    const trimmed = await sharp(buffer)
      .trim({ threshold: trimThreshold })
      .png()
      .toBuffer();

    if (logWidthAndHeight) {
      await logSize(`${fileName ?? finalName} After auto trim`, trimmed);
    }

    buffer =
      options?.cropWidth || options?.cropHeight
        ? await cropToSize(trimmed, options)
        : trimmed;
  }

  await fs.promises.writeFile(filePath, buffer);
  await locator.page().waitForTimeout(testparam.timeout._half_SEC);

  return filePath;
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

async function logSize(label: string, buffer: Buffer) {
  const meta = await sharp(buffer).metadata();
  console.log(`[Screenshot] ${label}: ${meta.width}x${meta.height}`);
}

async function cropToSize(
  buffer: Buffer,
  crop: {
    cropWidth?: number;
    cropHeight?: number;
    anchorX?: 'left' | 'center' | 'right';
    anchorY?: 'top' | 'center' | 'bottom';
  }
): Promise<Buffer> {
  const meta = await sharp(buffer).metadata();
  const w = meta.width!;
  const h = meta.height!;

  const targetW = crop.cropWidth ?? w;
  const targetH = crop.cropHeight ?? h;

  const calc = (full: number, target: number, anchor: string) => {
    if (anchor === 'center') return Math.floor((full - target) / 2);
    if (anchor === 'right' || anchor === 'bottom') return full - target;
    return 0;
  };

  const left = clamp(calc(w, targetW, crop.anchorX ?? 'left'), 0, Math.max(0, w - 1));
  const top = clamp(calc(h, targetH, crop.anchorY ?? 'top'), 0, Math.max(0, h - 1));

  return sharp(buffer)
    .extract({
      left,
      top,
      width: Math.min(targetW, w),
      height: Math.min(targetH, h),
    })
    .png()
    .toBuffer();
}
