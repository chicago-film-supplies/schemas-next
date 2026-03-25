/**
 * TypeScript interfaces for Typesense search result documents.
 *
 * These represent the shape of documents returned by Typesense search hits
 * for each collection. Every document includes an `id` field added by Typesense.
 */

// ── Bookings ────────────────────────────────────────────────────────

export interface BookingDocument {
  id: string;
  uid: string;
  uid_product: string;
  uid_order: string;
  number: number;
  number_str?: string;
  crms_id?: number;
  crms_id_str?: string;
  crms_product_id?: number;
  crms_product_id_str?: string;
  status: string;
  type: string;
  name: string;
  subject?: string;
  organization: {
    uid?: string;
    name: string;
    crms_id?: number;
    crms_id_str?: string;
  };
  breakdown: {
    out: number;
    prepped: number;
    returned: number;
    quoted: number;
    reserved: number;
    lost: number;
    damaged: number;
  };
  quantity: number;
  shortage?: number;
  total_price?: number;
  unit_price?: number;
  dates: {
    start_fs?: number;
    end_fs?: number;
    charge_start_fs?: number;
    charge_end_fs?: number;
  };
  destinations?: {
    delivery?: {
      uid?: string;
      address?: {
        full?: string;
        city?: string;
        region?: string;
      };
    };
    collection?: {
      uid?: string;
      address?: {
        full?: string;
        city?: string;
        region?: string;
      };
    };
  };
  stores?: Array<{
    uid_store?: string;
    name?: string;
    quantity?: number;
  }>;
  uid_destination_delivery?: string;
  uid_destination_collection?: string;
  created_at?: number;
  updated_at: number;
}

// ── Chart of Accounts ───────────────────────────────────────────────

export interface ChartOfAccountsDocument {
  id: string;
  uid: string;
  name: string;
  code: number;
  code_str?: string;
  type: string;
  default_tax_profile: string;
  description?: string;
  updated_by?: string;
  updated_at: number;
}

// ── Contacts ────────────────────────────────────────────────────────

export interface ContactDocument {
  id: string;
  uid: string;
  name: string;
  crms_id?: number;
  crms_id_str?: string;
  emails: string[];
  phones: string[];
  organizations?: Array<{
    uid?: string;
    name?: string;
  }>;
  updated_by?: string;
  created_at?: number;
  updated_at: number;
}

// ── Destinations ────────────────────────────────────────────────────

export interface DestinationDocument {
  id: string;
  uid: string;
  mapbox_ids: string[];
  address?: {
    full?: string;
    name?: string;
    city?: string;
    region?: string;
    street?: string;
    country_name?: string;
    address_coordinates?: Record<string, unknown>;
    user_coordinates?: Record<string, unknown>;
  };
  organizations?: Array<{
    uid?: string;
    name?: string;
  }>;
  products?: Array<{
    uid?: string;
    name?: string;
  }>;
  contacts?: Array<{
    uid?: string;
    name?: string;
  }>;
  updated_at: number;
}

// ── Invoices ────────────────────────────────────────────────────────

export interface InvoiceDocument {
  id: string;
  uid: string;
  number: number;
  number_str?: string;
  crms_id: number;
  crms_id_str?: string;
  status: string;
  tax_profile: string;
  subject?: string;
  reference?: string;
  external_notes?: string;
  internal_notes?: string;
  organization: {
    uid?: string;
    name: string;
    crms_id?: number;
    crms_id_str?: string;
    tax_profile?: string;
  };
  items_consolidated: Array<{
    uid?: string;
    name?: string;
    quantity?: number;
    type?: string;
    price?: {
      base?: number;
      total?: number;
      discount_percent?: number;
      chargeable_days?: number;
      formula?: string;
      tax_profile?: string;
    };
    crms_opportunity_id?: number;
    tracking_category?: string;
    coa_revenue?: string;
  }>;
  crms_opportunity_ids?: number[];
  xero_id?: string;
  updated_by?: string;
  date_fs: number;
  due_date_fs?: number;
  created_at?: number;
  updated_at?: number;
}

// ── Locations ───────────────────────────────────────────────────────

export interface LocationDocument {
  id: string;
  uid: string;
  name: string;
  uid_store: string;
  active: boolean;
  default?: boolean;
  uid_location_type?: string;
  products?: Array<{
    uid?: string;
    name?: string;
    quantity?: number;
    default?: boolean;
  }>;
  product_capacities?: Array<{
    uid?: string;
    max?: number;
    max_default?: number;
  }>;
  created_at: number;
  updated_at?: number;
}

