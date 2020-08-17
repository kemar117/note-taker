const express  = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
const { notes } = require('./db/notes');
const fs = require('fs');
const path = require('path');

// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());
app.use(express.static('public'));

function filterByQuery(query, noteArray) {
  let filteredResults = noteArray;
  if (query.title) {
    filteredResults = filteredResults.filter(note => note.title === query.title);
  }
  if (query.text) {
    filteredResults = filteredResults.filter(note => note.text === query.text);
  }
  if (query.id) {
    filteredResults = filteredResults.filter(note => note.id === query.id);
  }
  return filteredResults;
}

function findById(id, notesArray) {
  const result = notesArray.filter(note => note.id ===id)[0];
  return result;
}

function createNewnote(body, notesArray) {
  const note = body;
  notesArray.push(note);
  fs.writeFileSync(
    path.join(__dirname, './data/notes.json'),
    JSON.stringify({ notes: notesArray }, null, 2)
  );
  return note;
}

function validatenote(note) {
  if (!note.title || typeof note.title !== 'string') {
    return false;
  }
  if (!note.text || typeof note.text !== 'string') {
    return false;
  }
  return true;
}

app.get('/api/notes', (req, res) => {
  let results = notes;
  if (req.query) {
    results = filterByQuery(req.query, results);
  }
  res.json(results);
});

app.get('/api/notes/:id', (req, res) => {
  const result = findById(req.params.id, notes);
  if (result) {
    res.json(result);
  } else {
    res.send(404);
  }
});

app.post('/api/notes', (req, res) => {
  // set id based on what the next index of the array will be
  req.body.id = notes.length.toString();

  // if any data in req.body is incorrect, send 400 error back
  if (!validatenote(req.body)) {
    res.status(400).send('The note is not properly inputed.');
  } else {
    const note = createNewnote(req.body, notes);
    res.json(note);
  }
});

// get routes for html files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});