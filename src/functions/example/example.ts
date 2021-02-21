import 'source-map-support/register';
import { APIGatewayEvent } from 'aws-lambda';

import { apiGatewayLambdaWrapper } from './../../../libs';

export const exmapleFunc = (event: APIGatewayEvent): [any, number] => {
  console.log('event : ', event);
  return [{ success: true }, 200];
};

export const main = apiGatewayLambdaWrapper(exmapleFunc);
