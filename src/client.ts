export function clientFunc<
  T extends { [key: string]: (...args: any[]) => unknown },
>(
  endPoint: string,
  headers?: { [key: string]: string },
  credentials?: RequestCredentials,
): T {
  return new Proxy({}, {
    get(_target, prop, _receive) {
      return async (...args: unknown[]) => {
        try {
          const response = await fetch(endPoint, {
            method: "POST",
            body: JSON.stringify({ methodName: prop, params: args }),
            headers,
            credentials,
          });

          if (!response.ok) throw new Error("Response status is not OK!");

          const responseJson = await response.json();
          
          if (!responseJson) throw new Error("Response is not json!");
          if (!responseJson?.result) {
            throw new Error("Response is not have property 'result'!");
          }

          return responseJson.result;
        } catch (e) {
          console.error(e);
        }
      };
    },
  }) as T;
}
