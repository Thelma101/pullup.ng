const secret = () => process.env.PAYSTACK_SECRET_KEY || "";

export function paystackConfigured() {
  return Boolean(secret());
}

export function publicPaystackKey() {
  return process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || process.env.PAYSTACK_PUBLIC_KEY || "";
}

type InitArgs = {
  email: string;
  amountNaira: number;
  reference: string;
  callbackUrl: string;
  metadata?: Record<string, unknown>;
};

export async function initializePaystackTransaction(args: InitArgs) {
  if (!paystackConfigured()) {
    return {
      demo: true as const,
      authorization_url: `${args.callbackUrl}${args.callbackUrl.includes("?") ? "&" : "?"}reference=${encodeURIComponent(args.reference)}&demo=1`,
      reference: args.reference,
      access_code: "demo",
    };
  }

  const res = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: args.email,
      amount: Math.round(args.amountNaira * 100),
      reference: args.reference,
      callback_url: args.callbackUrl,
      metadata: args.metadata,
      currency: "NGN",
    }),
  });

  const json = await res.json();
  if (!res.ok || !json.status) {
    throw new Error(json.message || "Paystack initialize failed");
  }

  return {
    demo: false as const,
    authorization_url: json.data.authorization_url as string,
    reference: json.data.reference as string,
    access_code: json.data.access_code as string,
  };
}

export async function verifyPaystackTransaction(reference: string) {
  if (!paystackConfigured()) {
    return {
      demo: true as const,
      status: "success" as const,
      amountNaira: 0,
      raw: { demo: true, reference },
    };
  }

  const res = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${secret()}` },
  });
  const json = await res.json();
  if (!res.ok || !json.status) {
    throw new Error(json.message || "Paystack verify failed");
  }

  return {
    demo: false as const,
    status: String(json.data.status) as string,
    amountNaira: Number(json.data.amount || 0) / 100,
    raw: json.data as Record<string, unknown>,
  };
}
