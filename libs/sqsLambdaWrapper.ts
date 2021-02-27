import { SQSEvent, Context, Callback } from 'aws-lambda';

export const sqsLambdaWrapper = (
  lambda: (event: SQSEvent, context: Context, callback: Callback) => Promise<any>,
  onSucces: (event: SQSEvent, result: any) => any | PromiseLike<any>,
  onError: (event: SQSEvent, error: Error) => any | PromiseLike<any>,
) => {
  return function wrapp(event: SQSEvent, context?: Context, callback?: Callback): Promise<any> {
    return Promise.resolve()
      .then(() => lambda(event, context, callback))
      .then((res: any) => onSucces(event, res))
      .catch((err: Error) => onError(event, err));
  };
};
