require('babel/polyfill');

const environment = {
  development: {
    isProduction: false
  },
  production: {
    isProduction: true
  }
}[process.env.NODE_ENV || 'development'];

const host = '127.0.0.1';
const port = 3000;
const apiHost = '188.166.208.62';
const apiPort = 3030;

module.exports = Object.assign({
  host: process.env.HOST || host,
  port: process.env.PORT || port,
  apiHost: process.env.APIHOST || apiHost,
  apiPort: process.env.APIPORT || apiPort,
  app: {
    title: 'Online Caro game',
    description: 'Online Caro game',
    meta: {
      charSet: 'utf-8',
      property: {
        'og:site_name': 'Caro-HKN',
        'og:locale': 'en_US',
        'og:title': 'Online Caro game',
        'og:description': 'Playing Caro game Online'
      }
    }
  },
  facebook: {
    APP_ID: '1731524677077517',
    APP_SECRET: 'e11fc72a9878626cf92ea55932bdb304'
  }
}, environment);
