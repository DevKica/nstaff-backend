import mongoose from "mongoose";
import config from 'config'

async function dbConnect(database:string){
    const DB_URL = config.get<string>('DB_URL')
    try {
        await mongoose.connect(`${DB_URL}${database}`)
    } catch (e: any) {
        throw new Error(e)
    }
}

export default dbConnect