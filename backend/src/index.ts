import { Hono } from 'hono'
import chatRoute from "./routes/chat.ts"
import { sValidator } from '@hono/standard-validator'
const app = new Hono()

// app.route("/chat" , chatRoute)


export default app
