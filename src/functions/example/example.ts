import 'source-map-support/register';
import { APIGatewayEvent, Context, Callback } from 'aws-lambda';

import { apiGatewayLambdaWrapper } from './../../../libs'

export const exmapleFunc = (event: APIGatewayEvent, _context: Context, _callBack: Callback): [any, number] => {
  console.log('event : ', event);
  return [{ success: true }, 200];
}

export const main = apiGatewayLambdaWrapper(exmapleFunc);