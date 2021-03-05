import { APIGatewayEvent, Context, Callback } from 'aws-lambda';

import { apiGatewayLambdaWrapper } from './apiGatewayLambdaWrapper';

describe('apiGatewayLambdaWrapper', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it('should call "onSuccesHandler"', async () => {
    const fakeEvent = {} as APIGatewayEvent;
    const fakeContext = {} as Context;
    const fakeCallBack = jest.fn() as Callback;

    const lambdaResponse = [{}, 200, {}];
    const successHandler = jest.fn();
    const errorHandle = jest.fn();
    const lambda = jest.fn().mockReturnValueOnce(lambdaResponse);

    const executable = apiGatewayLambdaWrapper(lambda, successHandler, errorHandle);
    expect.assertions(4);
    const result = await executable(fakeEvent, fakeContext, fakeCallBack);

    expect(result).toMatchSnapshot();
    expect(lambda).toBeCalledWith(fakeEvent, fakeContext, fakeCallBack);
    expect(successHandler).toBeCalledWith(...lambdaResponse);
    expect(errorHandle).not.toBeCalled();
  });

  it('should call "onErrorHandler"', async () => {
    const fakeEvent = {} as APIGatewayEvent;
    const fakeContext = {} as Context;
    const fakeCallBack = jest.fn() as Callback;
    const fakeError = 'error message';

    const successHandler = jest.fn();
    const errorHandle = jest.fn();
    const lambda = jest.fn().mockRejectedValueOnce('error message');

    const executable = apiGatewayLambdaWrapper(lambda, successHandler, errorHandle);
    expect.assertions(4);
    const result = await executable(fakeEvent, fakeContext, fakeCallBack);

    expect(result).toMatchSnapshot();
    expect(lambda).toBeCalledWith(fakeEvent, fakeContext, fakeCallBack);
    expect(successHandler).not.toBeCalled();
    expect(errorHandle).toBeCalledWith(fakeError);
  });
});
