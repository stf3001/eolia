/**
 * Service DynamoDB pour la gestion des dossiers de suivi post-achat
 * Requirements: 8.1, 8.2, 8.3
 */

import { v4 as uuidv4 } from 'uuid';
import {
  PutCommand,
  GetCommand,
  QueryCommand,
  UpdateCommand,
  DeleteCommand,
} from '@aws-sdk/lib-dynamodb';
import { dynamoDb, Tables } from './dynamodb';
import {
  OrderDossier,
  DossierEvent,
  DossierDocument,
  DossierType,
  DossierStatus,
  DossierMetadata,
  EventType,
  EventSource,
} from '../models/dossier';

// ============================================
// OrderDossiers CRUD Operations
// ============================================

/**
 * Crée un nouveau dossier pour une commande
 */
export async function createDossier(
  orderId: string,
  type: DossierType,
  status: DossierStatus,
  metadata: DossierMetadata = {}
): Promise<OrderDossier> {
  const now = Date.now();
  const dossierId = `${type}_${uuidv4()}`;

  const dossier: OrderDossier = {
    orderId,
    dossierId,
    type,
    status,
    createdAt: now,
    updatedAt: now,
    metadata,
  };

  await dynamoDb.send(
    new PutCommand({
      TableName: Tables.ORDER_DOSSIERS,
      Item: dossier,
    })
  );

  // Créer un événement initial
  await createDossierEvent(dossierId, 'status_changed', 'system', {
    newStatus: status,
    message: 'Dossier créé',
  });

  return dossier;
}

/**
 * Récupère un dossier par orderId et dossierId
 */
export async function getDossier(
  orderId: string,
  dossierId: string
): Promise<OrderDossier | null> {
  const result = await dynamoDb.send(
    new GetCommand({
      TableName: Tables.ORDER_DOSSIERS,
      Key: { orderId, dossierId },
    })
  );

  return (result.Item as OrderDossier) || null;
}

/**
 * Récupère tous les dossiers d'une commande
 */
export async function getDossiersByOrderId(
  orderId: string
): Promise<OrderDossier[]> {
  const result = await dynamoDb.send(
    new QueryCommand({
      TableName: Tables.ORDER_DOSSIERS,
      KeyConditionExpression: 'orderId = :orderId',
      ExpressionAttributeValues: {
        ':orderId': orderId,
      },
    })
  );

  return (result.Items as OrderDossier[]) || [];
}


/**
 * Met à jour le statut d'un dossier
 */
export async function updateDossierStatus(
  orderId: string,
  dossierId: string,
  newStatus: DossierStatus,
  source: EventSource = 'system'
): Promise<OrderDossier | null> {
  const now = Date.now();

  const result = await dynamoDb.send(
    new UpdateCommand({
      TableName: Tables.ORDER_DOSSIERS,
      Key: { orderId, dossierId },
      UpdateExpression: 'SET #status = :status, updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#status': 'status',
      },
      ExpressionAttributeValues: {
        ':status': newStatus,
        ':updatedAt': now,
      },
      ReturnValues: 'ALL_NEW',
    })
  );

  if (result.Attributes) {
    // Créer un événement de changement de statut
    await createDossierEvent(dossierId, 'status_changed', source, {
      newStatus,
    });
  }

  return (result.Attributes as OrderDossier) || null;
}

/**
 * Met à jour les métadonnées d'un dossier
 */
export async function updateDossierMetadata(
  orderId: string,
  dossierId: string,
  metadata: Partial<DossierMetadata>,
  source: EventSource = 'system'
): Promise<OrderDossier | null> {
  const now = Date.now();

  // Récupérer le dossier existant pour merger les métadonnées
  const existing = await getDossier(orderId, dossierId);
  if (!existing) return null;

  const mergedMetadata = { ...existing.metadata, ...metadata };

  const result = await dynamoDb.send(
    new UpdateCommand({
      TableName: Tables.ORDER_DOSSIERS,
      Key: { orderId, dossierId },
      UpdateExpression: 'SET metadata = :metadata, updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':metadata': mergedMetadata,
        ':updatedAt': now,
      },
      ReturnValues: 'ALL_NEW',
    })
  );

  if (result.Attributes) {
    await createDossierEvent(dossierId, 'metadata_updated', source, {
      updatedFields: Object.keys(metadata),
    });
  }

  return (result.Attributes as OrderDossier) || null;
}

/**
 * Supprime un dossier
 */
export async function deleteDossier(
  orderId: string,
  dossierId: string
): Promise<boolean> {
  await dynamoDb.send(
    new DeleteCommand({
      TableName: Tables.ORDER_DOSSIERS,
      Key: { orderId, dossierId },
    })
  );
  return true;
}

