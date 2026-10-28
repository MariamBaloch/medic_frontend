import { defineConfig } from "@playwright/test";
import baseConfig from "./playwright.config";

const slowMotionMs = 1000;

export default defineConfig({
  ...baseConfig,
  projects: baseConfig.projects?.map((project) => {
    const use = { ...project.use };
    delete use.deviceScaleFactor;

    return {
      ...project,
      use: {
        ...use,
        launchOptions: { slowMo: slowMotionMs },
      },
    };
  }),
});
