import { defineFuncs } from "../method.ts";
import { clientFunc } from "../../../mod.ts";

console.log(
  await clientFunc<typeof defineFuncs>("http://localhost:8000").add(
    123,
    456,
  ),
);

console.log(
  await clientFunc<typeof defineFuncs>("http://localhost:8000").join(
    "Hello",
    "World"
  ),
);
