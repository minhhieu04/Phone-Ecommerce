const { default: mongoose } = require("mongoose");

const dbConnect = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URL)
        if (conn.connection.readyState === 1) console.log('MongooseDB connection succeeded')
        else console.log('MongooseDB connection is connecting or disconnected')
    } catch (error) {
        console.log('DB connection error')
        throw new Error(error)
    }
}

module.exports = dbConnect