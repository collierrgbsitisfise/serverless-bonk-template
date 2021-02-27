import { APIGatewayEvent, Context, Callback, APIGatewayProxyResult } from 'aws-lambda';

type Headers = { [key: string]: string };

type LambdaFunction = (
  event: APIGatewayEvent,
  context?: Context,
  callback?: Callback,
) => [any, number, Headers] | Promise<[any, number, Headers]>;

type OnSuccesHandler = (
  value: any,
  statusCode: number,
  headers?: Headers,
) => APIGatewayProxyResult | PromiseLike<APIGatewayProxyResult>;

type OnErrorHandle = (error: Error) => Promise<APIGatewayProxyResult>;

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
  lambda: LambdaFunction,
  onSucces: OnSuccesHandler = onSuccesHandler,
  onError: OnErrorHandle = onErrorHandler,
) => {
  return function wrapp(event: APIGatewayEvent, context: Context, callback: Callback): Promise<APIGatewayProxyResult> {
    return Promise.resolve()
      .then(() => lambda(event, context, callback))
      .then(([res, code, headers]: [any, number, Headers]) => onSucces(res, code, headers))
      .catch(onError);
  };
};
