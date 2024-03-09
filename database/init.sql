-- Install postgis
create extension postgis;

-- Maps table
create table maps (
    id uuid primary key,
    name varchar(50)
);

-- Objects table
create table objects (
    id uuid primary key,
    geom geometry,
    map_id uuid,
    layer varchar,
    constraint fk_map_id foreign key(map_id) references maps(id)
);