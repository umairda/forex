//
var fs = require('fs'),
configPath = './models/config.json';
var parsed = JSON.parse(fs.readFileSync(configPath, 'UTF-8'));
console.log(parsed);
exports.mongoConfig =  parsed;
