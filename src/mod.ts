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
  SaveTablePreferenceInput,
  SaveColumnPreferenceInput,
  SaveFilterPreferenceInput,
  type User,
  type TablePreference,
  type FilterPreferences,
  type SaveTablePreferenceInputType,
  type SaveColumnPreferenceInputType,
  type SaveFilterPreferenceInputType,
} from "./user.ts";

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
  ItemPrice,
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
} from "./common.ts";

export {
  ErrorSyncSchema,
  type ErrorSync,
  type SyncServiceType,
} from "./error-sync.ts";

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
  InventoryLedgerSchema,
  type InventoryLedger,
  type InventoryLedgerStore,
  type InventoryLedgerLocation,
} from "./inventory-ledger.ts";

export {
  TransactionSchema,
  TransactionStoreSchema,
  TransactionStoreLocationSchema,
  TRANSACTION_TYPES,
  getTransactionMultiplier,
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
  type StockSummaryStore,
  type StockSummaryStoreLocation,
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

// ── Union of all Firestore document types ───────────────────────────

import type { Booking } from "./booking.ts";
import type { CacheGeocodes } from "./cache-geocodes.ts";
import type { ChartOfAccounts } from "./chart-of-accounts.ts";
import type { Contact } from "./contact.ts";
import type { Destination as DestinationDocType } from "./destination.ts";
import type { EmailVerification } from "./email-verification.ts";
import type { ErrorSync } from "./error-sync.ts";
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
import type { PublicStockSummary } from "./public-stock-summary.ts";
import type { RateLimit } from "./rate-limit.ts";
import type { Session } from "./session.ts";
import type { StockSummary } from "./stock-summary.ts";
import type { Store } from "./store.ts";
import type { Tag } from "./tag.ts";
import type { TrackingCategory } from "./tracking-category.ts";
import type { Transaction } from "./transaction.ts";
import type { TypesenseConfig } from "./typesense-config.ts";
import type { User } from "./user.ts";
import type { WebhookEvent } from "./webhook-event.ts";
import type { WebshopProduct } from "./webshop-product.ts";

/** Union of all Firestore document types. Use with validateBeforeWrite. */
export type SchemaDocType =
  | Booking | CacheGeocodes | ChartOfAccounts | Contact | DestinationDocType
  | EmailVerification | ErrorSync | HolidayDates | InventoryLedger | Invoice | Location
  | LocationType | Order | Organization | OutOfServiceRecord | PasswordReset
  | Product | PublicStockSummary | Quote | RateLimit | Session | StockSummary
  | Store | Tag | TrackingCategory | Transaction | TypesenseConfig | User
  | WebhookEvent | WebshopProduct;

// ── Schema record keyed by collection name ─────────────────────────

import type { z } from "zod";

import { BookingSchema } from "./booking.ts";
import { CacheGeocodesSchema } from "./cache-geocodes.ts";
import { ChartOfAccountsSchema } from "./chart-of-accounts.ts";
import { ContactSchema } from "./contact.ts";
import { DestinationSchema } from "./destination.ts";
import { EmailVerificationSchema } from "./email-verification.ts";
import { ErrorSyncSchema } from "./error-sync.ts";
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
import { RateLimitSchema } from "./rate-limit.ts";
import { PublicStockSummarySchema } from "./public-stock-summary.ts";
import { SessionSchema } from "./session.ts";
import { StockSummarySchema } from "./stock-summary.ts";
import { StoreSchema } from "./store.ts";
import { TagSchema } from "./tag.ts";
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
  "error-sync": ErrorSyncSchema, "errors-sync": ErrorSyncSchema,
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
  "rate-limit": RateLimitSchema, "rate-limits": RateLimitSchema,
  "public-stock-summary": PublicStockSummarySchema, "public-stock-summaries": PublicStockSummarySchema,
  "session": SessionSchema, "sessions": SessionSchema,
  "stock-summary": StockSummarySchema, "stock-summaries": StockSummarySchema,
  "store": StoreSchema, "stores": StoreSchema,
  "tag": TagSchema, "tags": TagSchema,
  "tracking-category": TrackingCategorySchema, "tracking-categories": TrackingCategorySchema,
  "transaction": TransactionSchema, "transactions": TransactionSchema,
  "user": UserSchema, "users": UserSchema,
  "webhook-event": WebhookEventSchema_, "webhook-events": WebhookEventSchema_,
  "webshop-product": WebshopProductSchema, "webshop-products": WebshopProductSchema,
  "typesense-config": TypesenseConfigSchema, "typesense": TypesenseConfigSchema,
};
