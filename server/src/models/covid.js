/* db */
const connection = require('../config/db');

class Covid {
  static create (csvRows) {
    const sql = 'INSERT INTO Covid (dept, sex, date, hosp, rea, rad, dc) VALUES ?';

    connection.query(sql, [csvRows], (err) => {
      if (err) throw err;
      // TODO: When should we end connection to db ?
      // connection.end();
    });
  }

  static empty () {
    const sql = 'TRUNCATE TABLE Covid';

    connection.query(sql, (err) => {
      if (err) throw err;
      console.log('Table emptied');
    });
  }

  static getAllData (callback) {
    const sql = 'SELECT * FROM Covid';

    connection.query(sql, (err, results) => {
      if (err) throw err;
      if (callback) {
          callback(results);
      }
    });
  }
}

module.exports = Covid;