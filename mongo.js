const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack_open:${password}@cluster0.gk4l4s3.mongodb.net/?retryWrites=true&w=majority`
mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})


const Person = mongoose.model('Person', personSchema)

if(process.argv.length === 3){
  console.log('phonebook: \n')
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person.name, person.number)
      mongoose.connection.close()
    })
  })
}

if(process.argv.length > 3){

  const newName = process.argv[3]
  const newNumber = process.argv[4]

  const newPerson = new Person({
    name: newName,
    number: newNumber
  })
  newPerson.save().then(result => {
    console.log('added ', result.name, 'number', result.number, ' to phonebook')
    mongoose.connection.close()
  })
}
