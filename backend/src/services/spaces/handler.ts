import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { postSpaces } from "./PostSpace";
import { getSpaces } from "./GetSpace";
import { updateSpace } from "./UpdateSpace";
import { deleteSpace } from "./DeleteSpace";
import { JsonError, MissingFieldError } from "../shared/Validator";
import { addCorsHeader } from "../shared/Utils";


const ddbClient = new DynamoDBClient({});

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {

    let response: APIGatewayProxyResult;

    try {
        switch (event.httpMethod) {
            case 'GET':
                const getResponse = await getSpaces(event, ddbClient);
                console.log(getResponse)
                response = getResponse;
            case 'POST':
                const postResponse = await postSpaces(event, ddbClient);
                response = postResponse;
            case 'PUT':
                const putResponse = await updateSpace(event, ddbClient);
                console.log(putResponse)
                response = putResponse;
            case 'DELETE':
                const deleteResponse = await deleteSpace(event, ddbClient);
                console.log(deleteResponse)
                response = deleteResponse;
            default:
                break;
        }
    } catch (error) {
        if (error instanceof MissingFieldError) {
            return {
                statusCode: 400,
                body: error.message
            }
        }
        if (error instanceof JsonError) {
            return {
                statusCode: 400,
                body: error.message
            }
        }
        return {
            statusCode: 500,
            body: error.message
        }
    }
    addCorsHeader(response);
    return response;
}

export { handler }