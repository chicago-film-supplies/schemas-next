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
  type Organization,
  type OrganizationContactType,
} from "./organization.ts";

export {
  Address,
  Coordinates,
  Email,
  Phone,
  FirestoreTimestamp,
  TimestampFields,
  type AddressType,
  type CoordinatesType,
} from "./common.ts";
