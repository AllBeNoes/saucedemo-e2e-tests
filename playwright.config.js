// playwright.config.js
require('dotenv').config();

module.exports = {
  use: {
    headless: true,
    baseURL: process.env.BASE_URL,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  testDir: './tests',
  reporter: [['list'], ['html']],
};
