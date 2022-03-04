import Puppeteer from "puppeteer";
import config from "../config";

const clickOnParent = async (
  page: Puppeteer.Page,
  id: string
): Promise<void> => {
  await page.waitForSelector(`#${id}`);

  await page.evaluate((_id) => {
    const element = document.getElementById(_id);

    return Promise.resolve(element?.parentElement?.click());
  }, id);
};

export const doPunch = async () => {
  const browser = await Puppeteer.launch(config.launchOptions);
  const page = await browser.newPage();

  // Go to login page
  await page.goto(config.loginUrl);

  // Wait for page loads
  await page.waitForNetworkIdle();

  // Wait for input shows
  await page.waitForSelector("input[name=username]");

  // Fill username and password
  await page.type("input[name=username]", config.username);
  await page.type("input[name=password]", config.password);

  // Do login
  await page.click("button[type=submit]");

  await page.waitForNetworkIdle();

  // Click on IN/OUT
  await clickOnParent(page, "inOutIcon");

  // Wait for page loads
  await page.waitForNetworkIdle();

  // Click on SAVE
  // await clickOnParent(page, "saveIcon");

  // Wait for page loads
  await page.waitForNetworkIdle();

  // TODO ADD TEST TO SEE IF PUNCHED CORRECTLY AND THROW ERROR IF NOT

  // Close browser
  await browser.close();
};
