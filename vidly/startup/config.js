// Loading Config module
const config = require('config');

module.exports = () => {
// Checking if JWT private key is defined and exiting the process
  if (!config.get('jwtPrivateKey')) {
    throw new Error('Fatal error: jwtPrivateKey is not defined');
  }
}
