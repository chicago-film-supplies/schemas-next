/**
 * @cfs/schemas
 *
 * Zod schemas for CFS Firestore collections.
 * Each schema exports: Zod schema, interface type, and input schemas.
 */
export {
  ContactSchema,
  ContactOrganization,
  CreateContactInput,
  UpdateContactInput,
  type Contact,
  type ContactOrganizationType,
  type CreateContactInputType,
  type UpdateContactInputType,
} from "./contact.ts";

export {
  OrganizationSchema,
  OrganizationContact,
  CreateOrganizationInput,
  UpdateOrganizationInput,
  NewContactInput,
  type Organization,
  type OrganizationContactType,
  type CreateOrganizationInputType,
  type UpdateOrganizationInputType,
  type NewContactInputType,
} from "./organization.ts";

export {
  UserSchema,
  UpdateUserInput,
  type User,
  type DisplaySort,
  type FirestoreDisplayPrefs,
  type TypesenseDisplayPrefs,
  type UpdateUserInputType,
} from "./user.ts";

export {
  typesenseDisplayDefaults,
  getTypesenseDisplayDefaults,
  type FirestoreDisplayDefaults,
} from "./display-defaults.ts";

export {
  SessionSchema,
  type Session,
} from "./session.ts";

export {
  EmailVerificationSchema,
  type EmailVerification,
} from "./email-verification.ts";

export {
  PasswordResetSchema,
  type PasswordReset,
} from "./password-reset.ts";

export {
  RateLimitSchema,
  type RateLimit,
} from "./rate-limit.ts";

export {
  OrderSchema,
  CreateOrderInput,
  UpdateOrderInput,
  OrderDates,
  Destination,
  DestinationEndpoint,
  DestinationContact,
  DocDestination,
  DocDestinationEndpoint,
  DocDestinationContact,
  OrderItem,
  OrderDocDestinationItem,
  OrderDocTransactionFeeItem,
  ItemPrice,
  PriceModifier,
  TaxRef,
  Discount,
  DiscountInput,
  type Order,
  type CreateOrderInputType,
  type UpdateOrderInputType,
  type OrderDatesType,
  type DestinationType,
  type DestinationEndpointType,
  type DestinationContactType,
  type DocDestinationType,
  type DocDestinationEndpointType,
  type DocDestinationContactType,
  type OrderItemType,
  type ItemPriceType,
  type PriceModifierType,
  type TaxRefType,
  type DiscountType,
  type DiscountInputType,
  type OrderDocTotalsType,
  type OrderDocTransactionFeeItemType,
  OrderDocDates,
  OrderDocItem,
  type OrderDocDatesType,
  type OrderDocItemType,
  type OrderDocItemPriceType,
  type OrderDocLineItemType,
  type OrderDocGroupItemType,
} from "./order.ts";

export {
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
  EmailInput,
  type LoginInputType,
  type RegisterInputType,
  type ResetPasswordInputType,
  type EmailInputType,
} from "./auth.ts";

export {
  Address,
  Coordinates,
  Email,
  Phone,
  FirestoreTimestamp,
  TimestampFields,
  UidNameRef,
  NoteEntry,
  ProductTypeEnum,
  StockMethodEnum,
  TaxProfileEnum,
  PriceFormulaEnum,
  ItemTaxProfileEnum,
  InclusionTypeEnum,
  ComponentTypeEnum,
  COARevenueEnum,
  OOSReasonEnum,
  RateTypeEnum,
  type AddressType,
  type CoordinatesType,
  type FirestoreTimestampType,
  type FirestoreTimestampValue,
  type FirestoreFieldValue,
  type UidNameRefType,
  type NoteEntryType,
  type ProductTypeType,
  type StockMethodType,
  type TaxProfileType,
  type PriceFormulaType,
  type ItemTaxProfileType,
  type InclusionTypeType,
  type ComponentTypeType,
  type COARevenueType,
  type OOSReasonType,
  type RateType,
  StoreBreakdownEntrySchema,
  StoreBreakdownLocationSchema,
  type StoreBreakdownEntry,
  type StoreBreakdownLocation,
} from "./common.ts";

