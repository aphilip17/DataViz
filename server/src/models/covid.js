const connection = require('../config/db');


connection.on('error', (err) => {
    console.log(err);
});

class Covid {
    static create (content) {
        console.log(connection);
        console.log(content);

    }

}

module.exports = Covid;