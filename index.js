const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static('dist'))
morgan.token('data', (req, res) => JSON.stringify(req.body))
app.use(
    morgan(
        `:method :url :status :res[content-length] - :response-time ms :data`
    )
)

let persons = [
    {
        id: 1,
        name: 'Arto Hellas',
        number: '040-123456'
    },
    {
        id: 2,
        name: 'Ada Lovelace',
        number: '39-44-5323523'
    },
    {
        id: 3,
        name: 'Dan Abramov',
        number: '12-43-234345'
    },
    {
        id: 4,
        name: 'Mary Poppendieck',
        number: '39-23-6423122'
    }
]

function errorCheck(body, res) {
    if (!body.name || !body.number) {
        return { error: 'User name or number is blank.' }
    } else if (
        persons.find(
            (person) => person.name.toLowerCase() === body.name.toLowerCase()
        )
    ) {
        return { error: 'Name must be unique.' }
    }
}

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter((person) => person.id !== id)
    res.status(204).end()
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find((person) => person.id === id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.get('/info', (req, res) => {
    const info = `<p>Phonebook has info for ${persons.length} people</p><br/>
    ${new Date()}`
    res.send(info)
})

app.post('/api/persons', (req, res) => {
    const body = req.body
    const error = errorCheck(body, res)

    if (error) {
        res.status(400).json(error)
        return
    }
    const person = {
        id: Math.floor(Math.random() * 999999999),
        name: body.name,
        number: body.number
    }
    persons = persons.concat(person)
    res.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
