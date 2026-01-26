import "@clerk/nextjs/server";

declare module "@clerk/nextjs/server" {
  interface PublicMetadata {
    role?: "seller" | "buyer" | "admin";
  }
}
