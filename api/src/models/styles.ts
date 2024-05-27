import type { AllStyles } from "@nice-tile-server/types";
import { v4 as uuid } from "uuid";
import { client } from "../db/connection";

export async function createStyle(layerId: string, style: AllStyles) {

    const SQL = `
        insert into styles (id, layer_id, colour, size, opacity)
        values ($1, $2, $3, $4, $5)    
    `;

    await client.query(SQL, [uuid(), layerId, style.colour, style.size, style.opacity]);
}

export async function getStyle(layerId: string) {

    const SQL = "select * from styles where layer_id = $1";

    const result = await client.query(SQL, [layerId]);

    return result.rows[0];
}