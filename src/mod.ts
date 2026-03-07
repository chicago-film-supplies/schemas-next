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
  CreateOrderInput,
  UpdateOrderInput,
  OrderDates,
  Destination,
  DestinationEndpoint,
  DestinationContact,
  OrderItem,
  ItemPrice,
  type CreateOrderInputType,
  type UpdateOrderInputType,
  type OrderDatesType,
  type DestinationType,
  type DestinationEndpointType,
  type DestinationContactType,
  type OrderItemType,
  type ItemPriceType,
} from "./order.ts";

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
  type Tag,
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
  type TrackingCategory,
} from "./tracking-category.ts";

export {
  ProductSchema,
  type Product,
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
