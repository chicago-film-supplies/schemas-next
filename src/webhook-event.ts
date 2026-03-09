import { z } from "zod";
import { FirestoreTimestamp, type FirestoreTimestampType } from "./common.ts";

export interface WebhookEvent {
  id: string;
  event: string;
  received: FirestoreTimestampType;
  expiresAt: FirestoreTimestampType;
  payload: unknown;
}

export const WebhookEventSchema: z.ZodType<WebhookEvent> = z.strictObject({
  id: z.string(),
  event: z.string(),
  received: FirestoreTimestamp,
  expiresAt: FirestoreTimestamp,
  payload: z.unknown(),
}).meta({ title: "WebhookEvent", collection: "webhooks/{service}/events" });
