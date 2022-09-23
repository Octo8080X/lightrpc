# LightRPC

Light, simple, easy type-safe RPC for Typescript.

lightrpc is Inspired by [trpc](https://github.com/trpc/trpc),
[gentle_rpc](https://github.com/timonson/gentle_rpc).

# Usage

1. Define Method.

```ts
// method.ts
export const defineFuncs = {
  add: (p1: number, p2: number): number => {
    return p1 + p2;
  },
  join: (p1: string, p2: string, separator = ''): string => {
    return `${p1}${separator}${p2}`;
  },
} as const;
```

2. Define server and start. 

```ts
// server_main.ts
import { serve } from "https://deno.land/std@0.156.0/http/server.ts";
import { defineFuncs } from "./method.ts";
import { serverFunc } from "https://deno.land/x/lightrpc/mod.ts";

serve(async (request) => {
  return await serverFunc(defineFuncs, request);
});
```

```sh
> deno run --allow-net=0.0.0.0:8000 server_main.ts
Listening on http://localhost:8000/
```

3. Define client asd start.

```ts
// client_main.ts
import { defineFuncs } from "./method.ts";
import { clientFunc } from "https://deno.land/x/lightrpc/mod.ts";

console.log(
  await clientFunc<typeof defineFuncs>("http://localhost:8000").add(
    123,
    456,
  ),
);
// => 579

console.log(
  await clientFunc<typeof defineFuncs>("http://localhost:8000").join(
    "Hello",
    "World",
  ),
);
// => Hello World
```

```sh
> deno run --allow-net=localhost:8000 client_main.ts
579
HelloWorld
```

