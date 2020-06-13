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

app.get('/covid', async (eq, res) => {
    const json = await fetchCsv();
    const response = await fetch(url);
    const csvStr = await response.text();

    Covid.create(csvStr, () => {
        console.log('Everything is saved in db')

    });

    res.send(json);
});

const fetchCsv = async () => {
    try {
        const response = await fetch(url);
        const csvStr = await response.text();

        const jsonArray = await csv({
            delimiter: [";"],
            colParser: {
                'sexe': {
                    cellParser: 'number'
                },
                'hosp': {
                    cellParser: 'number'
                },
                'rea': {
                    cellParser: 'number'
                },
                'rad': {
                    cellParser: 'number'
                },
                'dc': {
                    cellParser: 'number'
                }
            },
        })
        .fromString(csvStr)

        return jsonArray;
    } catch(error) {
        console.log(error);
    }
}

app.listen(process.env.PORT || 8081);