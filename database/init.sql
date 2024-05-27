-- Install postgis
create extension postgis;

-- Maps table
create table maps (
    id uuid primary key,
    name varchar(50)
);

create type layertype as enum ('Fill', 'Line', 'Point');

--Layers table 
create table layers (
    id uuid primary key,
    name varchar,
    type layertype,
    map_id uuid,
    constraint fk_map_id foreign key (map_id) references maps(id) 
);

-- Objects table
create table objects (
    id uuid primary key,
    geom geometry,
    map_id uuid,
    layer_id uuid,
    properties jsonb,
    constraint fk_map_id foreign key (map_id) references maps(id),
    constraint fk_layer_id foreign key (layer_id) references layers(id)
);

-- Style table
create table layer_styles (
    id uuid primary key,
    layer_id uuid,
    colour varchar,
    size float,
    opacity float,
    constraint fk_layer_id foreign key (layer_id) references layers(id)
);

insert into maps (id, name)
values ('e57ae4ce-f9c8-43ad-ad8a-97c529cdc256', 'First map');