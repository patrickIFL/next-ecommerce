import { createRequire } from "module";
import { PrismaClient } from "../src/generated/prisma/index.js"; // <-- fixed relative path

const require = createRequire(import.meta.url);
const products = require("./Product.json");

// singleton prisma
const prisma = globalThis.prismaGlobal ?? new PrismaClient();
globalThis.prismaGlobal = prisma;

async function main() {
  for (const prod of products) {
    console.log(`Product Backup Started`);
    await prisma.product.create({
      data: {
        id: prod.id,
        userId: prod.userId,
        name: prod.name,
        description: prod.description,
        category: prod.category,
        price: Number(prod.price),
        offerPrice: Number(prod.offerPrice),
        image: prod.imageUrls ?? prod.image ?? [],
      },
    });
    console.log(`Inserted: ${prod.name}`);
  }
}

main()
  .catch((err) => console.error(err))
  .finally(async () => {
    await prisma.$disconnect();
    console.log("Done.");
  });
