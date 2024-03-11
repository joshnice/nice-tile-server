import { client } from "../db/connection";

export async function getMapLayers(mapId: string) {
    const SQL = `
        select * from layers where map_id = $1;
    `;

    const response = await client.query(SQL, [mapId]);

    return response.rows;
}

export async function postLayer(layer: {id: string, name: string, type: "Fill" | "Line" | "Point", mapId: string}) {
    const SQL = `
        insert into layers (id, name, type, map_id)
        values ($1, $2, $3, $4)
    `;  

    await client.query(SQL, [layer.id, layer.name, layer.type, layer.mapId]);
}