/*
 * Don't forget to add MONGODB_URI to the Render..
 * Environment -> Environment Variables Key-Value..
 * 
 * 
 */
//it is important that .env gets important before the person model
//this ensures environment variables from the .env are available globally 
//before the code from other modules is imported.
require('dotenv').config()
const express = require("express");
const app = express();
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(express.json());
app.use(cors())
app.use(express.static('build'))
/*
let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
]*/

//app.use(morgan('tiny'))
morgan.token('content', function (req, res) { 
     if(req.method === "POST"){
        const reqBody = JSON.stringify(req.body)
        return reqBody
     }
     else{
        return ""
     }
})
// method / route / status / request cont. length / response time / content of req

app.use(morgan(
    ':method :url :status :req[content-length] - :response-time ms :content'
))

app.get("/api/persons", (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get("/info", (request, response) => {
    console.log("get info called..")
    Person.find({}).then(person => {
      response.send(
        
        `<p>Phone book has info for ${person.length} people.</p>
         <p>${new Date()}</p>
        `
      )
    })

}
)

app.get("/api/persons/:id", (request, response, next) => {

    console.log("getting a single person..")
    Person.findById(request.params.id).then((person => {
        if(person){
          response.json(person)
        }
        else{
          response.status(404).end()
        }
      })

    ).catch(error => next(error))
  })

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))

})

const generateId = () => {

    return Math.floor(Math.random() * 99999)
  }

app.post("/api/persons", (request, response) => {
    console.log("adding a person..")
    const body = request.body;

    if (body.name === undefined) {
      return response.status(400).json({ error: 'name missing' })
    }

    if (body.number === undefined) {
      return response.status(400).json({ error: 'numbef missing' })
    }
  
    const newPerson = new Person({
      name: body.name,
      number: body.number
    })
  
    newPerson.save().then(savedPerson => {
      response.json(savedPerson)
    })
  })

  app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
  
    const newPerson = {
      name: body.name,
      number: body.number
    }
  
    Person.findByIdAndUpdate(request.params.id, newPerson, { new: true })
      .then(updatedPerson => {
        response.json(updatedPerson)
      })
      .catch(error => next(error))
  })

  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  // handler of requests with unknown endpoint
  app.use(unknownEndpoint)
  
  const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } 
  
    next(error)
  }
  
  // this has to be the last loaded middleware.
  app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});