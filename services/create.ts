import { DynamoDB } from 'aws-sdk';
import { v4 } from 'uuid';

const TABLE_NAME = process.env.TABLE_NAME;
const dbClient = new DynamoDB.DocumentClient();
interface Item {
  name: string;
  createdAt: string;
  id: string;
}
exports.handler = async (event: any) => {
  try {
    const msec = Date.parse(event.Records[0].eventTime);
    const date = new Date(msec + 3 * 60 * 60 * 1000);
    const item: Item = {
      name: event.Records[0].s3.object.key,
      createdAt: date.toISOString(),
      id: v4(),
    };

    await dbClient
      .put({
        TableName: TABLE_NAME!,
        Item: item,
      })
      .promise();
  } catch (error) {
    console.log(error);
  }
};
