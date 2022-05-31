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
  // Click on IN/OUT
  await page.click("span.topbar-icon.topbar-inout");

  // Wait for page loads
  await page.waitForNetworkIdle();

  // Click on SAVE
  await page.click("#context-button-save");

  // Wait for page loads
  await page.waitForNetworkIdle();
};

export const doPunch = (): Promise<void> =>
  new Promise((resolve, reject) => {
    getBrowserAndPage()
      .then(([browser, page]) => {
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
          if (response.url().includes("Method=setUserPunch")) {
            const body = await response.json();

            if (response.ok() && body?.api_retval) {
              resolve();
            } else {
              reject(new Error("Request failed"));
            }
          }
        });

        doLogin(page)
          .then(() => {
            setUserPunch(page)
              .then(() => {
                // Close browser
                browser
                  .close()
                  .then(() => resolve())
                  .catch(() => resolve());
              })
              .catch((e) => reject(e));
          })
          .catch((e) => reject(e));
      })
      .catch((e) => reject(e));
  });
