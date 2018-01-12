const configs = {
  production: {
    env: require('./production.env')
  },
  preview: {
    env: require('./preview.env')
  },
  stage: {
    env: require('./stage.env')
  },
  sit: {
    env: require('./sit.env')
  }
}

module.exports = configs[process.env.ENV]
