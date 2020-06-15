const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');

const fetch = require('node-fetch');
const url = "https://www.data.gouv.fr/fr/datasets/r/63352e38-d353-4b54-bfd1-f1b3ee1cabd7";

const csv = require('csvtojson');

const Covid = require('./models/covid');

const app = express();

app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());

app.get('/covid', (eq, res) => {

    Covid.getAllData((data) => {
        res.send(data);
    });
});


const insertDataCovidInDb = async () => {
    const csvRow = await fetchCsv();
    Covid.empty();
    Covid.create(csvRow);
}

const fetchCsv = async () => {
    try {
        const response = await fetch(url);
        const csvStr = await response.text();

        const csvRow = await csv({
            delimiter: [";"],
            output: 'csv',
        })
        .fromString(csvStr)

        return csvRow;
    } catch(error) {
        console.log(error);
    }
}

/** To fixed: Get data from gouv and insert data in db each time the server is started. */
insertDataCovidInDb();

app.listen(process.env.PORT || 8081);