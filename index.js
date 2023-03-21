const express = require("express");
const app = express();

app.use(express.json());

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
];

app.get("/api/persons", (request, response) => {
  console.log("getting all the persons..");
  response.json(persons);
});

app.get("/info", (request, response) => {
    const arrayInfo = persons.length
    console.log("get info called..")
    response.send(
        
            `<p>Phone book has info for ${arrayInfo} people.</p>
             <p>${new Date()}</p>
            `
    )
}
)

app.get("/api/persons/:id", (request, response) => {

    console.log("getting a single person..")
    const id = Number(request.params.id);
    const person = persons.find((person) => person.id === id)
  
    if(person){


        response.json(person)
    }
    else
    {
        response.status(404).end()
    }
  })

app.delete("/api/persons/:id", (request, response) => {
    console.log("delete person function called..")
    const id = Number(request.params.id);
    persons = persons.filter((person) => person.id !== id);
    
    response.status(204).end();
})

const generateId = () => {

    return Math.floor(Math.random() * 99999)
  }

app.post("/api/persons", (request, response) => {
    console.log("adding a person..")
    const body = request.body;
  
    const person = 
    {
        id: generateId(),
        name: body.name,
        number: body.number,
    };
  
    persons = persons.concat(person);
    response.json(person);
  })
  



const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});