import type { Feature, Point } from "geojson";
import * as pg from "pg-promise";
import { client } from "../db/connection";
const SphericalMercator = require("@mapbox/sphericalmercator");

const mercator = new SphericalMercator({ size: 256 });

// Todo: improve sql
// 1 - Remove sql inject
// 2 - improve union
// 3 - remove mercator bbox
// 4 - remove pgpromise
export async function getObjects(
	x: number,
	y: number,
	z: number,
	mapId: string,
) {
	const bbox = mercator.bbox(x, y, z, false);

	const SQL = `
    with mvtgeom as ( 
      select
        objects.id,
        objects.properties,
        ST_AsMVTGeom( geom, ST_MakeEnvelope(${bbox[0]}, ${bbox[1]}, ${bbox[2]}, ${bbox[3]}, 4326), 4096, 256,true ) geom, layer_id
      from
        objects
      where 
        map_id = '${mapId}'
    ),   
    tiles as (
      select 
        ST_AsMVT( mvtgeom.*, layer_id::text ) AS mvt
      from
        mvtgeom
      group by
        layer_id
      ) SELECT string_agg(mvt, '') from tiles;
    `;

	const response = await client.query(SQL);
	return response.rows[0].string_agg;
}

export async function postObject(
	mapId: string,
	object: Feature<Point, {id: string}>,
	layerId: string,
  properties: Record<string, string | number>
) {

  const SQL = `
    INSERT INTO objects(id, geom, map_id, layer_id, properties)
    VALUES ($1, $2, $3, $4, $5);
  `;

	return client.query(SQL, [object.properties.id, object.geometry, mapId, layerId, properties]);
}

export async function postObjects(
	mapId: string,
	objects: Feature<Point, {id: string}>[],
	layerId: string,
  properties: Record<string, string | number>[]
) {

  const SQL = `
    INSERT INTO objects (id, geom, map_id, layer_id, properties)
    SELECT
        unnest($1::uuid[]),
        unnest($2::public.geometry[]),
        $3,               
        $4,
        unnest($5::jsonb[]) 
  `;

	return client.query(pg.as.format(SQL, [objects.map((object) => object.properties.id), objects.map((object) => object.geometry), mapId, layerId, properties]));
}