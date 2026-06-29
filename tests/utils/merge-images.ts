import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { test } from '@playwright/test';

export async function mergeImagesIntoGrid(
  inputPaths: string[],
  outputPath: string,
  options?: {
    columns?: number;
    gap?: number;
    background?: string;
    align?: 'left' | 'center' | 'right';
    rowAlign?: 'top' | 'center' | 'bottom';
    padding?: number;
  }
) {
  const columns = options?.columns ?? 4;
  const gap = options?.gap ?? 30;
  const background = options?.background ?? '#ffffff';
  const align = options?.align ?? 'left';
  const rowAlign = options?.rowAlign ?? 'top';
  const padding = options?.padding ?? 15;

  const images = await Promise.all(
    inputPaths.map(async (p) => {
      const meta = await sharp(p).metadata();
      if (!meta.width || !meta.height) {
        throw new Error(`Cannot read image size: ${p}`);
      }
      return { path: p, width: meta.width, height: meta.height };
    })
  );

  const rows: Array<typeof images> = [];
  for (let i = 0; i < images.length; i += columns) {
    rows.push(images.slice(i, i + columns));
  }

  const usedCols = Math.min(columns, Math.max(...rows.map(r => r.length)));
  const colWidths = Array.from({ length: usedCols }, () => 0);

  for (const row of rows) {
    row.forEach((img, colIdx) => {
      colWidths[colIdx] = Math.max(colWidths[colIdx], img.width);
    });
  }

  const rowHeights = rows.map(row =>
    Math.max(...row.map(img => img.height))
  );

  const gridWidth =
    colWidths.reduce((s, w) => s + w, 0) + gap * (usedCols - 1);

  const gridHeight =
    rowHeights.reduce((s, h) => s + h, 0) + gap * (rows.length - 1);

  const totalWidth = gridWidth + padding * 2;
  const totalHeight = gridHeight + padding * 2;

  const composites: sharp.OverlayOptions[] = [];

  const colLefts: number[] = [];
  let accLeft = padding;
  for (let c = 0; c < usedCols; c++) {
    colLefts.push(accLeft);
    accLeft += colWidths[c] + gap;
  }

  let top = padding;

  for (let r = 0; r < rows.length; r++) {
    const row = rows[r];
    const rowHeight = rowHeights[r];

    for (let c = 0; c < row.length; c++) {
      const img = row[c];
      const cellWidth = colWidths[c];

      const left =
        align === 'left'
          ? colLefts[c]
          : align === 'center'
            ? colLefts[c] + Math.floor((cellWidth - img.width) / 2)
            : colLefts[c] + (cellWidth - img.width);

      const rowTop =
        rowAlign === 'top'
          ? top
          : rowAlign === 'center'
            ? top + Math.floor((rowHeight - img.height) / 2)
            : top + (rowHeight - img.height);

      composites.push({
        input: await sharp(img.path).png().toBuffer(),
        left,
        top: rowTop,
      });
    }

    top += rowHeight + gap;
  }

  await sharp({
    create: {
      width: totalWidth,
      height: totalHeight,
      channels: 4,
      background,
    },
  })
    .composite(composites)
    .png()
    .toFile(outputPath);
}

export async function mergeAndAttachImages(
  outputFileName = 'merged',
  sourceFolder = 'screenshots',
  outputFolder?: string,
  options?: {
    gap?: number;
    background?: string;
    columns?: number;
    align?: 'left' | 'center' | 'right';
    rowAlign?: 'top' | 'center' | 'bottom';
    padding?: number;
    deleteSourceAfterMerge?: boolean;
  }
) {
  const baseDir = test.info().outputDir;

  const finalOutputFileName = outputFileName.endsWith('.png')
    ? outputFileName
    : `${outputFileName}.png`;

  const sourceDir = path.join(baseDir, sourceFolder);

  const files = fs
    .readdirSync(sourceDir)
    .filter(f => /\.(png|jpg|jpeg)$/i.test(f))
    .filter(f => f !== finalOutputFileName)
    .sort();

  if (!files.length) {
    throw new Error(`No images found in ${sourceDir}`);
  }

  const inputPaths = files.map(f => path.join(sourceDir, f));

  const finalOutputFolder = outputFolder ?? sourceFolder;
  const targetDir = path.join(baseDir, finalOutputFolder);
  fs.mkdirSync(targetDir, { recursive: true });

  const outputPath = path.join(targetDir, finalOutputFileName);

  await mergeImagesIntoGrid(inputPaths, outputPath, {
    columns: options?.columns ?? 4,
    gap: options?.gap ?? 30,
    background: options?.background ?? '#ffffff',
    align: options?.align ?? 'left',
    rowAlign: options?.rowAlign ?? 'top',
    padding: options?.padding ?? 15,
  });

  await test.info().attach(`${outputFileName}`, {
    path: outputPath,
    contentType: 'image/png',
  });

  if (options?.deleteSourceAfterMerge) {
    try {
      fs.rmSync(sourceDir, { recursive: true, force: true });
      console.log(`[Merge] deleted folder ${sourceDir}`);
    } catch (err) {
      console.warn(`[Merge] failed to delete folder`, err);
    }
  }

  return outputPath;
}
