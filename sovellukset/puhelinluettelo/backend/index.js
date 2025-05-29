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
  

app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then(persons => res.json(persons))
    .catch(error => next(error))
})


app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
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
    person.save()
    .then(savedPerson => {response.json(savedPerson)
    .catch(error => next(error))
    })

})

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
  }
  app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.name, error.message)

  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)


}
app.use(errorHandler)
const PORT =  process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

