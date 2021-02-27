import 'source-map-support/register';
import { APIGatewayEvent } from 'aws-lambda';

import { apiGatewayLambdaWrapper, Headers } from './../../../libs';

export const exmapleFunc = (event: APIGatewayEvent): [any, number, Headers] => {
  console.log('event : ', event);
  return [{ success: true }, 200, {}];
};

export const main = apiGatewayLambdaWrapper(exmapleFunc);
