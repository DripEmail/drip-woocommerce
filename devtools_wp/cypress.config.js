const { execFileSync } = require('child_process')
const { defineConfig } = require('cypress')
const createBundler = require('@bahmutov/cypress-esbuild-preprocessor')
const { addCucumberPreprocessorPlugin } = require('@badeball/cypress-cucumber-preprocessor')
const { createEsbuildPlugin } = require('@badeball/cypress-cucumber-preprocessor/esbuild')

module.exports = defineConfig({
  chromeWebSecurity: false,
  defaultCommandTimeout: 15000,
  pageLoadTimeout: 100000,
  requestTimeout: 15000,
  responseTimeout: 10000,
  e2e: {
    baseUrl: 'http://localhost:3007',
    specPattern: 'cypress/e2e/**/*.feature',
    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config)
      on('file:preprocessor', createBundler({
        plugins: [createEsbuildPlugin(config)],
        // mockserver-client ships Node and browser transports in one package and
        // picks one at runtime; only the browser (XHR) one runs here.
        external: ['fs', 'http', 'https', 'mockserver-node'],
      }))
      on('task', {
        resetDocker() {
          execFileSync('./reset.sh', { env: { ...process.env, DRIP_COMPOSE_ENV: 'test' }, stdio: 'pipe' })
          return null
        },
        wpCli(args) {
          return execFileSync('docker-compose', ['exec', '-u', 'www-data', '-T', 'web', 'wp', ...args], { stdio: 'pipe' })
            .toString()
            .trim()
        },
      })
      return config
    },
  },
})
