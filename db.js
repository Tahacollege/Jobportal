const MongoCLient=require('mongodb').MongoClient
const url='mongodb://localhost:27017'
//const url="mongodb+srv://tcollegewala30:fOcy87YhffoTWgnJ@cluster0.qqtdpgf.mongodb.net/b.net/"
const database="jobportal"

async function DbConnection(){
    const client=new MongoCLient(url)
    const res=await client.connect()
    const result=res.db(database)
    return result
}

module.exports=DbConnection()