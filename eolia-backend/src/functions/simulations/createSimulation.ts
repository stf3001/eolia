import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { formatJSONResponse } from '../../services/response';
import { verifyAuth } from '../../services/auth';
import { dynamoDb, Tables } from '../../services/dynamodb';

const MAX_SIMULATIONS = 10;

interface SimulationInputs {
  departmentCode: string;
  departmentName: string;
  powerKwc: number;
  turbineCount: number;
  anemometerSpeed?: number;
  anemometerMonth?: number;
}

interface SimulationResults {
  annualProduction: number;
  annualSavings: number;
  monthlyProduction: number[];
  usedAnemometerData: boolean;
  scalingFactor?: number;
}

interface SimulationConsumptionData {
  mode: 'default' | 'simple' | 'precise' | 'enedis';
  annualTotal: number;
  monthlyValues: number[];
}

interface SimulationBatteryData {
  capacity: number;
}

interface SimulationAutoconsumptionResults {
  natural: number;
  withBattery?: number;
  rate: number;
  surplus: number;
}

interface CreateSimulationRequest {
  inputs: SimulationInputs;
  results: SimulationResults;
  consumption?: SimulationConsumptionData;
  battery?: SimulationBatteryData;
  autoconsumption?: SimulationAutoconsumptionResults;
}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const authHeader = event.headers?.Authorization || event.headers?.authorization;
    const claims = await verifyAuth(authHeader);
    const userId = claims.sub;

    if (!event.body) {
      return formatJSONResponse(400, {
        error: 'VALIDATION_ERROR',
        message: 'Request body is required',
      });
    }

    const body: CreateSimulationRequest = JSON.parse(event.body);

    // Validate required fields
    if (!body.inputs || !body.results) {
      return formatJSONResponse(400, {
        error: 'VALIDATION_ERROR',
        message: 'Missing required fields: inputs, results',
      });
    }

    if (!body.inputs.departmentCode || !body.inputs.departmentName || 
        !body.inputs.powerKwc || !body.inputs.turbineCount) {
      return formatJSONResponse(400, {
        error: 'VALIDATION_ERROR',
        message: 'Missing required input fields: departmentCode, departmentName, powerKwc, turbineCount',
      });
    }

    // Check simulation limit
    const existingSimulations = await dynamoDb.send(
      new QueryCommand({
        TableName: Tables.SIMULATIONS,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId,
        },
        Select: 'COUNT',
      })
    );

    const currentCount = existingSimulations.Count || 0;
    if (currentCount >= MAX_SIMULATIONS) {
      return formatJSONResponse(400, {
        error: 'LIMIT_REACHED',
        message: `Vous avez atteint la limite de ${MAX_SIMULATIONS} simulations. Supprimez-en une depuis votre espace client.`,
      });
    }

    const simulationId = uuidv4();
    const now = Date.now();
    const dateStr = new Date(now).toLocaleDateString('fr-FR');
    const name = `Simulation ${body.inputs.departmentName} - ${dateStr}`;

    // Build inputs with optional consumption and battery data
    const inputs: Record<string, unknown> = { ...body.inputs };
    if (body.consumption) {
      inputs.consumption = body.consumption;
    }
    if (body.battery) {
      inputs.battery = body.battery;
    }

    // Build results with optional autoconsumption data
    const results: Record<string, unknown> = { ...body.results };
    if (body.autoconsumption) {
      results.autoconsumption = body.autoconsumption;
    }

    const simulation = {
      userId,
      simulationId,
      name,
      inputs,
      results,
      createdAt: now,
    };

    await dynamoDb.send(
      new PutCommand({
        TableName: Tables.SIMULATIONS,
        Item: simulation,
      })
    );

    return formatJSONResponse(201, {
      simulationId,
      name,
      createdAt: new Date(now).toISOString(),
    });
  } catch (error: any) {
    console.error('Error creating simulation:', error);

    if (error.message.includes('Token')) {
      return formatJSONResponse(401, { message: error.message });
    }

    return formatJSONResponse(500, {
      message: 'Erreur lors de la sauvegarde de la simulation',
      error: process.env.STAGE === 'dev' ? error.message : undefined,
    });
  }
};
