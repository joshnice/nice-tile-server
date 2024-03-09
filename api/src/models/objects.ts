import { Feature, Point } from "geojson";
import { v4 as uuid } from "uuid";
import { client } from "../db/connection";
const SphericalMercator = require('@mapbox/sphericalmercator');
const mercator = new SphericalMercator({size: 256});

export async function getObjects(x: number, y: number, z: number, mapId: string) {

    const bbox = mercator.bbox(x, y, z, false);

    const SQL = `
    with mvtgeom as ( 
      select 
        ST_AsMVTGeom( geom, ST_MakeEnvelope(${bbox[0]}, ${bbox[1]}, ${bbox[2]}, ${bbox[3]}, 4326), 4096, 256,true ) geom, layer
      from
        objects
      where 
        map_id = '${mapId}'
    ),   
    tiles as (
      select 
        ST_AsMVT( mvtgeom.*, layer ) AS mvt
      from
        mvtgeom
      group by
        layer
      ) SELECT string_agg(mvt, '') from tiles;
    `;  

    console.log(SQL);

    const response = await client.query(SQL);
    return response.rows[0].string_agg;
};

export async function postObject(mapId: string, object: Feature<Point>, layer: string) {

  const id = uuid();

  const sql = `
    INSERT INTO objects(id, geom, map_id, layer)
    VALUES ('${id}', '${JSON.stringify(object.geometry)}', '${mapId}', '${layer}' );
  `

  return client.query(sql);

}