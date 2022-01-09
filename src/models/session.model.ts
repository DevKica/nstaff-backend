import  mongoose, { ObjectId } from 'mongoose';
import { userDocument } from '../models/user.model'

export interface sessionUpdate{
    valid?:boolean
}

export interface sessionFilter extends sessionUpdate{
    _id?: ObjectId|string
    userId?:userDocument['_id']
    userAgent?:string
    createdAt?: Date
    updatedAt?: Date
}

export interface sessionInput{
    userId:userDocument['_id']
    userAgent:string
} 

export interface sessionDocument extends sessionInput{
    valid:boolean
    createdAt: Date
    updatedAt: Date
}

const sessionModelSchema = new mongoose.Schema(
    {
        userId:{type:mongoose.Schema.Types.ObjectId, ref:"user"},
        valid: { type: Boolean, default: true },
        userAgent:{type:String},
        __v: { type: Number, select: false }
    },{
        timestamps:true ,
    }
)

const SessionModel = mongoose.model<sessionDocument>("session",sessionModelSchema)

export default SessionModel