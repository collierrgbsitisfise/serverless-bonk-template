# ⚡️⚡️⚡️ Serverless-Bonk-Template (aws)


[![serverless](http://public.serverless.com/badges/v3.svg)](http://www.serverless.com) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![Contributors][ico-contributors]][link-contributors] ![master status](https://github.com/collierrgbsitisfise/serverless-bonk-template/actions/workflows/main.yaml/badge.svg?branch=master)

_ _ _

<div style="text-align:center">
  <img src="https://dogemuchwow.com/wp-content/themes/dogeland/app/bonk/images/cheems.png" align="center"/>
</div>



[Serverless](https://www.serverless.com/) template(boilerplate) based on [serverless-webpack](https://github.com/serverless-heaven/serverless-webpack) + [typescript](https://www.typescriptlang.org/). Define project structure based on pseudo [onion](https://jeffreypalermo.com/2008/07/the-onion-architecture-part-1/) arhitecure(lambda -> service -> repository). Predefine `prettier/linter` rules, `lib/helpers` functions.

#### Example
___

### Next serverless plugins are used:

  - [serverless-webpack](https://github.com/serverless-heaven/serverless-webpack)
  - [serverless-offline](https://github.com/dherault/serverless-offline)
  - [serverless-dotenv-plugin](https://github.com/neverendingqs/serverless-dotenv-plugin)
  - [serverless-prune-plugin](https://github.com/claygregory/serverless-prune-plugin)
  - [serverless-iam-roles-per-function](https://github.com/functionalone/serverless-iam-roles-per-function)

___
### File structure 📁
```dotnetcli
.
├── resources                           # resourcersuch as VPC, DynamoDB Tables etc.
├── scripts                             # some helpers which will be used in CI/CD, development, etc.
├── schemas                             # schemas to validate API request on API gateway level
├── @mocks                              # mocks which will be used in tests
├── @types                              # types
├── env                                 # env files
├── lib                                 # helpers to operate with lambdas itself, should not be used inside lambdas.
    ├── apiGatewayLambdaWrapper.ts      # wrap lambdas which are linked by api gateway
    ├── cloudWatchLambdaWrapper.ts      # wrap lambdas which are subscribed to cloud watch event
    ├── snsLambdaWrapper.ts             # wrap lambdas which are subscribed to sns message
    ├── sqsLambdaWrapper.ts             # wrap lambdas which are subscribed to sqs message
    ├── dynamoDBStreamLambdaWrapper.ts  # wrap lambdas which are subscribed to dynamoDB stream
├── src
│   ├── functions                       # Lambda
│   │   ├── example
│   │   │   ├── example.ts              # `Example` lambda source code
│   │   │   ├── example.yaml            # `Example` function template part 
│   │   │
│   │   └── index.ts                    # Import/export all lambdas
│   │
│   └── helpers                         # Helpers which are used inside src folder, example - helper to receive secrets from secret manager
│   └── services                        # Services logic which will operate with external API/repostiroris, will contain domain logic
│   └── repositories                    # Layer which will operate with database
│
├── package.json
├── serverless.ts                       # Serverless service file
├── tsconfig.json                       # Typescript compiler configuration
├── tsconfig.paths.json                 # Typescript paths
└── webpack.config.js                   # Webpack configuration
└── .eslintrc.js                        # ESlint config
└── .prettierrc.js                      # Prettier config
```

___

### Scripts 📜


|     Command      |                             Script                              |
| :--------------: | :-------------------------------------------------------------: |
|       Lint       |                         `npm run lint`                          |
|     Prettier     |                       `npm run prettier`                        |
| Typescript check |                       `npm run ts-check`                        |
|    Setup env     | `ENV=<envValue> npm run setup # will create .env on root level` |

___

### How to deploy 🚀

- [Setup aws credentials](https://www.serverless.com/framework/docs/providers/aws/guide/credentials/)

- Run next commands
```bash
$: ENV=<envValue> npm run setup # setup env file
$: npm run deploy # deploy
```

___

### Folders purpose

#### libs ⚙️

On the `libs` folder are defined helpers/utils which will operate with lambda itself. The `libs` folder functions never should be used in inside handler. In boilerplate are predefined lambda wrappers for base case scenario lambda use: 
- lambda triggered by dynamodb stream
- lambda triggered by sns
- lambda triggered by sqs
- lambda triggered by cloudwatch event
- lambda tied to ApiGateway

<details>
  <summary>Wrapper for lambda tied to ApiGateway</summary>
  <p>


```javascript
import { DynamoDBStreamEvent, Context, Callback } from 'aws-lambda';

export const dynamoDblambdaWrapper = (
  lambda: (event: DynamoDBStreamEvent, context: Context, callback: Callback) => Promise<any>,
  onSucces: (event: DynamoDBStreamEvent, result: any) => any | PromiseLike<any>,
  onError: (event: DynamoDBStreamEvent, error: Error) => any | PromiseLike<any>,
) => {
  return function wrapp(event: DynamoDBStreamEvent, context?: Context, callback?: Callback): Promise<any> {
    return Promise.resolve()
      .then(() => lambda(event, context, callback))
      .then((res: any) => onSucces(event, res))
      .catch((err: Error) => onError(event, err));
  };
};

```

</p>
</details>

<details>
  <summary>Wrapper for lambda tied to dyanamoDB stream</summary>
  <p>


```javascript
import { APIGatewayEvent, Context, Callback, APIGatewayProxyResult } from 'aws-lambda';

export type Headers = { [key: string]: string };

export type LambdaFunction = (
  event: APIGatewayEvent,
  context?: Context,
  callback?: Callback,
) => [any, number, Headers] | Promise<[any, number, Headers]>;

export type OnSuccesHandler = (
  value: any,
  statusCode: number,
  headers?: Headers,
) => APIGatewayProxyResult | PromiseLike<APIGatewayProxyResult>;

export type OnErrorHandle = (error: Error) => Promise<APIGatewayProxyResult>;

const defaultHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
};

const onSuccesHandler = (
  data: any,
  statusCode: number,
  headers?: Headers,
): APIGatewayProxyResult | PromiseLike<APIGatewayProxyResult> => ({
  statusCode,
  headers: {
    ...defaultHeaders,
    ...headers,
  },
  body: JSON.stringify(data),
});

const onErrorHandler = async (error: Error): Promise<APIGatewayProxyResult> => {
  return {
    statusCode: 500,
    headers: defaultHeaders,
    body: JSON.stringify(error),
  };
};

export const apiGatewayLambdaWrapper = (
  lambda: LambdaFunction,
  onSucces: OnSuccesHandler = onSuccesHandler,
  onError: OnErrorHandle = onErrorHandler,
) => {
  return function wrapp(event: APIGatewayEvent, context: Context, callback: Callback): Promise<APIGatewayProxyResult> {
    return Promise.resolve()
      .then(() => lambda(event, context, callback))
      .then(([res, code, headers]: [any, number, Headers]) => onSucces(res, code, headers))
      .catch(onError);
  };
};


```

</p>
</details>

### @mocks 🗒️

Some raw data(example of sns message, api request, sqs message, etc) which could be used during local development or in test.

### @types 📚

general/shared types which could be used across project.

### env ⚆

For each environment should be predefined `<ENV>.env` ffile, which will be used by `setup-script` before deploy.

**Should not contain sensitive info such as secrets , db passwords, etc. Such kind of info must be retrived from secret-manager in runtime**

### resources 🔆

Define resources which will be created/updated on deploy, such as **dynamodb table**, **SqlRDSInstance**, etc.

### schemas ✅ 

Define request schemas by which ApiGateway will validate request. Also could be defined response schemas. All of them could be used in test or for swagger documentation.

### scripts 📜
`.js` files which usually are used in CI/CD(`setup-script`), also it could be used in development purpose, as example script which will use ngrok for setuping some webhooks.

### src 🗄️
describes the behavior of the function and its auxiliary components such as **services**, **repository**, **helpers**
### Resources:

https://medium.com/better-programming/set-up-your-serverless-project-with-typescript-ready-to-deploy-to-aws-6cfd7b2e5263

https://github.com/targoo/serverless-typescript-boilerplate

https://github.com/serverless/serverless/tree/master/lib/plugins/create/templates/aws-nodejs-typescript


[ico-contributors]: https://img.shields.io/github/contributors/collierrgbsitisfise/serverless-bonk-template.svg

[link-contributors]: https://github.com/collierrgbsitisfise/serverless-bonk-template

