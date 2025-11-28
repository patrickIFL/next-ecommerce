/* eslint-disable @typescript-eslint/no-explicit-any */
const secret = process.env.PAYMONGO_SECRET_KEY!;
const encodedKey = Buffer.from(secret).toString("base64");

export type PaymongoFetchOptions<TBody = unknown> = Omit<RequestInit, "body"> & {
  body?: TBody;
};

export async function paymongoFetch<TResponse = unknown, TBody = unknown>(
  endpoint: string,
  options: PaymongoFetchOptions<TBody> = {}
): Promise<TResponse> {
  const res = await fetch(`https://api.paymongo.com/v1${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${encodedKey}`,
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  let data: TResponse;

  try {
    data = (await res.json()) as TResponse;
  } catch {
    throw new Error("Invalid JSON response from PayMongo");
  }

  if (!res.ok) {
    throw new Error(
      (data as any)?.errors?.[0]?.detail || "PayMongo API Error"
    );
  }

  return data;
}
