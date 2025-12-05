import Joi from 'joi'
import { EMAIL_RULE, EMAIL_RULE_MESSAGE } from '~/utils/validators'
import { DB_GET } from '~/config/mongodb'
import { ObjectId } from 'mongodb'


// Define Collection (name & schema)
const OTP_COLLECTION_NAME = 'otps'
const OTP_COLLECTION_SCHEMA = Joi.object({
  email: Joi.string().required().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE),
  token: Joi.string().required().trim().strict(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  expiresAt: Joi.date()
})

const UNCHANGE_FIELDS = ['_id', 'email', 'createdAt', 'token', 'expiresAt']

const validBeforeCreate = async (data) => {
  return await OTP_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    const validData = await validBeforeCreate(data)
    // validData.expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 phút hết hạn

    const createdOtp = await DB_GET().collection(OTP_COLLECTION_NAME).insertOne(validData)
    return createdOtp
  } catch (error) {
    // Handle error
    throw new Error(error)
  }
}

const findOneById = async (id) => {
  try {
    const user = await DB_GET().collection(OTP_COLLECTION_NAME).findOne({ _id: new ObjectId(id) })
    return user
  } catch (error) {
    throw new Error(error)
  }
}

const findOneByEmailToken = async ({ email, token }) => {
  try {
    const rs = await DB_GET().collection(OTP_COLLECTION_NAME).findOne({ email: email, token: token })
    return rs
  } catch (error) {
    throw new Error(error)
  }
}


const updateByEmail = async (email, updateData) => {
  try {
    Object.keys(updateData).forEach((key) => {
      if (UNCHANGE_FIELDS.includes(key)) {
        delete updateData[key]
      }
    })
    const updateResult = await DB_GET().collection(OTP_COLLECTION_NAME).findOneAndUpdate(
      { email: email },
      { $set: updateData },
      { returnDocument: 'after' }
    )
    return updateResult
  } catch (error) {
    throw new Error(error)
  }
}


export const otpModel = {
  createNew,
  findOneById,
  findOneByEmailToken,
  updateByEmail
}