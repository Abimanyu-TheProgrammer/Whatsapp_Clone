// importing
const express = require('express');
const mongoose = require('mongoose');
// const bp = require('body-parser')
const Message = require('./models/Message')
const Pusher = require("pusher");
const cors = require('cors')

// app config
const app = express()
// app.use(bp.json())
// app.use(bp.urlencoded({ extended: true }))

const pusher = new Pusher({
    appId: "1235762",
    key: "45fcd3b0059fac68adae",
    secret: "fa9b0dcef378e2196b67",
    cluster: "ap1",
    useTLS: true
  });

// alternative
// we can also use express.json()

// middleware
app.use(express.json())
app.use(cors())

// DB config
const connection_url = "mongodb+srv://abimanyu007:014CIxEnFCbkeZb3@node-data.13e9u.mongodb.net/whatsapp-clone?retryWrites=true&w=majority"
mongoose.connect(connection_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})

const db = mongoose.connection
db.once('open', () => {
    console.log('DB connected')

    const messageCollection = db.collection('messages') 
    const changeStream = messageCollection.watch()

    changeStream.on("change", (change) => {
        console.log("A change occured", change)

        if(change.operationType === 'insert') {
            const messageDetails = change.fullDocument;
            pusher.trigger('messages', 'inserted', {
                user : messageDetails.user,
                message : messageDetails.message,
                timestamp : messageDetails.timestamp,
                recieved : messageDetails.recieved
            })
        } else {
            console.log("Error triggering Pusher")
        }
    })
})


// api routes
app.get("/", (req, res) => res.status(200).send("hello world"))

app.get("/api/messages/sync", (req, res) => {
    Message.find((error, data) => {
        if(error){
            return res.status(500).json({error})
        } else {
            return res.status(200).send({data})
        }
    })
})

app.post("/api/message/new", (req, res) => {
    const payload = req.body

    // message = new Message({
    //     user : req.body.user,
    //     message : req.body.message,
    //     timestamp : req.body.timestamp
    // }

    // )
    // res.status(201).json({message})

    // Using express.json, we can create the entity this way

   Message.create(payload, (error, data) => {
       if(error) {
           return res.status(500).json({error})
       } else {
           return res.status(201).json({data})
       }
   })
})

// listen
app.listen(3001, () => {
    console.log(`App listening on port 3001!`);
});