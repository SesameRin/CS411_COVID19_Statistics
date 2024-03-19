# TODO List May 11th

- SSH for everyone

- Google Map Instantiate 

- Tramsfer website frame work to ejs / CSS / JS

Front end side basically finished

--- 

After these 3 phases, to do list is 

- Connect to DB

- Support Searching and Statistics for Paper DB


- Support Map Operations using Google Maps

---

## Dependencies, Imports and Exports

This will give you an example by showing that a configuration should only be defined once and can be imported in different places. This rule also adapts to different code that are shared between different sub-modules(pages). This will make our repos easy to maintain and reduce the burdun of manipulating same code in different contexts.

### Example of imports and exports

You can export multiple configurations from your `config.js` module using the module.exports statement. There are different ways to export multiple configurations, depending on the structure of your configurations.

One way to export multiple configurations is to define them as properties of a single object, and export that object using the module.exports statement. For example:

```javascript
// config.js
const config1 = {
  appName: 'MyApp',
  port: 3000
};

const config2 = {
  database: {
    host: 'localhost',
    port: 27017,
    dbName: 'mydb'
  }
};

module.exports = {
  config1: config1,
  config2: config2
};
```
In this example, the config.js module defines two configurations: config1 and config2. These configurations are defined as separate objects, and then exported as properties of a single object using the module.exports statement.

To import these configurations in another module, you can use the require statement to load the config.js module, and then access the individual configurations as properties of the imported object. For example:

```javascript
// account.js
const config = require('./config');

console.log(config.config1.appName); // Output: "MyApp"
console.log(config.config1.port); // Output: 3000
console.log(config.config2.database.host); // Output: "localhost"
console.log(config.config2.database.port); // Output: 27017
console.log(config.config2.database.dbName); // Output: "mydb"
```
In this example, the `require('./config')` statement loads the `config.js` module and assigns its exported object to the config variable. You can then access the individual configurations using dot notation, such as `config.config1.appName` or `config.config2.database.host`.

By exporting multiple configurations in this way, you can organize your settings and make them available to other modules in a clear and structured manner.