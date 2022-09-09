import type { AppSyncResolverHandler } from "aws-lambda";
import { DynamoDB } from "aws-sdk";

type Book = {
  id: string;
  title: string;
  completed?: boolean;
  rating?: number;
  reviews?: string[];
};

const documentClient = new DynamoDB.DocumentClient();
export const handler: AppSyncResolverHandler<
  null,
  Book[] | null
> = async () => {
  try {
    if (!process.env.BOOKS_TABLE) {
      console.log("Error: BOOKS_TABLE was not specified");
      return null;
    }

    const data = await documentClient
      .scan({
        TableName: process.env.BOOKS_TABLE,
      })
      .promise();

    return data.Items as Book[];
  } catch (e) {
    console.error("Whoops", e);
    return null;
  }
};
