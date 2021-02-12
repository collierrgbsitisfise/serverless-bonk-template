
const fs = require('fs');

(function setupEnv() {
  const { ENV } = process.env;
  fs.writeFileSync('./.env', fs.readFileSync(`./env/${ENV}.env`));
}());