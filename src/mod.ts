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
  type User,
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
} from "./order.ts";

export {
  LoginInput,
  ResetPasswordInput,
  EmailInput,
  type LoginInputType,
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
  StoreSchema,
  type Store,
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
  type LocationType,
  type LocationTypeProductCapacity,
  type LocationTypeDimensions,
} from "./location-type.ts";

export {
  LocationSchema,
  type Location,
  type LocationProductCapacity,
  type LocationProduct,
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
} from "./invoice.ts";

export {
  InventoryLedgerSchema,
  type InventoryLedger,
  type InventoryLedgerStore,
  type InventoryLedgerLocation,
} from "./inventory-ledger.ts";

export {
  TransactionSchema,
  type Transaction,
  type TransactionStore,
  type TransactionStoreLocation,
  type TransactionSource,
} from "./transaction.ts";

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

// ── Schema record keyed by collection name ─────────────────────────

import type { z } from "zod";

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
import { PublicStockSummarySchema } from "./public-stock-summary.ts";
import { SessionSchema } from "./session.ts";
import { StockSummarySchema } from "./stock-summary.ts";
import { StoreSchema } from "./store.ts";
import { TagSchema } from "./tag.ts";
import { TrackingCategorySchema } from "./tracking-category.ts";
import { TransactionSchema } from "./transaction.ts";
import { UserSchema } from "./user.ts";
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
  "public-stock-summary": PublicStockSummarySchema, "public-stock-summaries": PublicStockSummarySchema,
  "session": SessionSchema, "sessions": SessionSchema,
  "stock-summary": StockSummarySchema, "stock-summaries": StockSummarySchema,
  "store": StoreSchema, "stores": StoreSchema,
  "tag": TagSchema, "tags": TagSchema,
  "tracking-category": TrackingCategorySchema, "tracking-categories": TrackingCategorySchema,
  "transaction": TransactionSchema, "transactions": TransactionSchema,
  "user": UserSchema, "users": UserSchema,
  "webshop-product": WebshopProductSchema, "webshop-products": WebshopProductSchema,
};
