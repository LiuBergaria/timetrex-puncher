import "dotenv/config";

import Puppeteer from "puppeteer";

const { LOGIN_URL, USERNAME, PASSWORD } = process.env;

if (!LOGIN_URL) {
  // eslint-disable-next-line no-console
  console.error("ERROR: LOGIN_URL not set on .env");

  process.exit(1);
}

if (!USERNAME) {
  // eslint-disable-next-line no-console
  console.error("ERROR: USERNAME not set on .env");

  process.exit(1);
}

if (!PASSWORD) {
  // eslint-disable-next-line no-console
  console.error("ERROR: PASSWORD not set on .env");

  process.exit(1);
}

interface IConfig {
  loginUrl: string;
  username: string;
  password: string;
  launchOptions: Puppeteer.LaunchOptions &
    Puppeteer.BrowserLaunchArgumentOptions &
    Puppeteer.BrowserConnectOptions;
}

const config: IConfig = {
  loginUrl: LOGIN_URL,
  username: USERNAME,
  password: PASSWORD,
  launchOptions: {
    headless: true,
    defaultViewport: { width: 1000, height: 800 },
  },
};

export default config;
