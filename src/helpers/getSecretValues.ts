import * as AWS from 'aws-sdk';

const { REGION } = process.env;

const client = new AWS.SecretsManager({
  region: REGION,
});

export const TIME_INTERVAL: number = 1000 * 60 * 10; // 10 minutes

const secretsMap: Map<
  string,
  {
    timestamp: number;
    values: { [index: string]: string };
  }
> = new Map();

export const getSecretValue = (secretId: string) => async (...keys: string[]): Promise<string[]> => {
  const currentTimeStamp = +new Date();

  const isExpired = secretsMap.get(secretId) && currentTimeStamp - secretsMap.get(secretId).timestamp > TIME_INTERVAL;

  console.log('isExpired : ', isExpired);
  if (isExpired) {
    secretsMap.delete(secretId);
  }

  if (!secretsMap.get(secretId)) {
    const { SecretString } = await client.getSecretValue({ SecretId: secretId }).promise();
    secretsMap.set(secretId, {
      timestamp: +new Date(),
      values: JSON.parse(SecretString),
    });
  }

  const secrets = secretsMap.get(secretId).values;
  return keys.map((key: string) => secrets[key]);
};
