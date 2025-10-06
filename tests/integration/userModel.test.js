const User = require('../../src/model/user')
const { validateNotEmpty,
  validateStringEquality,
  validateMongoDuplicationError } = require('../utils/validators')

const { dbConnect, dbDisconnect } = require('../utils/dbHandler')

beforeAll(async () => dbConnect())

afterAll(async () => dbDisconnect())

describe('Validar el modelo de User', () => {

  test('Debería validar guardando un nuevo User correctamente', async () => {
    const validUser = new User({
      username: "rjproa",
      name: "richard vega",
      passwordHash: "hashqwerty"
    })

    const savedUser = await validUser.save()

    validateNotEmpty(savedUser)

    validateStringEquality(savedUser.username, "rjproa")
    validateStringEquality(savedUser.name, "richard vega")
    validateStringEquality(savedUser.passwordHash, "hashqwerty")

  })

  test('Debería fallar al guardar un usuario duplicado', async () => {
    expect.assertions(4)
    const validUser = new User({
      username: "rjproa",
      name: "richard jhamil",
      passwordHash: "hashqwerty"
    })

    try {
      await validUser.save()
    } catch (error) {
      const { name, code } = error
      validateMongoDuplicationError(name, code)
    }
  })

})