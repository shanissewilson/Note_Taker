const PORT = process.env.PORT || 3001;
const fs = require('fs');
const path = require('path');
const {v4:uuidv4} = require('uuid')


const express = require('express');
const app = express();

const allNotes = require('./db/db.json');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

function readFile(){
    const data = fs.readFileSync(path.join(__dirname, './db/db.json'),"utf-8");
    return JSON.parse(data)
}

app.get('/api/notes', (req, res) => {
    const notes = readFile()
    res.json(notes);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});


function createNewNote(body, notesArray) {
    
    const newNote = body;
    if (!Array.isArray(notesArray))
    notesArray = [];
     newNote.id = uuidv4()
    notesArray.push(newNote);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(notesArray, null, 2)
    );
    return newNote;
}

app.post('/api/notes', (req,res) => {
    const notes = readFile();
    const newNote = createNewNote(req.body, notes);
    res.json(newNote);
});

function deleteNote(id, notesArray) {
    console.log(id) 
    for (let i = 0; i < notesArray.length; i++) {
        let note = notesArray[i];

        if (note.id == id) {
            notesArray.splice(i, 1);
            fs.writeFileSync(
                path.join(__dirname, './db/db.json'),
                JSON.stringify(notesArray, null, 2)
            );
            break;
        }
    }
}

app.delete('/api/notes/:id', (req, res) => {
    const notes = readFile();
    deleteNote(req.params.id, notes);
});

app.listen(PORT, () => {
    console.log(`API is now on port ${PORT}!`);
});