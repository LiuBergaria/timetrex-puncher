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
  const inOutIcon = await page.$("#inOutIcon");
  await (
    (await inOutIcon?.getProperty(
      "parentElement"
    )) as Puppeteer.ElementHandle<Element>
  ).click();

  // Do punch
  await page.waitForSelector("#saveIcon");
  await page.waitForNavigation({ waitUntil: "networkidle2" });
  const elementChild = await page.$("#saveIcon");
  if (elementChild) {
    const parent = (
      await elementChild.getProperty("parentElement")
    ).asElement();

    console.log("parent", parent);
    parent?.click();
  }
  console.log("here3");

  await page.waitForTimeout(3000);

  // await browser.close();
};
