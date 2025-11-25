import fs from "fs";
import { PrismaClient } from "../src/generated/prisma";

const prismaClientSingleton = () => {
	return new PrismaClient();
};

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();


async function main() {
  const products = JSON.parse(fs.readFileSync("Product.json", "utf-8"));

  for (const p of products) {
    await prisma.product.create({
      data: p,
    });
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
