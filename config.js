let config = {
  MODE: "dev",
  BOT_TOKEN: {
    prod: "",
    dev: ""
  },
  SERVER_IP: "somedomain.com",
  WEBHOOK_PORT: 9777,
  DB: {
    HOST: {
      prod: "localhost",
      dev: "localhost"
    },
    USER: {
      prod: "bot",
      dev: "bot"
    },
    DATABASE: {
      prod: "bot",
      dev: "bot"
    },
    PASSWORD: {
      prod: "",
      dev: ""
    }
  },
  LOG: {
    LENGTH: 30,
    MAIN: {
      success: true,
      info: true,
      error: true,
      warning: true
    },
    DB: {
      success: true,
      info: true,
      error: true,
      warning: true
    },
    BOT: {
      success: true,
      info: true,
      error: true,
      warning: true
    },
    SERVICE: {
      success: true,
      info: true,
      error: true,
      warning: true
    },
    SESSION: {
      success: true,
      info: true,
      error: true,
      warning: true
    }
  }
}

module.exports = config;