// ============================================
// DossierEvents Operations
// ============================================

/**
 * Crée un événement dans l'historique d'un dossier
 */
export async function createDossierEvent(
  dossierId: string,
  eventType: EventType,
  source: EventSource,
  data: Record<string, unknown> = {}
): Promise<DossierEvent> {
  const now = Date.now();
  const eventId = `${now}_${uuidv4()}`;

  const event: DossierEvent = {
    dossierId,
    eventId,
    eventType,
    timestamp: now,
    data,
    source,
  };

  await dynamoDb.send(
    new PutCommand({
      TableName: Tables.DOSSIER_EVENTS,
      Item: event,
    })
  );

  return event;
}

/**
 * Récupère tous les événements d'un dossier (timeline)
 */
export async function getDossierEvents(
  dossierId: string
): Promise<DossierEvent[]> {
  const result = await dynamoDb.send(
    new QueryCommand({
      TableName: Tables.DOSSIER_EVENTS,
      KeyConditionExpression: 'dossierId = :dossierId',
      ExpressionAttributeValues: {
        ':dossierId': dossierId,
      },
      ScanIndexForward: true, // Ordre chronologique
    })
  );

  return (result.Items as DossierEvent[]) || [];
}


// ============================================
// DossierDocuments Operations
// ============================================

/**
 * Crée une entrée de document dans la base
 */
export async function createDocumentRecord(
  documentId: string,
  dossierId: string,
  orderId: string,
  fileName: string,
  contentType: string,
  size: number,
  s3Key: string,
  uploadedBy: string
): Promise<DossierDocument> {
  const now = Date.now();

  const document: DossierDocument = {
    documentId,
    dossierId,
    orderId,
    fileName,
    contentType,
    size,
    s3Key,
    uploadedAt: now,
    uploadedBy,
  };

  await dynamoDb.send(
    new PutCommand({
      TableName: Tables.DOSSIER_DOCUMENTS,
      Item: document,
    })
  );

  // Créer un événement d'ajout de document
  await createDossierEvent(dossierId, 'document_added', 'client', {
    documentId,
    fileName,
  });

  return document;
}

/**
 * Récupère un document par son ID
 */
export async function getDocument(
  documentId: string
): Promise<DossierDocument | null> {
  const result = await dynamoDb.send(
    new GetCommand({
      TableName: Tables.DOSSIER_DOCUMENTS,
      Key: { documentId },
    })
  );

  return (result.Item as DossierDocument) || null;
}

/**
 * Récupère tous les documents d'un dossier
 */
export async function getDocumentsByDossierId(
  dossierId: string
): Promise<DossierDocument[]> {
  const result = await dynamoDb.send(
    new QueryCommand({
      TableName: Tables.DOSSIER_DOCUMENTS,
      IndexName: 'DossierIdIndex',
      KeyConditionExpression: 'dossierId = :dossierId',
      ExpressionAttributeValues: {
        ':dossierId': dossierId,
      },
    })
  );

  return (result.Items as DossierDocument[]) || [];
}

/**
 * Récupère tous les documents d'une commande
 */
export async function getDocumentsByOrderId(
  orderId: string
): Promise<DossierDocument[]> {
  const result = await dynamoDb.send(
    new QueryCommand({
      TableName: Tables.DOSSIER_DOCUMENTS,
      IndexName: 'OrderIdIndex',
      KeyConditionExpression: 'orderId = :orderId',
      ExpressionAttributeValues: {
        ':orderId': orderId,
      },
    })
  );

  return (result.Items as DossierDocument[]) || [];
}

/**
 * Supprime un document
 */
export async function deleteDocumentRecord(
  documentId: string,
  dossierId: string
): Promise<boolean> {
  const doc = await getDocument(documentId);
  if (!doc) return false;

  await dynamoDb.send(
    new DeleteCommand({
      TableName: Tables.DOSSIER_DOCUMENTS,
      Key: { documentId },
    })
  );

  // Créer un événement de suppression
  await createDossierEvent(dossierId, 'document_removed', 'client', {
    documentId,
    fileName: doc.fileName,
  });

  return true;
}

// ============================================
// Batch Operations
// ============================================

/**
 * Crée plusieurs dossiers pour une commande (utilisé lors de la création de commande)
 */
export async function createDossiersForOrder(
  orderId: string,
  dossierConfigs: Array<{
    type: DossierType;
    status: DossierStatus;
    metadata?: DossierMetadata;
  }>
): Promise<OrderDossier[]> {
  const dossiers: OrderDossier[] = [];

  for (const config of dossierConfigs) {
    const dossier = await createDossier(
      orderId,
      config.type,
      config.status,
      config.metadata || {}
    );
    dossiers.push(dossier);
  }

  return dossiers;
}
