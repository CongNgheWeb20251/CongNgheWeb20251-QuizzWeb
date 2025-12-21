/* eslint-disable indent */
import { MongoClient, ServerApiVersion } from 'mongodb' // lấy class kết nối chính và đối tượng enums từ thư viện mongodb
import { env } from './environment'
let dbInstance = null // lưu lại kết nối db đã tạo (singleton pattent)

const mongoClient = new MongoClient(env.MONGODB_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: false,
        deprecationErrors: true
    }
})

export const DB_CONNECT = async () => {
    await mongoClient.connect()
    dbInstance = mongoClient.db(env.DATABASE_NAME)
    // tạo index hết hạn otp thì db sẽ tự động xóa
    await dbInstance.collection('otps').createIndex(
      { 'expiresAt': 1 },
      { expireAfterSeconds: 0 }
    )
    // tạo index tìm kiếm text cho quiz
    await dbInstance.collection('quizzes').createIndex(
      { title: 'text', description: 'text', category: 'text', level: 'text' }
    )
    // tạo index hết hạn user không verifyToken thì db sẽ tự động xóa
    await dbInstance.collection('users').createIndex(
      { 'expiresAt': 1 },
      { expireAfterSeconds: 0 }
    )
    await dbInstance.collection('users').createIndex(
      { fullName: 'text', email: 'text' },
      { weights: { fullName: 2, email: 1 } }
    )
}

export const DB_GET = () => {
    if (!dbInstance) {
        throw new Error('Database must be connected before using')
    } else return dbInstance
}

export const DB_CLOSE = async () => {
    await mongoClient.close()
}
