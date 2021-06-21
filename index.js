const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yu2o5.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  console.log('connection error', err);
  const employersCollection = client.db("jobCompanion").collection("employers");
  const jobsCollection = client.db("jobCompanion").collection("jobs");

  console.log('Database Connected Successfully');
  // perform actions on the collection object

  app.post('/addEmployers', (req, res) => {
    const employerBook = req.body;
    console.log(employerBook);
    employersCollection.insertOne(employerBook)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })

  app.post('/addJobs', (req, res) => {
    const newJob = req.body;
    console.log('new Service', newJob);
    jobsCollection.insertOne(newJob)
        .then(result => {
            console.log('insertedCount', result);
            res.send(result)
        })
})

app.get('/jobs', (req, res) => {
  jobsCollection.find()
      .toArray((err, items) => {
          res.send(items)
      })
})

app.post('/isEmployer', (req, res) => {
  const email = req.body.email;
  console.log('new Service', email);
  employersCollection.find({email:email})
  .toArray((err,items)=>{
      res.send(items.length>0)
    })
})

  //client.close();
});




app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})