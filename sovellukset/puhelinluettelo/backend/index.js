require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan');
const cors = require('cors')
const path = require('path');
const Person = require('./models/person')

app.use(cors())

app.use(express.json())

app.use(express.static('dist'))

morgan.token('body', (req) => {
    return req.method === 'POST' ? JSON.stringify(req.body) : '';
  });

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));


app.get('/info', (request, response) => {
    Person.countDocuments({}).then(count => {
        const date = new Date()
        response.send(`
          <p>Phonebook has info for ${count} people</p>
          <p>${date}</p>
        `)
      })
    })
  

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons)
      })
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
  
    const person = new Person({
        name: body.name,
        number: body.number,
    })
  
    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

const PORT =  process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

