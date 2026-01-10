import { APIGatewayProxyHandlerV2 } from 'aws-lambda'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb'
import { formatJSONResponse } from '../../services/response'

const client = new DynamoDBClient({})
const docClient = DynamoDBDocumentClient.from(client)

export const handler: APIGatewayProxyHandlerV2 = async () => {
  try {
    const result = await docClient.send(
      new ScanCommand({
        TableName: process.env.PRODUCTS_TABLE!,
      })
    )

    return formatJSONResponse(200, result.Items || [])
  } catch (err) {
    console.error('Error fetching products:', err)
    return formatJSONResponse(500, { message: 'Erreur lors de la récupération des produits' })
  }
}
