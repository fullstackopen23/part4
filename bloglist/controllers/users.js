const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  const { username, name, password, notes} = request.body

  if(!username || username.length < 3) {
    response.status(400).json({error: "username missing or too short"})
  } else if (!password || password.length < 3) {
    response.status(400).json({error: "password missing or too short"})
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
    notes
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate("blogs")
    response.json(users)
  })

module.exports = usersRouter