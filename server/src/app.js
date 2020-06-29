/* Libs */
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');
const fetch = require('node-fetch');
const csv = require('csvtojson');
const schedule = require('node-schedule');

/* Models */
const Covid = require('./models/covid');

/* Variables */
const app = express();
const url = 'https://www.data.gouv.fr/fr/datasets/r/63352e38-d353-4b54-bfd1-f1b3ee1cabd7';

app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());

app.get('/covid', (eq, res) => {
  Covid.getLastDay((data) => {
		const dataFormatted = formatData(data);
		console.log(dataFormatted);
    res.send(JSON.stringify(dataFormatted));
  });
});

app.get('/depts', (eq, res) => {
  fs.readFile('./data/depts.json', (err, json) => {
    const obj = JSON.parse(json);

    res.send(obj);
  });
});

/* Each day at noon the data covid will be refreshed. */
schedule.scheduleJob('00, 00, 12 * * 0-6', async () => {
  const csvRow = await fetchCsv();

  Covid.create(csvRow);
});

/* Should be in a helper file I guess. */
const formatData = (resp) => {
	return resp.reduce((map, elem) => {
		let dataHosp = {
			hosp: elem.hosp,
			dc: elem.dc,
			rad: elem.rad,
			rea: elem.rea
		};

		if (map[elem.dept]) {
			map[elem.dept][elem.sex] = dataHosp;
		} else {

			map[elem.dept] = {
				[elem.sex]: dataHosp
			};
		}

		return map;

		}, {})
}

/* Should be in a helper file I guess. */
const fetchCsv = async () => {
  try {
    const response = await fetch(url);
    const csvStr = await response.text();
    const csvRow = await csv({
        delimiter: [";"],
        output: 'csv',
    }).fromString(csvStr)

    return csvRow;

  } catch(error) {
    console.log(error);
  }
}

app.listen(process.env.PORT || 8081);