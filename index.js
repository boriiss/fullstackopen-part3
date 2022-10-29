const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(morgan('tiny'));

morgan.token('host', function(req, res) {
  return req.hostname;
});

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    number: 89,
    date: "2022-01-10T17:30:31.098Z",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only Javascript",
    number: 89,
    date: "2022-01-10T18:39:34.091Z",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    number: 89,
    date: "2022-01-10T19:20:14.298Z",
    important: true
  }
]

app.use(express.json())

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

morgan.token('/api/persons', function(req, res) {
  console.log('f');
  
});

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  return maxId + 1
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  if (!body.number) {
    return response.status(400).json({ 
      error: 'number missing' 
    })
  }
  

  const test = notes.filter(note => note.content == body.content)

  if(test[0]){
    return response.status(400).json({ 
      error: 'content exists' 
    })
  }

  const note = {
    content: body.content,
    number: body.number,
    important: body.important || false,
    date: new Date(),
    id: generateId(),
  }

  notes = notes.concat(note)
  console.log(body)
  response.json(note)
})

app.get('/api/notes', (req, res) => {
  res.json(notes)
})

app.get('/api/persons', (req, res) => {
  res.json(notes)
})

app.get('/info', (req, res) => {
  res.send("<p>Phonebook has info for " + notes.length + " people</p>" + new Date())
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  note = notes.filter(note => note.id == id)
  if(note[0]){
    res.send(note[0])
  } else {
    res.status(404).end()
  }
  
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)

  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

