import * as mongoose from "mongoose"

export default (async function ConnectDb() {
       mongoose.connect("mongodb://localhost:27017/testdb").then(()=>{
        console.log("the database is successfully connected and is running")
    }).catch((e)=>{
        console.error(`the database having issue to connect ${e}`)
    })
})()