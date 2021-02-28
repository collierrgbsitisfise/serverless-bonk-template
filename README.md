# ⚡️⚡️⚡️ Serverless-Bonk-Template (aws)


[![Serverless][ico-serverless]][link-serverless]
[![License][ico-license]][link-license]
[![NPM][ico-npm]][link-npm]

![bonk](https://dogemuchwow.com/wp-content/themes/dogeland/app/bonk/images/cheems.png)


[Serverless](https://www.serverless.com/) template(boilerplate) based on [serverless-webpack](https://github.com/serverless-heaven/serverless-webpack) + [typescript](https://www.typescriptlang.org/). Define project structure based on preudo [onion](https://jeffreypalermo.com/2008/07/the-onion-architecture-part-1/) arhitecure(lambda-handler -> service -> repository). Predefine `prettier/linter` rules, `lib/helpers` functions.

### Next serverless plugins are used:

  - [serverless-webpack](https://github.com/serverless-heaven/serverless-webpack)
  - [serverless-offline](https://github.com/dherault/serverless-offline)
  - [serverless-dotenv-plugin](https://github.com/neverendingqs/serverless-dotenv-plugin)
  - [serverless-prune-plugin](https://github.com/claygregory/serverless-prune-plugin)
  - [serverless-iam-roles-per-function](https://github.com/functionalone/serverless-iam-roles-per-function)

### File structure
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

### Scripts


| Command            | Script                                                          |
| :----------------: | :--------------:                                                |
|  Lint              | `npm run lint`                                                  |
|  Prettier          | `npm run prettier`                                              |
|  Typescript check  | `npm run ts-check`                                              |
|  Setup env         | `ENV=<envValue> npm run setup # will create .env on root level` |

### How to deploy

- [Setup aws credentials](https://www.serverless.com/framework/docs/providers/aws/guide/credentials/)

- Run next commands
```bash
$: ENV=<envValue> npm run setup # setup env file
$: npm run deploy # deploy
```

### Resources:

https://medium.com/better-programming/set-up-your-serverless-project-with-typescript-ready-to-deploy-to-aws-6cfd7b2e5263

https://github.com/targoo/serverless-typescript-boilerplate

https://github.com/serverless/serverless/tree/master/lib/plugins/create/templates/aws-nodejs-typescript