// ── Orders ──────────────────────────────────────────────────────────

export interface OrderDocument {
  id: string;
  uid: string;
  number: number;
  number_str?: string;
  crms_id?: number;
  crms_id_str?: string;
  status: string;
  tax_profile: string;
  customer_collecting?: boolean;
  customer_returning?: boolean;
  subject?: string;
  reference?: string;
  notes?: string;
  crms_status?: string;
  organization: {
    uid?: string;
    name: string;
    crms_id?: number;
    crms_id_str?: string;
  };
  dates: {
    delivery_start_fs?: number;
    delivery_end_fs?: number;
    collection_start_fs?: number;
    collection_end_fs?: number;
    charge_start_fs?: number;
    charge_end_fs?: number;
  };
  destinations: Array<{
    delivery?: {
      uid?: string;
      address?: {
        full?: string;
        city?: string;
        region?: string;
      };
      instructions?: string;
      contact?: {
        uid?: string;
        name?: string;
      };
    };
    collection?: {
      uid?: string;
      address?: {
        full?: string;
        city?: string;
        region?: string;
      };
      instructions?: string;
      contact?: {
        uid?: string;
        name?: string;
      };
    };
  }>;
  totals: {
    discount_amount?: number;
    subtotal?: number;
    taxes?: Record<string, unknown>;
    total?: number;
  };
  items?: Array<{
    uid?: string;
    name?: string;
    quantity?: number;
    type?: string;
    description?: string;
    stock_method?: string;
    inclusion_type?: string;
    zero_priced?: boolean;
    uid_order?: string;
    order_number?: number;
    uid_component_of?: string;
    uid_delivery?: string;
    uid_collection?: string;
    total_price?: number;
    price?: {
      base?: number;
      subtotal?: number;
      total?: number;
      tax_amount?: number;
      discount_amount?: number;
      discount_percent?: number;
      chargeable_days?: number;
      formula?: string;
      tax_profile?: string;
    };
  }>;
  created_at?: number;
  updated_at: number;
}

// ── Organizations ───────────────────────────────────────────────────

export interface OrganizationDocument {
  id: string;
  uid: string;
  name: string;
  description?: string;
  crms_id: number;
  crms_id_str?: string;
  xero_id?: string;
  tax_profile: string;
  emails?: string[];
  phones?: string[];
  billing_address: {
    name?: string;
    street?: string;
    full?: string;
    street2?: string;
    city?: string;
    region?: string;
    postcode?: string;
    country_name?: string;
    address_coordinates?: {
      latitude?: number;
      longitude?: number;
    };
    user_coordinates?: {
      latitude?: number;
      longitude?: number;
    };
  };
  contacts: Array<{
    uid?: string;
    name?: string;
    roles?: string[];
  }>;
  updated_by?: string;
  last_order?: number;
  created_at?: number;
  updated_at: number;
}

// ── Products ────────────────────────────────────────────────────────

export interface ProductDocumentComponent {
  uid?: string;
  name?: string;
  quantity?: number;
  active?: boolean;
  crms_id?: number;
  crms_accessory_id?: number;
  description?: string;
  inclusion_type?: string;
  type?: string;
  zero_priced?: boolean;
  price?: {
    base?: number;
    replacement?: number;
    coa_revenue?: string;
    tax_profile?: string;
    formula?: string;
    discountable?: boolean;
  };
}

export interface ProductDocument {
  id: string;
  uid: string;
  name: string;
  description?: string;
  tracking_category_name?: string;
  type: string;
  stock_method: string;
  active: boolean;
  component_only: boolean;
  eligible_delivery?: boolean;
  eligible_in_store_pickup?: boolean;
  eligible_shipping_ground?: boolean;
  eligible_shipping_air?: boolean;
  price?: {
    base?: number;
    replacement?: number;
    coa_revenue?: string;
    tax_profile?: string;
    formula?: string;
    discountable?: boolean;
  };
  webshop?: {
    available?: boolean;
    description?: string;
  };
  alternates?: Array<{
    uid?: string;
    name?: string;
  }>;
  crms_id?: number;
  crms_id_str?: string;
  uid_tracking_category?: string;
  uid_linked_replacement?: string;
  uid_linked_rental?: string;
  xero_id?: string;
  xero_tracking_option_id?: string;
  crms_rate_id?: number;
  crms_linked_rental_id?: number;
  crms_linked_replacement_id?: number;
  crms_linked_replacement_rate_id?: number;
  shipping?: {
    weight?: number;
    height?: number;
    width?: number;
    length?: number;
    air_hazardous?: boolean;
    air_un?: number;
  };
  tags?: Array<{
    uid?: string;
    name?: string;
  }>;
  components?: ProductDocumentComponent[];
  component_of?: ProductDocumentComponent[];
  crms_stock_level_ids?: number[];
  images?: string[];
  updated_by?: string;
  updated_at: number;
  created_at?: number;
}

