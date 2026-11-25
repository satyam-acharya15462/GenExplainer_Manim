import { Hono } from 'hono'
import chatRoute from "./routes/chat.ts"
import { sValidator } from '@hono/standard-validator'
const app = new Hono()

// app.route("/api/chatRequest" , chatRoute)

app.get("/hello" , (c)=>{
  return c.json({message : "hello world from hono server"})
})


export default app
