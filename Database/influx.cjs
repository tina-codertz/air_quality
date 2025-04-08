require('dotenv').config();
const { InfluxDB } = require('@influxdata/influxdb-client');

const influxDB = new InfluxDB({ url: process.env.INFLUX_URL, token: process.env.INFLUX_TOKEN });
const queryApi = influxDB.getQueryApi(process.env.INFLUX_ORG);

module.exports = { queryApi };
