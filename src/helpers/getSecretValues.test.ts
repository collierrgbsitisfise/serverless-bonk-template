const getSecretValueMock = jest.fn(() => {
  const SecretString = JSON.stringify({
    login: 'somelogin',
    password: 'somepassword'
  });
  return {
    promise: jest.fn().mockResolvedValue({
      SecretString,
    })
  }
});

jest.mock('aws-sdk', () => {
  return {
    SecretsManager: jest.fn(() => {
      return { getSecretValue: getSecretValueMock }
    })
  }
})

import { getSecretValues, TIME_INTERVAL } from './getSecretValues';

describe('getSecretValues', () => {

  afterAll(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should returnu secrets', async () => {
    const secretId = 'secret';
    const keys = ['login', 'password'];

    const result = await getSecretValues(secretId)(...keys);
    expect(getSecretValueMock).toBeCalledWith({
      SecretId: secretId,
    });
    expect(result[0]).toBe('somelogin');
    expect(result[1]).toBe('somepassword');
  });

  it('should return secrets from "cache"', async () => {
    const secretId = 'secret';
    const keys = ['login', 'password'];

    const result = await getSecretValues(secretId)(...keys);
    expect(getSecretValueMock).not.toBeCalled();
    expect(result[0]).toBe('somelogin');
    expect(result[1]).toBe('somepassword');
  });

  it('should clear cache and return secrets if "cache" was expired', async () => {
    const currentDate = +new Date();
    const mockedDate = new Date(currentDate + TIME_INTERVAL);
    jest
      .spyOn(global, 'Date')
      // @ts-ignore
      .mockReturnValueOnce(mockedDate);

    const secretId = 'secret';
    const keys = ['login', 'password'];

    const result = await getSecretValues(secretId)(...keys);
    expect(getSecretValueMock).toBeCalled();
    expect(result[0]).toBe('somelogin');
    expect(result[1]).toBe('somepassword');
  });
});
