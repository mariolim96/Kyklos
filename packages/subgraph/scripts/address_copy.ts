const fs = require('fs');
const yaml = require('js-yaml');

// Load JSON data
const jsonData = JSON.parse(fs.readFileSync('data.json', 'utf8'));

// Load YAML data
const configData = yaml.load(fs.readFileSync('config.yaml', 'utf8'));

// Update addresses based on JSON data
configData.dataSources[0].source.address = jsonData.localhost.CarbonProjects.address;
configData.dataSources[1].source.address = jsonData.localhost.CarbonProjectVintages.address;

// Write the updated YAML back to the file
fs.writeFileSync('config_updated.yaml', yaml.dump(configData), 'utf8');

console.log("YAML configuration has been updated successfully.");