// ── Stores ──────────────────────────────────────────────────────────

export interface StoreDocument {
  id: string;
  uid: string;
  name: string;
  default: boolean;
  active: boolean;
  crms_store_id: number;
  crms_store_id_str?: string;
  created_at: number;
  updated_at?: number;
}

// ── Tags ────────────────────────────────────────────────────────────

export interface TagDocument {
  id: string;
  uid: string;
  name: string;
  count: number;
  products?: Array<{
    uid?: string;
    name?: string;
  }>;
  updated_at: number;
  updated_by?: string;
}

// ── Templates ───────────────────────────────────────────────────────

export interface TemplateDocument {
  id: string;
  uid: string;
  uid_template: string;
  name: string;
  collection_source: string;
  collection_target: string;
  scope: string;
  version: number;
  version_str?: string;
  source_filename?: string;
  created_at: number;
  updated_at: number;
}

// ── Tracking Categories ─────────────────────────────────────────────

export interface TrackingCategoryDocument {
  id: string;
  uid: string;
  name: string;
  crms_product_group_name: string;
  count: number;
  crms_product_group_id?: number;
  crms_product_group_id_str?: string;
  crms_service_group_id?: number;
  crms_service_group_id_str?: string;
  xero_tracking_option_id?: string;
  products?: Array<{
    uid?: string;
    name?: string;
  }>;
  updated_by?: string;
  updated_at: number;
}

// ── Webshop Products ────────────────────────────────────────────────

export interface WebshopProductDocumentComponent {
  uid?: string;
  name?: string;
  quantity?: number;
  active?: boolean;
  description?: string;
  inclusion_type?: string;
  type?: string;
  zero_priced?: boolean;
  price?: {
    base?: number;
    replacement?: number;
    tax_profile?: string;
    formula?: string;
    discountable?: boolean;
  };
}

export interface WebshopProductDocument {
  id: string;
  uid: string;
  name: string;
  type: string;
  stock_method?: string;
  active: boolean;
  component_only?: boolean;
  eligible_delivery?: boolean;
  eligible_in_store_pickup?: boolean;
  eligible_shipping_ground?: boolean;
  eligible_shipping_air?: boolean;
  price: {
    base?: number;
    replacement?: number;
    tax_profile?: string;
    formula?: string;
    discountable?: boolean;
  };
  webshop: {
    available: boolean;
    description?: string;
  };
  alternates?: Array<{
    uid?: string;
    name?: string;
    description?: string;
  }>;
  shipping?: {
    weight?: number;
    height?: number;
    width?: number;
    length?: number;
    air_hazardous?: boolean;
    air_un?: number;
  };
  tags?: Array<{
    uid?: string;
    name?: string;
  }>;
  components?: WebshopProductDocumentComponent[];
  component_of?: WebshopProductDocumentComponent[];
  updated_at?: number;
  created_at?: number;
}

// ── Union and map ───────────────────────────────────────────────────

/** Union of all Typesense document types. */
export type TypesenseDocument =
  | BookingDocument
  | ChartOfAccountsDocument
  | ContactDocument
  | DestinationDocument
  | InvoiceDocument
  | LocationDocument
  | OrderDocument
  | OrganizationDocument
  | ProductDocument
  | StoreDocument
  | TagDocument
  | TemplateDocument
  | TrackingCategoryDocument
  | WebshopProductDocument;

/** Map from collection alias to its document type. */
export interface TypesenseDocumentMap {
  bookings: BookingDocument;
  "chart-of-accounts": ChartOfAccountsDocument;
  contacts: ContactDocument;
  destinations: DestinationDocument;
  invoices: InvoiceDocument;
  locations: LocationDocument;
  orders: OrderDocument;
  organizations: OrganizationDocument;
  products: ProductDocument;
  stores: StoreDocument;
  tags: TagDocument;
  templates: TemplateDocument;
  "tracking-categories": TrackingCategoryDocument;
  "webshop-products": WebshopProductDocument;
}
