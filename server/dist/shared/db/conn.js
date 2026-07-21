import { MongoClient } from 'mongodb';
const connectionStr = process.env.MONGO_URI || 'mongodb://LocalHost:27017/';
const client = new MongoClient(connectionStr);
await client.connect();
export let db = client.db('CyberDB');
//# sourceMappingURL=conn.js.map