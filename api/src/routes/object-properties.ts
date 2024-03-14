import { Hono } from "hono"
import { getObjectProperties, updateObjectProperties } from "../models/object-properties";
import { validator } from "hono/validator";

export const objectPropertiesRoute = new Hono();

objectPropertiesRoute.get("/:id", async (ctx) => {
    const objectId = ctx.req.param("id");

    const properties = await getObjectProperties(objectId);

    return ctx.json(properties);
});

objectPropertiesRoute.put("/:id", async (ctx) => {
    const id = ctx.req.param("id");
    const body = await ctx.req.json();
    await updateObjectProperties(id, body);
    return ctx.text("Success", 200);
});