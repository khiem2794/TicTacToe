require('babel/polyfill');

const environment = {
  development: {
    isProduction: false
  },
  production: {
    isProduction: true
  }
}[process.env.NODE_ENV || 'development'];

module.exports = Object.assign({
  host: process.env.HOST || 'localhost',
  port: process.env.PORT,
  apiHost: process.env.APIHOST || 'localhost',
  apiPort: process.env.APIPORT,
  app: {
    title: 'Online Caro game',
    description: 'Online Caro game',
    meta: {
      charSet: 'utf-8',
      property: {
        'og:site_name': 'Caro-HKN',
        'og:image': 'https://react-redux.herokuapp.com/logo.jpg',
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
