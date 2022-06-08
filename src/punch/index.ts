import Puppeteer from "puppeteer";
import config from "../config";

const getBrowserAndPage = async (): Promise<
  [Puppeteer.Browser, Puppeteer.Page]
> => {
  const browser = await Puppeteer.launch(config.launchOptions);
  const page = await browser.newPage();

  return [browser, page];
};

const doLogin = async (page: Puppeteer.Page): Promise<void> => {
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

  // Wait for page loads
  await page.waitForNetworkIdle();
};

const setUserPunch = async (page: Puppeteer.Page): Promise<void> => {
  // Await for and click on IN/OUT
  await page.waitForSelector("span.topbar-icon.topbar-inout");
  await page.click("span.topbar-icon.topbar-inout");

  // Wait for page loads
  await page.waitForNetworkIdle();

  // Await for and click on SAVE
  await page.waitForSelector("#context-button-save");
  await page.click("#context-button-save");

  // Wait for page loads
  await page.waitForNetworkIdle();
};

export const executeLoginAndPunch = async (
  browser: Puppeteer.Browser,
  page: Puppeteer.Page
) => {
  await doLogin(page);
  await setUserPunch(page);

  await browser.close();
};

export const doPunch = (): Promise<void> =>
  new Promise((resolve, reject) => {
    getBrowserAndPage().then(([browser, page]) => {
      // Add interceptors to check set punch response
      page.on("requestfailed", (event) => {
        if (event.isInterceptResolutionHandled()) {
          return;
        }

        if (event.url().includes("Method=setUserPunch")) {
          reject(new Error("Request failed"));
        }

        event.continue();
      });

      page.on("response", async (response) => {
        if (!response.url().includes("Method=setUserPunch")) {
          return;
        }

        const body = await response.json();

        if (response.ok() && body?.api_retval) {
          resolve();
        } else {
          reject(new Error("Request failed"));
        }
      });

      executeLoginAndPunch(browser, page).catch(reject);
    });
  });
