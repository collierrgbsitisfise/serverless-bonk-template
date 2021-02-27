import { APIGatewayEvent, Context, Callback, APIGatewayProxyResult } from 'aws-lambda';

type Headers = { [key: string]: string };

const defaultHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
};

const onSuccesHandler = (
  data: any,
  statusCode: number,
  headers?: Headers,
): APIGatewayProxyResult | PromiseLike<APIGatewayProxyResult> => ({
  statusCode,
  headers: {
    ...defaultHeaders,
    ...headers,
  },
  body: JSON.stringify(data),
});

const onErrorHandler = async (error: Error): Promise<APIGatewayProxyResult> => {
  return {
    statusCode: 500,
    headers: defaultHeaders,
    body: JSON.stringify(error),
  };
};

export const apiGatewayLambdaWrapper = (
  lambda: (
    event: APIGatewayEvent,
    context?: Context,
    callback?: Callback,
  ) => [any, number, Headers] | Promise<[any, number, Headers]>,
  onSucces: (
    value: any,
    statusCode: number,
    headers?: Headers,
  ) => APIGatewayProxyResult | PromiseLike<APIGatewayProxyResult> = onSuccesHandler,
  onError: (error: Error) => Promise<APIGatewayProxyResult> = onErrorHandler,
) => {
  return function wrapp(event: APIGatewayEvent, context: Context, callback: Callback): Promise<APIGatewayProxyResult> {
    return Promise.resolve()
      .then(() => lambda(event, context, callback))
      .then(([res, code, headers]: [any, number, Headers]) => onSucces(res, code, headers))
      .catch(onError);
  };
};
