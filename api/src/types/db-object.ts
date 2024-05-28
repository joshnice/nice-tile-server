export interface DbObject {
    id: string;
    layer_id: string;
    geom: string;
    properties: Record<string, string | number | boolean>;
}