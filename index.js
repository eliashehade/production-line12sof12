require('dotenv').config(); 
const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.get('/EditCat/:catId', (req, res) => {
  res.render(__dirname + "/views/EditCat");
});


mongoose.connect(process.env.MONGO_URL);
const database = mongoose.connection

database.on('error', (error) => {
  console.log(error)
})

database.once('connected', () => {
  console.log('Database Connected');
})
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});


const catModel = require('./models/cat_M');


app.post('/api/phase-durations', async (req, res) => {
  const duration = parseInt(req.body.duration);

  try {
    const catData = new catModel({ duration });
    await catData.save();

    res.sendStatus(200);
  } catch (error) {
    console.error('Error storing duration:', error);
    res.sendStatus(500);
  }
});

app.get("/api/phase-durations", (req, res) => {
  catModel.find({})
    .then((result) => {
      console.log(result);
      res.status(200).json({ message: "successfully retrieved duration", result });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "An error occurred while retrieving duration" });
    });
});



const catRouter = require('./routes/cat_R');
app.use('/C', catRouter);

const itemRouter = require('./routes/item_R');
app.use('/P', itemRouter);
