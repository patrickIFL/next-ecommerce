const PAYMONGO_BASE_URL = "https://api.paymongo.com/v1";

const PAYMONGO_AUTH = `Basic ${Buffer.from(
  process.env.PAYMONGO_SECRET_KEY!
).toString("base64")}`;

type PayMongoFetchOptions = {
  path: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  headers?: HeadersInit;
};


export interface PayMongoCheckoutSession {
  data: {
    id: string;
    type: "checkout_session";
    attributes: {
      checkout_url: string;
      payment_method_types: string[];
      description: string;
      created_at: number;
      updated_at: number;
    };
  };
}

export async function paymongoFetch<T>({
  path,
  method = "GET",
  body,
  headers,
}: PayMongoFetchOptions): Promise<T> {
  const res = await fetch(`${PAYMONGO_BASE_URL}${path}`, {
    method,
    headers: {
      Authorization: PAYMONGO_AUTH,
      "Content-Type": "application/json",
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data?.errors?.[0]?.detail || "PayMongo request failed"
    );
  }

  return data as T;
}
