/* db */
const connection = require('../config/db');

class Covid {
  static create (csvRows) {
    this.empty();

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

	static getLastDay (callback) {
    const sql = 'SELECT * FROM Covid WHERE date IN (SELECT MAX(date) FROM Covid)';

    connection.query(sql, (err, results) => {
      if (err) throw err;
      if (callback) {
          callback(results);
      }
    });
  }

  static getDataCovidDept (id, callback) {
    const sql = 'SELECT * FROM Covid WHERE dept=?';

    connection.query(sql, id, (err, results) => {
      if (err) throw err;
      if (callback) {
        callback(results);
      }
    });
  }
}

module.exports = Covid;