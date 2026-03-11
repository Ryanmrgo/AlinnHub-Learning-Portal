import mongoose from "mongoose";

const globalForMongoose = globalThis;

if (!globalForMongoose._mongoose) {
    globalForMongoose._mongoose = {
        conn: null,
        promise: null,
        listenersAttached: false,
    };
}

const connectDB = async () => {
    const cached = globalForMongoose._mongoose;

    if (cached.conn) {
        return cached.conn;
    }

    try {
        if (!cached.listenersAttached) {
            mongoose.connection.on('connected', () => {
                console.log('Database Connected');
            });

            mongoose.connection.on('error', (err) => {
                console.error('MongoDB connection error:', err);
            });

            cached.listenersAttached = true;
        }

        if (!cached.promise) {
            cached.promise = mongoose.connect(`${process.env.MONGODB_URI}/lms`, {
                bufferCommands: false,
            });
        }

        cached.conn = await cached.promise;
        return cached.conn;
    } catch (error) {
        cached.promise = null;
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}

export default connectDB;
