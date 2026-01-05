import {MongoClient} from 'mongodb';

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/aqi_db";
const client = new MongoClient(uri);

export async function connectToDatabase(){
    try{
        await client.connect();
        console.log('Connected to MongoDB compass');
        return client.db();
    }catch(error){
        console.error('Error connecting to MongoDB compass: ', error);
        throw error;
    }
}