export {
  LogRecordSchema,
  PropagationLogRecordSchema,
  ClientLogEntrySchema,
  ClientLogBatchSchema,
  type LogRecord,
  type LogLevelType,
  type PiiClassification,
  type PropagationLogRecord,
  type PropagationModeType,
  type PropagationStatusType,
  type ClientLogEntry,
  type ClientLogBatch,
  type ClientAppType,
} from "./log.ts";

export {
  StoreSchema,
  CreateStoreInput,
  UpdateStoreInput,
  type Store,
  type CreateStoreInputType,
  type UpdateStoreInputType,
} from "./store.ts";

export {
  TagSchema,
  CreateTagInput,
  UpdateTagInput,
  DeleteTagInput,
  type Tag,
  type CreateTagInputType,
  type UpdateTagInputType,
  type DeleteTagInputType,
} from "./tag.ts";

export {
  HolidayDatesSchema,
  type HolidayDates,
} from "./holiday-dates.ts";

export {
  CacheGeocodesSchema,
  type CacheGeocodes,
  type CacheGeocodesAddress,
} from "./cache-geocodes.ts";

export {
  DestinationSchema,
  type Destination as DestinationDoc,
} from "./destination.ts";

export {
  LocationTypeSchema,
  CreateLocationTypeInput,
  UpdateLocationTypeInput,
  type LocationType,
  type LocationTypeProductCapacity,
  type LocationTypeDimensions,
  type CreateLocationTypeInputType,
  type UpdateLocationTypeInputType,
} from "./location-type.ts";

export {
  LocationSchema,
  CreateLocationInput,
  UpdateLocationInput,
  type Location,
  type LocationProductCapacity,
  type LocationProduct,
  type CreateLocationInputType,
  type UpdateLocationInputType,
} from "./location.ts";

export {
  ChartOfAccountsSchema,
  COACode,
  COAType,
  type ChartOfAccounts,
  type COACodeType,
  type COATypeType,
} from "./chart-of-accounts.ts";

export {
  TrackingCategorySchema,
  CreateTrackingCategoryInput,
  UpdateTrackingCategoryInput,
  type TrackingCategory,
  type CreateTrackingCategoryInputType,
  type UpdateTrackingCategoryInputType,
} from "./tracking-category.ts";

export {
  ProductSchema,
  CreateProductInput,
  UpdateProductInput,
  type Product,
  type CreateProductInputType,
  type UpdateProductInputType,
  type ProductAlternate,
  type ProductComponent,
  type ProductPrice,
  type ProductShipping,
  type ProductWebshop,
} from "./product.ts";

export {
  WebshopProductSchema,
  type WebshopProduct,
  type WebshopProductAlternate,
  type WebshopProductComponent,
  type WebshopProductShipping,
} from "./webshop-product.ts";

export {
  BookingSchema,
  type Booking,
  type BookingDestinationRef,
  type BookingStore,
  type BookingStoreLocation,
} from "./booking.ts";

export {
  InvoiceSchema,
  type Invoice,
  type InvoiceItem,
  type InvoiceItemPrice,
  type InvoiceItemTypeType,
  type InvoiceStatusType,
} from "./invoice.ts";

export {
  TaxSchema,
  CreateTaxInput,
  UpdateTaxInput,
  type Tax,
  type CreateTaxInputType,
  type UpdateTaxInputType,
} from "./tax.ts";

export {
  InventoryLedgerSchema,
  type InventoryLedger,
} from "./inventory-ledger.ts";

export {
  TransactionSchema,
  TransactionStoreSchema,
  TransactionStoreLocationSchema,
  TRANSACTION_TYPES,
  getTransactionMultiplier,
  hasCosts,
  getDisplayTransactionTypes,
  CreateTransactionInput,
  UpdateTransactionInput,
  CreateStoreTransferInput,
  UpdateStoreTransferInput,
  type Transaction,
  type TransactionTypeType,
  type TransactionStore,
  type TransactionStoreLocation,
  type TransactionSource,
  type CreateTransactionInputType,
  type UpdateTransactionInputType,
  type CreateStoreTransferInputType,
  type UpdateStoreTransferInputType,
} from "./transaction.ts";

