const bcrypt = require('bcrypt')
const User = require('../model/user')



getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({})
    res.status(200).json(users)
  } catch (error) {
    next(error)
  }
}

getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
    if (user) {
      res.status(200).json(user)
    }
    else res.status(404).end()
  } catch (error) {
    next(error)
  }
}

createUser = async (req, res, next) => {
  try {
    const { username, name, password } = req.body

    const existingUser = await User.findOne({ username })

    if (existingUser) {
      return res.status(409).json({ error: 'Username ya existe' })
    }

    if (!username || !password) {
      return res.status(400).json({ error: 'Username y password son requeridos' });
    }

    const saltRounds = 10

    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
      username,
      name,
      passwordHash
    })

    const savedUser = await user.save()

    res.status(201).json(savedUser)

  } catch (error) {
    next(error)
  }
}

updateUser = async (req, res, next) => {
  try {
    const { password, newPassword, newName } = req.body

    const user = await User.findById(req.params.id)

    const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.passwordHash)

    if (!(user && passwordCorrect)) {
      return res.status(401).json({
        error: 'Credenciales inválidas'
      })
    }


    const updateData = {}

    if (newName) updateData.name = newName
    if (newPassword) updateData.passwordHash = await bcrypt.hash(newPassword, 10)

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No hay datos para actualizar' })
    }

    const updatedUser = await User.findByIdAndUpdate(user._id, updateData,
      {
        new: true,
        runValidators: true
      }
    )


    res.status(200).json({
      message: 'Usuario actualizado',
      username: updatedUser.username,
      name: updatedUser.name
    })

  } catch (error) {
    next(error)
  }
}

deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params
    const deletedUser = await User.findByIdAndDelete(id)

    if (!deletedUser) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    res.status(204).end()

  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
}