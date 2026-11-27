import type { Night, NightFormat } from "./types";

/** Seat fee: ₦10k most hangouts · ₦8k brunch */
function feeFor(format: NightFormat) {
  return format === "brunch" ? 8000 : 10000;
}

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
    feeNaira: feeFor("dinner"),
    minSpendNaira: 15000,
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
    feeNaira: feeFor("dinner"),
    minSpendNaira: 15000,
    status: "open",
  },
  {
    id: "lagos-drinks-nov-28",
    city: "lagos",
    area: "Ikeja",
    format: "drinks",
    date: "2026-11-28",
    time: "19:00",
    seatsTotal: 5,
    seatsTaken: 1,
    feeNaira: feeFor("drinks"),
    minSpendNaira: 15000,
    status: "open",
  },
  {
    id: "lagos-beach-nov-29",
    city: "lagos",
    area: "Lekki–Ajah",
    format: "beach",
    date: "2026-11-29",
    time: "14:00",
    seatsTotal: 6,
    seatsTaken: 6,
    feeNaira: feeFor("beach"),
    minSpendNaira: 15000,
    status: "full",
  },
  {
    id: "abuja-games-nov-29",
    city: "abuja",
    area: "Jabi",
    format: "games",
    date: "2026-11-29",
    time: "16:00",
    seatsTotal: 6,
    seatsTaken: 0,
    feeNaira: feeFor("games"),
    minSpendNaira: 15000,
    status: "open",
  },
  {
    id: "lagos-picnic-dec-05",
    city: "lagos",
    area: "VI–Ikoyi",
    format: "picnic",
    date: "2026-12-05",
    time: "15:00",
    seatsTotal: 6,
    seatsTaken: 5,
    feeNaira: feeFor("picnic"),
    minSpendNaira: 15000,
    status: "flash",
  },
  {
    id: "abuja-brunch-dec-06",
    city: "abuja",
    area: "Central Area",
    format: "brunch",
    date: "2026-12-06",
    time: "12:30",
    seatsTotal: 5,
    seatsTaken: 0,
    feeNaira: feeFor("brunch"),
    minSpendNaira: 15000,
    status: "open",
  },
  {
    id: "lagos-games-dec-07",
    city: "lagos",
    area: "Yaba–Surulere",
    format: "games",
    date: "2026-12-07",
    time: "15:00",
    seatsTotal: 6,
    seatsTaken: 0,
    feeNaira: feeFor("games"),
    minSpendNaira: 15000,
    status: "open",
  },
];

const formatLabels: Record<NightFormat, string> = {
  dinner: "Dinner",
  drinks: "Drinks",
  beach: "Beach",
  picnic: "Picnic",
  games: "Game night",
  brunch: "Brunch",
};

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
  return formatLabels[format as NightFormat] || format;
}

export function seatsLeft(night: Night) {
  return Math.max(night.seatsTotal - night.seatsTaken, 0);
}

export function formatNightLabel(night: Night) {
  return `${formatLabel(night.format)} · ${night.area} · ${formatNightDate(night.date)}`;
}
