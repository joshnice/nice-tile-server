import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from "hono/cors"
import { objectRoutes } from './routes/object';


const app = new Hono();

app.use('/*', cors());

app.route("/objects", objectRoutes);

const port = 3000

console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
