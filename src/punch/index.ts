import Puppeteer from "puppeteer";
import config from "../config";

export const doPunch = async () => {
  const browser = await Puppeteer.launch(config.launchOptions);
  const page = await browser.newPage();

  // Go to login page
  await page.goto(config.loginUrl);

  // Fill username and password
  await page.type("input[name=username]", config.username);
  await page.type("input[name=password]", config.password);

  // Do login
  await page.click("button[type=submit]");

  // Wait for punch navigation button be available and then click it
  await page.waitForSelector("#inOutIcon");
  await page.evaluate(() => {
    document.querySelector("#inOutIcon")?.parentElement?.click();
  });

  // Do punch
  await page.waitForSelector("#saveIcon");
  await page.evaluate(() => {
    document.querySelector("#saveIcon")?.parentElement?.click();
  });

  await browser.close();
};
