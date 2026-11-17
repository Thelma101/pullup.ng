import type { Night } from "./types";

export const nights: Night[] = [
  {
    id: "lagos-dinner-nov-22",
    city: "lagos",
    area: "Lekki–VI",
    format: "dinner",
    date: "2026-11-22",
    time: "19:00",
    seatsTotal: 5,
    seatsTaken: 2,
    feeNaira: 10000,
    minSpendNaira: 25000,
    status: "open",
  },
  {
    id: "abuja-dinner-nov-23",
    city: "abuja",
    area: "Wuse–Maitama",
    format: "dinner",
    date: "2026-11-23",
    time: "19:00",
    seatsTotal: 5,
    seatsTaken: 1,
    feeNaira: 10000,
    minSpendNaira: 22000,
    status: "open",
  },
  {
    id: "lagos-brunch-nov-29",
    city: "lagos",
    area: "Ikeja",
    format: "brunch",
    date: "2026-11-29",
    time: "13:00",
    seatsTotal: 5,
    seatsTaken: 4,
    feeNaira: 8000,
    minSpendNaira: 18000,
    status: "filling",
  },
  {
    id: "abuja-drinks-nov-29",
    city: "abuja",
    area: "Jabi",
    format: "drinks",
    date: "2026-11-29",
    time: "18:30",
    seatsTotal: 5,
    seatsTaken: 0,
    feeNaira: 7000,
    minSpendNaira: 15000,
    status: "open",
  },
  {
    id: "lagos-dinner-dec-06",
    city: "lagos",
    area: "Yaba–Surulere",
    format: "dinner",
    date: "2026-12-06",
    time: "19:00",
    seatsTotal: 5,
    seatsTaken: 0,
    feeNaira: 10000,
    minSpendNaira: 22000,
    status: "open",
  },
  {
    id: "abuja-brunch-dec-07",
    city: "abuja",
    area: "Gwarinpa",
    format: "brunch",
    date: "2026-12-07",
    time: "13:00",
    seatsTotal: 5,
    seatsTaken: 0,
    feeNaira: 8000,
    minSpendNaira: 18000,
    status: "open",
  },
];

export function getNight(id: string) {
  return nights.find((n) => n.id === id);
}

export function formatNaira(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNightDate(iso: string) {
  return new Intl.DateTimeFormat("en-NG", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(`${iso}T12:00:00`));
}

export function cityLabel(city: string) {
  return city === "lagos" ? "Lagos" : "Abuja";
}

export function formatLabel(format: string) {
  if (format === "dinner") return "Dinner";
  if (format === "brunch") return "Brunch";
  return "Drinks";
}

export function seatsLeft(night: Night) {
  return Math.max(night.seatsTotal - night.seatsTaken, 0);
}
