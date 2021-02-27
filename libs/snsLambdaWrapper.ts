import { SNSEvent, Context, Callback } from 'aws-lambda';

export const snsLambdaWrapper = (
  lambda: (event: SNSEvent, context: Context, callback: Callback) => Promise<any>,
  onSucces: (event: SNSEvent, result: any) => any | PromiseLike<any>,
  onError: (event: SNSEvent, error: Error) => any | PromiseLike<any>,
) => {
  return function wrapp(event: SNSEvent, context?: Context, callback?: Callback): Promise<any> {
    return Promise.resolve()
      .then(() => lambda(event, context, callback))
      .then((res: any) => onSucces(event, res))
      .catch((err: Error) => onError(event, err));
  };
};
