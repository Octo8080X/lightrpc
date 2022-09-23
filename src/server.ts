type RpcRequest = {
  methodName: string;
  params: unknown[];
};

function isRpcRequest(obj: unknown): obj is RpcRequest {
  return (typeof obj === "object" && obj !== null && "methodName" in obj &&
    "params" in obj);
}

async function doProcess<
  T extends { [key: string]: (...args: unknown[]) => unknown },
>(
  funcs: T,
  request: Request,
) {
  const reqJson = await request.json();

  if (!isRpcRequest(reqJson)) throw new Error();
  if (!Object.keys(funcs).find((k) => k === reqJson.methodName)) {
    throw new Error();
  }

  return await funcs[reqJson.methodName].apply(null, reqJson.params);
}

async function makeResponse(result: unknown): Promise<Response> {
  return await Response.json(
    {
      result,
    },
  );
}

export async function serverFunc<
  T extends { [key: string]: (...args: any[]) => unknown },
>(
  funcs: T,
  request: Request,
  opts?: {
    middleware: (
      request: Request,
      next: () => Promise<Response>,
    ) => Promise<Response>;
  },
): Promise<Response> {
  if (opts?.middleware) {
    return await opts.middleware(request.clone(), async () => {
      return makeResponse(await doProcess(funcs, request.clone()));
    });
  }

  return makeResponse(await doProcess(funcs, request.clone()));
}
