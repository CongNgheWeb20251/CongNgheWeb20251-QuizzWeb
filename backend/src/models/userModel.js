import Joi from 'joi'
import { EMAIL_RULE, EMAIL_RULE_MESSAGE } from '~/utils/validators'
import { DB_GET } from '~/config/mongodb'
import { ObjectId } from 'mongodb'

const USER_ROLES = {
  TEACHER: 'teacher',
  ADMIN: 'admin',
  STUDENT: 'student'
}

// Define Collection (name & schema)
const USER_COLLECTION_NAME = 'users'
const USER_COLLECTION_SCHEMA = Joi.object({
  email: Joi.string().required().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE).allow(null),
  password: Joi.string().min(6).max(160),
  //
  username: Joi.string().required().trim().strict(),
  fullName: Joi.string().required().trim().strict(),
  avatar: Joi.string().default(null),
  role: Joi.string().valid(USER_ROLES.ADMIN, USER_ROLES.TEACHER, USER_ROLES.STUDENT).optional(),

  isActive: Joi.boolean().default(false),
  // verifyToken: Joi.string(),
  authProvider: Joi.string().valid('local', 'google', 'facebook', 'hybrid').default('local'),

  googleId: Joi.string().optional().allow(null),
  facebookId: Joi.string().optional().allow(null),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false),
  require_2fa: Joi.boolean().default(false),
  // set exprire time là 5 phút nếu user không verifyToken
  expiresAt: Joi.date()
})

const UNCHANGE_FIELDS = ['_id', 'email', 'createdAt']

const validBeforeCreate = async (data) => {
  return await USER_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    const validData = await validBeforeCreate(data)

    const createdUser = await DB_GET().collection(USER_COLLECTION_NAME).insertOne(validData)
    return createdUser
  } catch (error) {
    // Handle error
    throw new Error(error)
  }
}

const findOneById = async (id) => {
  try {
    const user = await DB_GET().collection(USER_COLLECTION_NAME).findOne({ _id: new ObjectId(id) })
    return user
  } catch (error) {
    throw new Error(error)
  }
}

const findOneByGoogleId = async (googleId) => {
  try {
    const user = await DB_GET().collection(USER_COLLECTION_NAME).findOne({ googleId: googleId })
    return user
  } catch (error) {
    throw new Error(error)
  }
}

const findOneByFacebookId = async (facebookId) => {
  try {
    const user = await DB_GET().collection(USER_COLLECTION_NAME).findOne({ facebookId: facebookId })
    return user
  } catch (error) {
    throw new Error(error)
  }
}

const findOneByEmail = async (email) => {
  try {
    const user = await DB_GET().collection(USER_COLLECTION_NAME).findOne({ email: email })
    return user
  } catch (error) {
    throw new Error(error)
  }
}


const update = async (userId, updateData) => {
  try {
    Object.keys(updateData).forEach((key) => {
      if (UNCHANGE_FIELDS.includes(key)) {
        delete updateData[key]
      }
    })
    const updateResult = await DB_GET().collection(USER_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $set: updateData },
      { returnDocument: 'after' }
    )
    return updateResult
  } catch (error) {
    throw new Error(error)
  }
}

const updateUserActive = async (userId, updateData) => {
  try {
    Object.keys(updateData).forEach((key) => {
      if (UNCHANGE_FIELDS.includes(key)) {
        delete updateData[key]
      }
    })
    const updateResult = await DB_GET().collection(USER_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(userId) },
      {
        $set: updateData,
        $unset: { expiresAt: '' } // Xóa trường expiresAt sau khi kích hoạt để TTL không xóa user
      },
      { returnDocument: 'after' }
    )
    return updateResult
  } catch (error) {
    throw new Error(error)
  }
}


export const userModel = {
  USER_COLLECTION_NAME,
  USER_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  findOneByEmail,
  update,
  findOneByGoogleId,
  findOneByFacebookId,
  updateUserActive
}