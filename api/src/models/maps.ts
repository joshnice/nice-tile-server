import { client } from "../db/connection";

export async function getMap(id: string) {
	const SQL = `
        select * from maps where id = $1
    `;

	const response = await client.query(SQL, [id]);

	return response.rows[0];
}

export async function postMap(map: { id: string; name: string }) {
	const SQL = `
        insert into maps (id, name)
        values ($1, $2);
    `;

	await client.query(SQL, [map.id, map.name]);
}

export async function getAllMaps() {
	const SQL = `        
        select * from maps
    `;

	const response = await client.query(SQL);

	return response.rows;
}
