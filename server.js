const express = require('express');
const path = require('path');
const { clog } = require('./middleware/clog');
//const api = require('./routes/index.js');
const notes = require('./db/db.json');
const fs = require('fs')
const uuid = require('uuid')

const PORT = process.env.PORT || 3001;

const app = express();

// Import custom middleware, "cLog"
app.use(clog);

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use('/api', api);

//Set static folder
app.use(express.static('public'));


// GET Route for homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});


// GET Route for notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) => {
  const notesRead = JSON.parse(fs.readFileSync(path.join(__dirname, '/db/db.json'), 'utf8'))
  res.json(notesRead)
})

app.post('/api/notes', (req, res) => {

  const newNote = {
    title: req.body.title,
    text: req.body.text,
    id:  uuid.v4()
  }

  const existingNotes = JSON.parse(fs.readFileSync(path.join(__dirname, '/db/db.json'), 'utf8'))
  existingNotes.push(newNote)

  fs.writeFileSync(path.join(__dirname, '/db/db.json'), JSON.stringify(existingNotes), 'utf8')
  res.json(newNote)
})

app.delete('/api/notes/:id', (req, res) => {
  //if the url id is the same as the note id then delete by removing the object inside db.json 
  const notes = JSON.parse(fs.readFileSync(path.join(__dirname, '/db/db.json'), 'utf8'))
  const leftoverNotes = notes.filter(note => note.id !== req.params.id)
  fs.writeFileSync(path.join(__dirname, '/db/db.json'), JSON.stringify(leftoverNotes), 'utf8')
  res.json(leftoverNotes)
})

// Wildcard route to direct users to a 404 page
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
