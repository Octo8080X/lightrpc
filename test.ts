import { assertEquals } from "https://deno.land/std@0.157.0/testing/asserts.ts";
import * as mf from "https://deno.land/x/mock_fetch@0.3.0/mod.ts";
import { superdeno } from "https://deno.land/x/superdeno/mod.ts";
import { Server } from "https://deno.land/std@0.156.0/http/server.ts";
import { clientFunc, serverFunc } from "./mod.ts";

const defineFuncs = {
  add: (p1: number, p2: number): number => {
    return p1 + p2;
  },
  join: (p1: string, p2: string, separator = ""): string => {
    return `${p1}${separator}${p2}`;
  },
} as const;

Deno.test("#1 clientFunc Test", async () => {
  mf.install();
  mf.mock("POST@/", (_req, _params) => {
    return Response.json(
      { result: 579 },
    );
  });

  const result = await clientFunc<typeof defineFuncs>("http://localhost:8000")
    .add(
      123,
      456,
    );

  assertEquals(result, 579);
  mf.uninstall();
});

export const server = new Server({
  handler: async (request: Request) => {
    return await serverFunc(defineFuncs, request);
  },
  port: 8080,
});

Deno.test("#2 serverFunc Test", async () => {
  const res = await superdeno(server)
    .post("/")
    .set("Accept", "application/json")
    .send({ methodName: "join", params: ["Hello", "World", " "] }) // <= json を送る
    .expect("Content-Type", "application/json")
    .expect(200);

  const { result } = JSON.parse(res.text);

  assertEquals(result, "Hello World");
});
