import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from "hono/cors"
import { objectRoutes } from './routes/object';
import { mapsRoute } from './routes/maps';


const app = new Hono();

app.use('/*', cors());

app.route("/object", objectRoutes);
app.route("/maps", mapsRoute);

const port = 3000

console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
