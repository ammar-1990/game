import * as fs from 'fs';

const path = './game.db'; // Adjust the path to your SQLite file

fs.unlink(path, (err) => {
  if (err) {
    console.error(`Error deleting database: ${err.message}`);
    return;
  }
  console.log('Database reset successfully.');
});
