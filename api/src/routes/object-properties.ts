import { Hono } from "hono"
import { getObjectProperties, updateObjectProperties } from "../models/object-properties";
import { validator } from "hono/validator";

export const objectPropertiesRoute = new Hono();

objectPropertiesRoute.get("/:id", async (ctx) => {
    const objectId = ctx.req.param("id");

    const properties = await getObjectProperties(objectId);

    ctx.json(properties);
});

objectPropertiesRoute.patch("", validator("json", (body, ctx) => {
    const objectId = body.objectId;
    const properties = body.properties;
    if (objectId != null && properties != null) {
        return { body };
    }
    ctx.text("Invalid!", 400);
}),
async (ctx) => {
	const { body } = await ctx.req.json();
    await updateObjectProperties(body.objectId, body.properties);
    return ctx.text("Success", 200);
});