import { client } from "../db/connection";

export async function getObjectProperties (objectId: string) {
    const SQL = `
        select properties from objects where objects.id = $1
    `;

    const response = await client.query(SQL, [objectId]);

    return response.rows[0];
}

export async function updateObjectProperties(objectId: string, properties: {[key: string]: string}) {
    const SQL = `
        update objects
        set properties = $1::jsonb
        where objects.id = $2
    `;

    await client.query(SQL, [properties, objectId]);
}