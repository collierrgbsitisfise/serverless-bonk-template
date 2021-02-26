import * as AWS from 'aws-sdk';
import { DynamoDB } from 'aws-sdk/clients/all';
import { PromiseResult } from 'aws-sdk/lib/request';

const client = new DynamoDB.DocumentClient();

export type GetParams = DynamoDB.DocumentClient.GetItemInput;
export type PutParams = DynamoDB.DocumentClient.PutItemInput;
export type QueryParams = DynamoDB.DocumentClient.QueryInput;
export type UpdateParams = DynamoDB.DocumentClient.UpdateItemInput;
export type DeleteParams = DynamoDB.DocumentClient.DeleteItemInput;
export type GetResponse = Promise<PromiseResult<DynamoDB.DocumentClient.GetItemOutput, AWS.AWSError>>;
export type PutResponse = Promise<PromiseResult<DynamoDB.DocumentClient.PutItemOutput, AWS.AWSError>>;
export type QueryResponse = Promise<PromiseResult<DynamoDB.DocumentClient.QueryOutput, AWS.AWSError>>;
export type UpdateResponse = Promise<PromiseResult<DynamoDB.DocumentClient.UpdateItemOutput, AWS.AWSError>>;
export type DeleteResponse = Promise<PromiseResult<DynamoDB.DocumentClient.DeleteItemOutput, AWS.AWSError>>;

export class BaseDynamoService {
  public get(params: GetParams): GetResponse {
    return client.get(params).promise();
  }

  public put(params: PutParams): PutResponse {
    return client.put(params).promise();
  }

  public query(params: QueryParams): QueryResponse {
    return client.query(params).promise();
  }

  public update(params: UpdateParams): UpdateResponse {
    return client.update(params).promise();
  }

  public delete(params: DeleteParams): DeleteResponse {
    return client.delete(params).promise();
  }
}
