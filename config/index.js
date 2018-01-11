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

export default configs[process.env.ENV]
