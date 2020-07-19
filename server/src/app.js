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

    res.send(JSON.stringify(dataFormatted));
  });
});

app.get('/covidDept/', (req, res) => {

  console.log('herrrre', req.query)
  Covid.getDataCovidDept(req.query.id, (data) => {
		const dataFormatted = formatDeptData(data);

    res.send(dataFormatted);
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

const formatDeptData = (resp) => {
  resp.reduce((accu, elem) => {
    if (accu.date) {
      accu.date.push(elem.date);
      accu.hosp.push(elem.hosp);
      accu.rea.push(elem.rea);
      accu.rad.push(elem.rad);
      accu.dc.push(elem.dc);
    } else {
      accu['date'] = [elem.date];
      accu['hosp'] = [elem.hosp];
      accu['rea'] = [elem.rea];
      accu['rad'] = [elem.rad];
      accu['dc'] = [elem.dc];
    }
    return accu;
  }, {});
}

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

    /* Total */
    if (elem.sex === 0) {
      if (map['total']) {
        map.total.hosp = map.total.hosp + elem.hosp;
        map.total.dc = map.total.dc + elem.dc;
        map.total.rad = map.total.rad + elem.rad;
        map.total.rea = map.total.rea + elem.rea;
      } else {
        map['total'] = Object.assign({}, dataHosp);
      }
    }

		return map;

		}, {})
}

/* Should be in a helper file I guess. */
const fetchCsv = async () => {
  try {
    const response = await fetch(url);
    const csvStr = await response.text();
    /* As it seems impossible to combine the column parser with the output parser
    (csv to csv row) just format the data with the plugin. And simply convert the array of object
    in a array of array to be able to insert the data in the DB. */
    const csvJson = await csv({
        delimiter: [";"],
        colParser: {
          "jour": function(item) {
            return item.split('/').reverse().join('-');
          }
        },

    }).fromString(csvStr)

    return csvJson.map((elem) => { return Object.values(elem); });

  } catch(error) {
    console.log(error);
  }
}

app.listen(process.env.PORT || 8081);