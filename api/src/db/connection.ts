import { Client } from "pg";

export const client = new Client({
	database: "nice-tile-server",
	host: "db",
	// Needs to be selected when running in dev mode
	// host: "localhost",
	user: "admin",
	password: "password",
});

async function connect() {
	await client.connect();
}

connect();