export {
  GetAvailabilityInput,
  type GetAvailabilityInputType,
} from "./availability.ts";

export {
  OutOfServiceRecordSchema,
  type OutOfServiceRecord,
  type OOSStore,
  type OOSStoreLocation,
  type OOSTransaction,
  type OOSSource,
} from "./out-of-service-record.ts";

export {
  StockSummarySchema,
  type StockSummary,
} from "./stock-summary.ts";

export {
  PublicStockSummarySchema,
  type PublicStockSummary,
  type PublicStockSummaryStore,
} from "./public-stock-summary.ts";

export {
  TypesenseConfigSchema,
  type TypesenseConfig,
  type TypesenseConfigReindexStats,
} from "./typesense-config.ts";

export {
  WebhookEventSchema,
  type WebhookEvent,
} from "./webhook-event.ts";

export {
  QuoteSchema,
  SaveQuoteVersionInput,
  RestoreQuoteInput,
  type Quote,
  type SaveQuoteVersionInputType,
  type RestoreQuoteInputType,
} from "./quote.ts";

export {
  TEMPLATE_SOURCE_COLLECTIONS,
  TemplateSchema,
  TemplateInputSchema,
  TemplateUpdateInputSchema,
  type Template,
  type TemplateInputType,
  type TemplateUpdateInputType,
  type TemplateContext,
  type TemplateSourceCollectionType,
  type TemplateTargetCollectionType,
  type TemplateScopeType,
} from "./template.ts";

// ── Propagation ─────────────────────────────────────────────────────

export type {
  FieldPath,
  PropagationMode,
  FieldMapping,
  CollectionRule,
  TransactionDefinition,
  AggregateDefinition,
} from "./propagation/mod.ts";

export {
  aggregates,
  rules,
  transactions,
  createOrderRules,
  createOrderTransaction,
  updateOrderRules,
  updateOrderTransaction,
  createTransactionRules,
  createTransactionTransaction,
  createProductRules,
  createProductTransaction,
  updateProductRules,
  updateProductTransaction,
  createOrganizationRules,
  createOrganizationTransaction,
  updateOrganizationRules,
  updateOrganizationTransaction,
  createContactRules,
  createContactTransaction,
  updateContactRules,
  updateContactTransaction,
  updateTagRules,
  deleteTagRules,
  updateTrackingCategoryRules,
  updateLocationTypeRules,
  updateLocationRules,
  createLocationRules,
  createLocationTransaction,
  updateLocationTransactionalRules,
  updateLocationTransaction,
} from "./propagation/mod.ts";

// ── Domain events ───────────────────────────────────────────────────

export type {
  EventEnvelope,
  // Order aggregate
  OrderCreated,
  OrderUpdated,
  OrderStatusChanged,
  OrderCanceled,
  BookingCreated,
  BookingUpdated,
  BookingStatusChanged,
  StockSummaryRecalculated,
  PublicStockSummaryRecalculated,
  QuoteCreated,
  QuoteRestored,
  QuoteDeleted,
  // Product aggregate
  ProductCreated,
  ProductUpdated,
  WebshopProductUpdated,
  InventoryLedgerRecalculated,
  // Invoice aggregate
  InvoiceCreated,
  InvoiceUpdated,
  // Organization aggregate
  OrganizationCreated,
  OrganizationUpdated,
  // Contact aggregate
  ContactCreated,
  ContactUpdated,
  // Store aggregate
  StoreCreated,
  StoreUpdated,
  LocationCreated,
  LocationUpdated,
  LocationTypeCreated,
  LocationTypeUpdated,
  // Transaction aggregate
  TransactionCreated,
  TransactionUpdated,
  OutOfServiceRecordCreated,
  OutOfServiceRecordUpdated,
  // Reference data
  TagCreated,
  TagUpdated,
  TagDeleted,
  TrackingCategoryCreated,
  TrackingCategoryUpdated,
  TemplateCreated,
  TemplateUpdated,
  HolidayDatesAdded,
  HolidayDatesDeleted,
  ChartOfAccountsUpdated,
} from "./events/mod.ts";

