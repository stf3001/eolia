import { APIGatewayProxyHandlerV2 } from 'aws-lambda'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'
import { formatJSONResponse } from '../../services/response'
import { randomUUID } from 'crypto'

const client = new DynamoDBClient({})
const docClient = DynamoDBDocumentClient.from(client)

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const body = JSON.parse(event.body || '{}')
    
    const product = {
      productId: randomUUID(),
      ...body,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    await docClient.send(
      new PutCommand({
        TableName: process.env.PRODUCTS_TABLE!,
        Item: product,
      })
    )

    return formatJSONResponse(201, product)
  } catch (err) {
    console.error('Error creating product:', err)
    return formatJSONResponse(500, { message: 'Erreur lors de la création du produit' })
  }
}
