const express = require('express');
const { InfluxDB, Point } = require('@influxdata/influxdb-client')
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const mysql = require('mysql2');
const axios = require('axios');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
dotenv.config();
app.use(cors());


const PORT = process.env.PORT || 5000; 
 
// Connect to MySQL
const db = mysql.createConnection({
  host:process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database:   process.env.MYSQL_DATABASE,
});


// InfluxDB Config
const url = 'https://influxdb.projectdar.aplab.be/'
const token = 'FI-RixLBRtcx3zhqS9IylLA-bmGmjHJ304oDAuWlFjlltaxsl3MksRjtaYCzruRMDZJ-ePZUjzE8k07NTwLHvA=='
const org = 'ac73491f5a717267'
const bucket = 'piBucket'

// Create client and write API
const client = new InfluxDB({ url, token })
const writeApi = client.getQueryApi(org, bucket)



//MySQL database connection is established
db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL');
  });

  // Fetch All Sensors from MySQL
app.get('/sensors', (_req, res) => {
    const query = 'SELECT * FROM sensors ';
  
    db.query(query, (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
  });

  // POST Sensor Data
app.post('/sensors', (req, res) => {
  const query = "INSERT INTO sensors (id, name, type_id, latitude, longitude, location_id) VALUES (?, ?, ?, ?, ?, ?)";
  const { id, name, type_id, latitude, longitude, location_id } = req.body;
  db.query(query, [id, name, type_id, latitude, longitude, location_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});


  // Fetch Device Types from MySQL
app.get('/device_type', (_req, res) => {
    const query = 'SELECT * FROM device_type';
    db.query(query, (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
  });
  });

  // post device type to mysql

  app.post('/device_type',(req,res)=>{
    console.log(req.body);
    const query="INSERT INTO device_type(id,name) VALUES(?,?)";
    const {id,name}=req.body;
    db.query(query,[id,name],(err,results)=>{
      if(err) return res.status(500).json({error:err.message});
      res.json(results);
    });
  
  })

  //post location to mysql
  app.post('/location',(req,res)=>{
    const query="INSERT INTO location(id,name,latitude,longitude) VALUES(?,?,?,?)";
    const {id,name,latitude,longitude}=req.body;
    db.query(query,[id,name,latitude,longitude],(err,results)=>{
      if(err) return res.status(500).json({error:err.message});
      res.json(results);
    });
  });

  
  // Fetch Locations from MySQL
  app.get('/location', (_req, res) => {
    const query = 'SELECT * FROM location';
    db.query(query, (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
  });


axios.post('http://localhost:5000/sensors', {
  id: 4,
  name: "Temperature Sensor",
  type_id: 101,
  latitude: 37.7749,
  longitude: -122.4194,
  location_id: 10
}).then(response => {
  console.log(response.data);
}).catch(error => {
  console.error(error);
});

axios.post('http://127.0.0.1:5000/sensors', {
  id: 3,
  name: "Temperature",
  type_id: 101,
  latitude: 37.7749,
  longitude: -122.4194,
  location_id: 2
}).then(response => {
  console.log(response.data);
}).catch(error => {
  console.error(error);
});

// POST Location Data
axios.post('http://127.0.0.1:5000/location', {
  id: 10,
  name: "Building A"
}).then(response => {
  console.log(response.data);
}).catch(error => {
  console.error(error);
});

// POST Device Type
axios.post('http://127.0.0.1:5000/device_type', {
  id: 101,
  name: "Temperature"
}).then(response => {
  console.log(response.data);
}).catch(error => {
  console.error(error);
});


  app.get('/influx', (_req, res) => {
    const data = [];
    client.getQueryApi(org).queryRows(

      `
      from(bucket: "${bucket}")
      |> range(start: -10000000h)
      |> filter(fn: (r) => r["_measurement"] == "test")
      |> pivot(rowKey: ["_time"], columnKey: ["_field"], valueColumn: "_value")
      |> filter(fn: (r) => r["id"] != "")
      |> keep(columns: ["id", "measurement", "value", "_time"])
      `,
      {
        next(row, tableMeta) {
          const o = tableMeta.toObject(row);
          data.push(o);
        },
        error(err) {
          console.error(err);
          res.status(500).json({ error: err.message });
        },
        complete() {
          res.json(data);
        },
      }
    );
  });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
