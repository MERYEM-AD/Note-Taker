const notes = require('express').Router();
const { readFromFile, writeToFile, readAndAppend } = require('../helpers/fsUtils');
const uuid = require('../helpers/uuid');
const db = require("../db/db.json");

// GET Route for retrieving all the notes
notes.get('/', (req, res) => {
  console.info(`${req.method} request received for notes`);

  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

// POST Route for submitting notes
notes.post('/', (req, res) => {
  // Log that a POST request was received
  console.info(`${req.method} request received to submit notes`);

  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;

  // If all the required properties are present
  if (title && text) {
    // Variable for the object we will save
    const newnote = {
      title,
      text,
      id:uuid(),
    };

    readAndAppend(newnote, './db/db.json');

    const response = {
      status: 'success',
      body: newnote,
    };

    res.json(response);
  } else {
    res.json('Error in posting notes');
  }
});

// DELETE Route for  an id of notes 
notes.delete('/:id', (req, res) => {
  console.info(`${req.method} request received for notes`);

  const id_Number = parseInt(req.params.id);
  const arry =db.filter(dbN => id_Number !== dbN.id );
  writeToFile('./db/db.json',arry);
  res.status(200).send(`Deleted note ${id_Number}`);
});

module.exports = notes;