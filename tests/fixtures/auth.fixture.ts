import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { TextInputPage } from '../pages/text_input.page';
import { ClientSideDelayPage } from '../pages/client_side_delay.page';
import { AjaxDataPage } from '../pages/ajax_data.page';
import { ScrollbarsPage } from '../pages/scrollbars.page';
import { DynamicTablePage } from '../pages/dynamic_table.page';
import { ProgressBarPage } from '../pages/progress_bar.page';
import { VisibilityPage } from '../pages/visibility.page';
import { OverlappedElementPage } from '../pages/overlapped_element.page';
import { ShadowDomPage } from '../pages/shadow_dom.page';
import { FileUploadPage } from '../pages/file_upload.page';
import { MysteryButtonPage } from '../pages/mystery_button.page';
import { DisabledInputPage } from '../pages/disabled_input.page';
import { ChartInteractionPage } from '../pages/chart_interaction.page';
import { AutoWaitPage } from '../pages/auto_wait.page';
import { captureLocatorScreenshot } from '../utils/screenshot-helper';
import { mergeImagesIntoGrid } from '../utils/merge-images';
import { env } from '../utils/env';

type MyFixtures = {
  loginPage: LoginPage;
  textInputPage: TextInputPage;
  clientSideDelayPage: ClientSideDelayPage;
  ajaxDataPage: AjaxDataPage;
  scrollbarsPage: ScrollbarsPage;
  dynamicTablePage: DynamicTablePage;
  progressBarPage: ProgressBarPage;
  visibilityPage: VisibilityPage;
  overlappedElementPage: OverlappedElementPage;
  shadowDomPage: ShadowDomPage;
  fileUploadPage: FileUploadPage;
  mysteryButtonPage: MysteryButtonPage;
  disabledInputPage: DisabledInputPage;
  chartInteractionPage: ChartInteractionPage;
  autoWaitPage: AutoWaitPage;
  captureLocatorScreenshot: typeof captureLocatorScreenshot;
  mergeImagesIntoGrid: typeof mergeImagesIntoGrid;
};

export const test = base.extend<MyFixtures>({
  // Authenticated page — login once, all tests get pre-logged-in page
  page: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(env.USERNAME, env.PASSWORD);
    await page.waitForURL(/#\/home/, { timeout: 15000 });
    await use(page);
  },

  // Page Objects
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  textInputPage: async ({ page }, use) => {
    await use(new TextInputPage(page));
  },
  clientSideDelayPage: async ({ page }, use) => {
    await use(new ClientSideDelayPage(page));
  },
  ajaxDataPage: async ({ page }, use) => {
    await use(new AjaxDataPage(page));
  },
  scrollbarsPage: async ({ page }, use) => {
    await use(new ScrollbarsPage(page));
  },
  dynamicTablePage: async ({ page }, use) => {
    await use(new DynamicTablePage(page));
  },
  progressBarPage: async ({ page }, use) => {
    await use(new ProgressBarPage(page));
  },
  visibilityPage: async ({ page }, use) => {
    await use(new VisibilityPage(page));
  },
  overlappedElementPage: async ({ page }, use) => {
    await use(new OverlappedElementPage(page));
  },
  shadowDomPage: async ({ page }, use) => {
    await use(new ShadowDomPage(page));
  },
  fileUploadPage: async ({ page }, use) => {
    await use(new FileUploadPage(page));
  },
  mysteryButtonPage: async ({ page }, use) => {
    await use(new MysteryButtonPage(page));
  },
  disabledInputPage: async ({ page }, use) => {
    await use(new DisabledInputPage(page));
  },
  chartInteractionPage: async ({ page }, use) => {
    await use(new ChartInteractionPage(page));
  },
  autoWaitPage: async ({ page }, use) => {
    await use(new AutoWaitPage(page));
  },

  // Utilities
  captureLocatorScreenshot: async ({}, use) => {
    await use(captureLocatorScreenshot);
  },
  mergeImagesIntoGrid: async ({}, use) => {
    await use(mergeImagesIntoGrid);
  },
});

export { expect };
