const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;
require('dotenv').config();

/* MidelPoint */
app.use(cors());
app.use(express.json());

/* ============================ Mongodb ===================== */

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ijf63.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
  try{
    await client.connect()
    const emaCollection = client.db("emaJohn").collection("service");
    app.get('/services',async (req,res)=>{
     const pages = parseInt(req.query.pages);
     const size = parseInt(req.query.size);
     const query ={};
     const cursor = emaCollection.find(query);
     let result;
     if(pages || size){
      result= await cursor.skip(pages*size).limit(size).toArray();
     }else{
      result = await cursor.toArray();
     }
      
      
    
      res.send(result)
    })
    app.get('/servicesCount',async(req,res)=>{
      const count = await emaCollection.countDocuments();
      res.send({count})
    })
  }
  finally{
    // await client.close();
  }
}
run().catch(console.dir)


app.listen(port,()=>{
    console.log(`https//:location:${port}`)
})