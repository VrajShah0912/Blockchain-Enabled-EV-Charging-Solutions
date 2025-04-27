module.exports = {
    JWT_SECRET: process.env.JWT_SECRET || '440583f93cc2487d6be3af377cd964f9fd8ce6d5eaf8a3ab73a9b0fa7c4b4fcce70ea4620213b09814a55389c75d67b74dc27b8de0c9543d2f2c844e7e5e485e',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '90d',
    JWT_COOKIE_EXPIRES_IN: process.env.JWT_COOKIE_EXPIRES_IN || 90
  };