// ── Union of all Firestore document types ───────────────────────────

import type { Booking } from "./booking.ts";
import type { CacheGeocodes } from "./cache-geocodes.ts";
import type { ChartOfAccounts } from "./chart-of-accounts.ts";
import type { Contact } from "./contact.ts";
import type { Destination as DestinationDocType } from "./destination.ts";
import type { EmailVerification } from "./email-verification.ts";
import type { HolidayDates } from "./holiday-dates.ts";
import type { InventoryLedger } from "./inventory-ledger.ts";
import type { Invoice } from "./invoice.ts";
import type { Location } from "./location.ts";
import type { LocationType } from "./location-type.ts";
import type { Order } from "./order.ts";
import type { Organization } from "./organization.ts";
import type { OutOfServiceRecord } from "./out-of-service-record.ts";
import type { PasswordReset } from "./password-reset.ts";
import type { Product } from "./product.ts";
import type { Quote } from "./quote.ts";
import type { Template } from "./template.ts";
import type { PublicStockSummary } from "./public-stock-summary.ts";
import type { RateLimit } from "./rate-limit.ts";
import type { Session } from "./session.ts";
import type { StockSummary } from "./stock-summary.ts";
import type { Store } from "./store.ts";
import type { Tag } from "./tag.ts";
import type { Tax } from "./tax.ts";
import type { TrackingCategory } from "./tracking-category.ts";
import type { Transaction } from "./transaction.ts";
import type { TypesenseConfig } from "./typesense-config.ts";
import type { User } from "./user.ts";
import type { WebhookEvent } from "./webhook-event.ts";
import type { WebshopProduct } from "./webshop-product.ts";

/** Union of all Firestore document types. Use with validateBeforeWrite. */
export type SchemaDocType =
  | Booking | CacheGeocodes | ChartOfAccounts | Contact | DestinationDocType
  | EmailVerification | HolidayDates | InventoryLedger | Invoice | Location
  | LocationType | Order | Organization | OutOfServiceRecord | PasswordReset
  | Product | PublicStockSummary | Quote | RateLimit | Session | StockSummary | Tax | Template
  | Store | Tag | TrackingCategory | Transaction | TypesenseConfig | User
  | WebhookEvent | WebshopProduct;

// ── Schema record keyed by collection name ─────────────────────────

import { z } from "zod";

import { BookingSchema } from "./booking.ts";
import { CacheGeocodesSchema } from "./cache-geocodes.ts";
import { ChartOfAccountsSchema } from "./chart-of-accounts.ts";
import { ContactSchema } from "./contact.ts";
import { DestinationSchema } from "./destination.ts";
import { EmailVerificationSchema } from "./email-verification.ts";
import { HolidayDatesSchema } from "./holiday-dates.ts";
import { InventoryLedgerSchema } from "./inventory-ledger.ts";
import { InvoiceSchema } from "./invoice.ts";
import { LocationSchema } from "./location.ts";
import { LocationTypeSchema } from "./location-type.ts";
import { OrderSchema } from "./order.ts";
import { OrganizationSchema } from "./organization.ts";
import { OutOfServiceRecordSchema } from "./out-of-service-record.ts";
import { PasswordResetSchema } from "./password-reset.ts";
import { ProductSchema } from "./product.ts";
import { QuoteSchema as QuoteSchema_ } from "./quote.ts";
import { TemplateSchema as TemplateSchema_ } from "./template.ts";
import { RateLimitSchema } from "./rate-limit.ts";
import { PublicStockSummarySchema } from "./public-stock-summary.ts";
import { SessionSchema } from "./session.ts";
import { StockSummarySchema } from "./stock-summary.ts";
import { StoreSchema } from "./store.ts";
import { TagSchema } from "./tag.ts";
import { TaxSchema as TaxSchema_ } from "./tax.ts";
import { TrackingCategorySchema } from "./tracking-category.ts";
import { TransactionSchema } from "./transaction.ts";
import { UserSchema } from "./user.ts";
import { TypesenseConfigSchema } from "./typesense-config.ts";
import { WebhookEventSchema as WebhookEventSchema_ } from "./webhook-event.ts";
import { WebshopProductSchema } from "./webshop-product.ts";

