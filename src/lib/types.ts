export type City = "lagos" | "abuja";

export type TablePreference = "mixed" | "women-only" | "men-only";

export type NightFormat = "dinner" | "brunch" | "drinks";

export interface Night {
  id: string;
  city: City;
  area: string;
  format: NightFormat;
  date: string;
  time: string;
  seatsTotal: number;
  seatsTaken: number;
  feeNaira: number;
  minSpendNaira: number;
  status: "open" | "filling" | "full";
}

export interface ApplicationPayload {
  fullName: string;
  age: number;
  whatsapp: string;
  city: City;
  area: string;
  reason: string;
  tablePreference: TablePreference;
  dietary?: string;
  howFound?: string;
}

export interface BookingPayload {
  nightId: string;
  fullName: string;
  whatsapp: string;
  tablePreference: TablePreference;
  dietary?: string;
  budgetBand: "moderate" | "comfortable" | "open";
}
