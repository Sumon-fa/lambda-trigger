import * as cdk from 'aws-cdk-lib';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as eventsources from 'aws-cdk-lib/aws-lambda-event-sources';
import { Construct } from 'constructs';
import { RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';

export class MaasGlobalAssignmentStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const table = new Table(this, 'table', {
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING,
      },
      tableName: 'MyTable',
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const bucket = new s3.Bucket(this, 'MyBucket', {
      bucketName: 'mybucket' + this.urlSuffix,
      autoDeleteObjects: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const lambdaFunction = new NodejsFunction(this, 'createObject', {
      entry: join(__dirname, '..', 'services', 'create.ts'),
      handler: 'handler',
      logRetention: logs.RetentionDays.ONE_DAY,
      environment: {
        TABLE_NAME: 'MyTable',
      },
    });

    const s3PutEventSource = new eventsources.S3EventSource(bucket, {
      events: [s3.EventType.OBJECT_CREATED_PUT],
    });

    lambdaFunction.addEventSource(s3PutEventSource);
    table.grantWriteData(lambdaFunction);
  }
}
