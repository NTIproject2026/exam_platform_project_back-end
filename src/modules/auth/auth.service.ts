import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { JWT_SECRET } from '../../config/config.js'
import { InternalSererErrorException } from '../../common/errors/message.error.js'

export async function registerUser(
  name: string,
  email: string,
  password: string,
) {
  const existingUser = await findUserByEmail(email)
  if (existingUser) {
    InternalSererErrorException('email already exists', 400)
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  const user = await createUser({ name, email, password: hashedPassword })
  return {}
}

export async function loginUser(email: string, password: string) {
  const user = await findUserByEmail(email)
  if (!user) {
    internalServerException({
      message: 'invalid credentials',
      statusCode: 401,
    })
    return
  }

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    internalServerException({
      message: 'invalid credentials',
      statusCode: 401,
    })
    return
  }

  const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET!, {
    expiresIn: '7d',
  })

  const userObj = user.toObject()
  delete (userObj as any).password

  return { token, user: userObj }
}

export async function updateProfile(
  userId: string,
  name?: string,
  email?: string,
) {
  const user = await updateUser(userId, { name, email })
  if (!user) {
    internalServerException({ message: 'user not found', statusCode: 404 })
    return
  }

  const userObj = user.toObject()
  delete (userObj as any).password
  return userObj
}

export async function forgotPassword(email: string) {
  const user = await findUserByEmail(email)
  if (!user) {
    internalServerException({ message: 'user not found', statusCode: 404 })
    return
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString()
  const expires = new Date(Date.now() + 10 * 60 * 1000)

  await setResetCode(email, code, expires)
  await sendResetEmail(email, code)

  return { message: 'reset code sent to your email' }
}

export async function resetPassword(
  email: string,
  code: string,
  newPassword: string,
) {
  const user = await findByResetCode(email, code)
  if (!user) {
    internalServerException({
      message: 'invalid or expired code',
      statusCode: 400,
    })
    return
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10)
  await updatePasswordAndClearCode(user._id.toString(), hashedPassword)

  return { message: 'password reset successfully' }
}
