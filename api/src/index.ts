import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { client } from './db/connection';

const app = new Hono()

app.get('/', async (c) => {
  const res = await client.query("select * from maps");
  console.log(res.rows[0]);
  return c.json(res.rows[0]);
})

const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
