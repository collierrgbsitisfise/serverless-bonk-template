import { APIGatewayEvent, Context, Callback, APIGatewayProxyResult } from 'aws-lambda';

const defaultHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
};

const onSuccesHandler = (
  data: any,
  statusCode: number,
): APIGatewayProxyResult | PromiseLike<APIGatewayProxyResult> => ({
  statusCode,
  headers: defaultHeaders,
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
  lambda: (event: APIGatewayEvent, context?: Context, callback?: Callback) => [any, number] | Promise<[any, number]>,
  onSucces: (
    value: any,
    statusCode: number,
  ) => APIGatewayProxyResult | PromiseLike<APIGatewayProxyResult> = onSuccesHandler,
  onError: (error: Error) => Promise<APIGatewayProxyResult> = onErrorHandler,
) => {
  return function wrapp(event: APIGatewayEvent, context: Context, callback: Callback): Promise<APIGatewayProxyResult> {
    return Promise.resolve()
      .then(() => lambda(event, context, callback))
      .then(([res, code]: [any, number]) => onSucces(res, code))
      .catch(onError);
  };
};
