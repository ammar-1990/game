'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var fs = require('fs');
var path = './path/to/your/database.sqlite'; // Adjust the path to your SQLite file
fs.unlink(path, function (err) {
  if (err) {
    console.error('Error deleting database: '.concat(err.message));
    return;
  }
  console.log('Database reset successfully.');
});

