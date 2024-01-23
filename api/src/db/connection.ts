import { Client } from "pg";

export const client = new Client({ database: "mydatabase", host: "localhost", user: "myuser", password: "mypassword" }); 

async function connect() {
    await client.connect();
}

connect();