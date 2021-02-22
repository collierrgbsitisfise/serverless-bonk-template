import * as AWS from 'aws-sdk';
import { DynamoDB } from 'aws-sdk/clients/all';
import { PromiseResult } from 'aws-sdk/lib/request';

const client = new DynamoDB.DocumentClient();

export type getParams = DynamoDB.DocumentClient.GetItemInput;
export type putParams = DynamoDB.DocumentClient.PutItemInput;
export type queryParams = DynamoDB.DocumentClient.QueryInput;
export type updateParams = DynamoDB.DocumentClient.UpdateItemInput;
export type deleteParams = DynamoDB.DocumentClient.DeleteItemInput;
export type getResponse = Promise<PromiseResult<DynamoDB.DocumentClient.GetItemOutput, AWS.AWSError>>;
export type putResponse = Promise<PromiseResult<DynamoDB.DocumentClient.PutItemOutput, AWS.AWSError>>;
export type queryResponse = Promise<PromiseResult<DynamoDB.DocumentClient.QueryOutput, AWS.AWSError>>;
export type updateResponse = Promise<PromiseResult<DynamoDB.DocumentClient.UpdateItemOutput, AWS.AWSError>>;
export type deleteResponse = Promise<PromiseResult<DynamoDB.DocumentClient.DeleteItemOutput, AWS.AWSError>>;

export class BaseDynamoService {
  public get(params: getParams): getResponse {
    return client.get(params).promise();
  }

  public put(params: putParams): putResponse {
    return client.put(params).promise();
  }

  public query(params: queryParams): queryResponse {
    return client.query(params).promise();
  }

  public update(params: updateParams): updateResponse {
    return client.update(params).promise();
  }

  public delete(params: deleteParams): deleteResponse {
    return client.delete(params).promise();
  }
}
