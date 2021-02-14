import { DynamoDBStreamEvent, Context, Callback } from 'aws-lambda';

export const lambdaWrapper = (
  lambda: (event: DynamoDBStreamEvent, context: Context, callback: Callback) => Promise<any>,
  onSucces: (event: DynamoDBStreamEvent, result: any) => any | PromiseLike<any>,
  onError: (event: DynamoDBStreamEvent, error: Error) => any | PromiseLike<any>,
) => {
  return function wrapp(event: DynamoDBStreamEvent, context: Context, callback: Callback): Promise<any> {
    return Promise.resolve()
      .then(() => lambda(event, context, callback))
      .then((res: any) => onSucces(event, res))
      .catch((err: Error) => onError(event, err));
  };
};
