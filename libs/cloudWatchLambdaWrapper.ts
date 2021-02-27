import { CloudWatchLogsEvent, Context, Callback } from 'aws-lambda';

export const cloudWatcEventhLambdaWrapper = (
  lambda: (event: CloudWatchLogsEvent, context: Context, callback: Callback) => Promise<any>,
  onSucces: (event: CloudWatchLogsEvent, result: any) => any | PromiseLike<any>,
  onError: (event: CloudWatchLogsEvent, error: Error) => any | PromiseLike<any>,
) => {
  return function wrapp(event: CloudWatchLogsEvent, context?: Context, callback?: Callback): Promise<any> {
    return Promise.resolve()
      .then(() => lambda(event, context, callback))
      .then((res: any) => onSucces(event, res))
      .catch((err: Error) => onError(event, err));
  };
};
