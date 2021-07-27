import { Address } from './address';
/**
 * Represents all info about Custom fields for MVP.
 */
export interface CustomFields {
  /** The Short Text. */
  shortText: string;

  /** The Long Text. */
  longText: string;

  /** The URL field. */
  URL: string;

  /** The Email field. */
  email: string;

  /** The Number field. */
  number: string;

  /** The Phone Number field. */
  phoneNumber: string;

  /** The Currency field. */
  currency: string;

  /** The Date field. */
  date: Date;

  /** The address. */
  address: Address;
}
