import { CloudWatchLogsEvent, Context, Callback } from 'aws-lambda';

import { cloudWatcEventhLambdaWrapper } from './cloudWatchLambdaWrapper';

describe('cloudWatcEventhLambdaWrapper', () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  const fakeLambdaResponse = {
    data: 'some data',
  };
  const fakeEvent = {} as CloudWatchLogsEvent;
  const fakeContext = {} as Context;
  const fakeCallBack = jest.fn() as Callback;

  it('should call "onSucces" handler', async () => {
    const lambda = jest.fn().mockReturnValueOnce(fakeLambdaResponse);
    const successHandler = jest.fn();
    const errorHandler = jest.fn();

    const executable = cloudWatcEventhLambdaWrapper(lambda, successHandler, errorHandler);
    expect.assertions(4);
    const res = await executable(fakeEvent, fakeContext, fakeCallBack);
    expect(res).toMatchSnapshot();
    expect(lambda).toBeCalledWith(fakeEvent, fakeContext, fakeCallBack);
    expect(successHandler).toBeCalledWith(fakeEvent, fakeLambdaResponse);
    expect(errorHandler).not.toBeCalledWith();
  });

  it('should call "onError" handler', async () => {
    const lambda = jest.fn().mockRejectedValueOnce(fakeLambdaResponse);
    const successHandler = jest.fn();
    const errorHandler = jest.fn();

    const executable = cloudWatcEventhLambdaWrapper(lambda, successHandler, errorHandler);
    expect.assertions(4);
    const res = await executable(fakeEvent, fakeContext, fakeCallBack);
    expect(res).toMatchSnapshot();
    expect(lambda).toBeCalledWith(fakeEvent, fakeContext, fakeCallBack);
    expect(successHandler).not.toBeCalledWith();
    expect(errorHandler).toBeCalledWith(fakeEvent, fakeLambdaResponse);
  });
});