/** All document schemas keyed by singular and plural collection names. */
export const schemas: Record<string, z.ZodType> = {
  "booking": BookingSchema, "bookings": BookingSchema,
  "cache-geocodes": CacheGeocodesSchema,
  "chart-of-accounts": ChartOfAccountsSchema,
  "contact": ContactSchema, "contacts": ContactSchema,
  "destination": DestinationSchema, "destinations": DestinationSchema,
  "email-verification": EmailVerificationSchema, "email-verifications": EmailVerificationSchema,
  "holiday-dates": HolidayDatesSchema,
  "inventory-ledger": InventoryLedgerSchema, "inventory-ledgers": InventoryLedgerSchema,
  "invoice": InvoiceSchema, "invoices": InvoiceSchema,
  "location": LocationSchema, "locations": LocationSchema,
  "location-type": LocationTypeSchema, "location-types": LocationTypeSchema,
  "order": OrderSchema, "orders": OrderSchema,
  "organization": OrganizationSchema, "organizations": OrganizationSchema,
  "out-of-service-record": OutOfServiceRecordSchema, "out-of-service": OutOfServiceRecordSchema,
  "password-reset": PasswordResetSchema, "password-resets": PasswordResetSchema,
  "product": ProductSchema, "products": ProductSchema,
  "quote": QuoteSchema_, "quotes": QuoteSchema_,
  "template": TemplateSchema_, "templates": TemplateSchema_,
  "rate-limit": RateLimitSchema, "rate-limits": RateLimitSchema,
  "public-stock-summary": PublicStockSummarySchema, "public-stock-summaries": PublicStockSummarySchema,
  "session": SessionSchema, "sessions": SessionSchema,
  "stock-summary": StockSummarySchema, "stock-summaries": StockSummarySchema,
  "store": StoreSchema, "stores": StoreSchema,
  "tag": TagSchema, "tags": TagSchema,
  "tax": TaxSchema_, "taxes": TaxSchema_,
  "tracking-category": TrackingCategorySchema, "tracking-categories": TrackingCategorySchema,
  "transaction": TransactionSchema, "transactions": TransactionSchema,
  "user": UserSchema, "users": UserSchema,
  "webhook-event": WebhookEventSchema_, "webhook-events": WebhookEventSchema_,
  "webshop-product": WebshopProductSchema, "webshop-products": WebshopProductSchema,
  "typesense-config": TypesenseConfigSchema, "typesense": TypesenseConfigSchema,
};

// Defined here (not in display-defaults.ts) to avoid a circular dependency.
// Firestore display defaults live in Zod's .meta() registry, so we need the
// `schemas` record above to extract them. display-defaults.ts is re-exported
// by this file, so importing `schemas` from there would hit a TDZ error.
import type { FirestoreDisplayDefaults } from "./display-defaults.ts";

/** Display defaults for every Firestore collection, derived from schema meta. */
export const firestoreDisplayDefaults: Record<string, FirestoreDisplayDefaults> =
  Object.fromEntries(
    Object.entries(schemas)
      .map(([key, schema]) => {
        const meta = z.globalRegistry.get(schema) as
          | { displayDefaults?: FirestoreDisplayDefaults }
          | undefined;
        return [key, meta?.displayDefaults] as const;
      })
      .filter((entry): entry is [string, FirestoreDisplayDefaults] => entry[1] != null),
  );

// ── Template schema fields (static, generated) ─────────────────────

export type { SchemaField } from "./template-schema-fields.generated.ts";
export { templateSchemaFields } from "./template-schema-fields.generated.ts";
