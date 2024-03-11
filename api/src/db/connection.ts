import { Client } from "pg";

export const client = new Client({
	database: "nice-tile-server",
	host: "localhost",
	user: "admin",
	password: "password",
});

async function connect() {
	await client.connect();
}

connect();
