const express = require('express')
const app = express()
const morgan = require('morgan');
const cors = require('cors')
const path = require('path');

app.use(cors())

app.use(express.json())

app.use(express.static('dist'))

morgan.token('body', (req) => {
    return req.method === 'POST' ? JSON.stringify(req.body) : '';
  });

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));


let persons = [
  { id: 1, name: 'Arto Hell', number: '040-123456' },
  { id: 2, name: 'Ada Lovelace', number: '39-44-5323523' },
  { id: 3, name: 'Dan Abramov', number: '12-43-234345' },
  { id: 4, name: 'Mary Poppendieck', number: '39-23-6423122' }
]

app.get('/info', (request, response) => {
    const count = persons.length
    const date = new Date()
  
    response.send(`
      <p>Phonebook has info for ${count} people</p>
      <p>${date}</p>
    `)
})
  

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/', (req, res) => {
    res.send('This is phonebook backend. Go to api/persons or /info')
})


app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
  
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
    })

app.post('/api/persons', (request, response) => {
    const body = request.body
    console.log(body)
    if (!body.name || !body.number) {
        return response.status(400).json({ error: 'Name or number missing' })
    }

    const nameExists = persons.some(p => p.name === body.name)
    if (nameExists) {
        return response.status(400).json({ error: 'name must be unique' })
    }
  
    const person = {
      id: Math.floor(Math.random() * 10000000),
      name: body.name,
      number: body.number,
    }
  
    persons = persons.concat(person)
    response.json(person)
})

const PORT =  process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
