import { serve } from "../deps.ts";
import { defineFuncs } from "../method.ts";
import { serverFunc } from "../../../mod.ts";

serve(async (request) => {
  return await serverFunc(defineFuncs, request);
});
