import { Feature, Point } from "geojson";
import { v4 as uuid } from "uuid";
import { client } from "../db/connection";
const SphericalMercator = require('@mapbox/sphericalmercator');
const mercator = new SphericalMercator({size: 256});

export async function getObjects(x: number, y: number, z: number) {

    const bbox = mercator.bbox(x, y, z, false);
    const layerName = "layer_a"

    const SQL = `
    SELECT ST_AsMVT(q, '${layerName}', 4096, 'geom') FROM (
        SELECT 
          ST_AsMVTGeom(
            geom,
            ST_MakeEnvelope(${bbox[0]}, ${bbox[1]}, ${bbox[2]}, ${bbox[3]}, 4326),
            4096,
            256,
            true
          ) geom FROM objects
        ) q
    `;

    const response = await client.query(SQL);
    return response.rows[0].st_asmvt;
};

export async function postObject(mapId: string, object: Feature<Point>) {

  const id = uuid();

  const sql = `
    INSERT INTO objects(id, geom, map_id)
    VALUES ('${id}', '${JSON.stringify(object.geometry)}', '${mapId}');
  `

  console.log("sql", sql);

  return client.query(sql);

}