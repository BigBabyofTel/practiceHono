import { Hono } from "hono";
import { z, ZodError } from "zod";

const app = new Hono();

const user = z.object({
  name: z.string().min(3, 'must be at least 3 characters').trim(),
  email: z.string().email(),
  age: z.number(),
  password: z.string().min(5, 'password must be 5 characters long')
})

app.post("/", async(c) => {
  const body = await c.req.json();
  try{
    const {name, age, email} = user.parse(body);
    const payload = {
       name,
       age,
       email
    }
    return c.json(payload)
  } catch (e) {
    if (e instanceof ZodError) {
      console.log(e.errors);
      const arr = []
      for (let error of e.errors) {
        const errObj: Record<string, string> = {};
        const key = error.path[0];
        errObj[key] = error.message;
        arr.push(errObj)
      }
      c.status(422);
    return c.json({erorrs: arr})
    }
    c.status(500)
    return c.json({ msg: 'something went wrong'})
  }
});

export default app;
