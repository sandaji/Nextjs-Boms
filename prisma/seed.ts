import { PrismaClient } from "@prisma/client";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { readFileSync, existsSync } from "fs";
import bcrypt from "bcryptjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface SeedData {
  [key: string]: any;
}

const prisma = new PrismaClient();

async function deleteAllData() {
  console.log("Deleting existing data in correct order...");
  await prisma.$transaction([
    prisma.expenseByCategory.deleteMany(),
    prisma.sales.deleteMany(),
    prisma.salesSummary.deleteMany(),
    prisma.purchases.deleteMany(),
    prisma.purchaseSummary.deleteMany(),
    prisma.expenses.deleteMany(),
    prisma.expenseSummary.deleteMany(),
    prisma.products.deleteMany(),
    prisma.users.deleteMany(),
    prisma.admin.deleteMany(), // Removed because 'admin' model does not exist
  ]);
  console.log("All data cleared successfully.");
}

async function main() {
  const dataDirectory = join(__dirname, "seedData");

  // Delete existing data
  await deleteAllData();

  const orderedFiles = [
    "admin.json",
    "Users.json",
    "Products.json",
    "Purchases.json",
    "PurchaseSummary.json",
    "Sales.json",
    "SalesSummary.json",
    "Expenses.json",
    "ExpenseSummary.json",
    "ExpenseByCategory.json",
  ];

  for (const fileName of orderedFiles) {
    const filePath = join(dataDirectory, fileName);
    if (!existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      continue;
    }

    try {
      const modelName = fileName.replace(".json", "");
      const data = JSON.parse(readFileSync(filePath, "utf-8")) as SeedData[];

      // Handle date fields by converting strings to Date objects
      // and hash password for admin
      const processedData = await Promise.all(
        data.map(async (item: SeedData) => {
          const processed = { ...item };

          // Hash password for admin
          if (modelName.toLowerCase() === "admin" && processed.password) {
            const salt = await bcrypt.genSalt(10);
            processed.password = await bcrypt.hash(processed.password, salt);
          }

          // Convert date strings to Date objects
          Object.keys(processed).forEach((key) => {
            if (
              typeof processed[key] === "string" &&
              processed[key].match(/^\d{4}-\d{2}-\d{2}/)
            ) {
              processed[key] = new Date(processed[key]);
            }
          });
          return processed;
        })
      );

      // @ts-ignore - Dynamic access to prisma models
      await prisma[modelName].createMany({
        data: processedData,
      });

      console.log(`Seeded ${modelName} successfully`);
    } catch (error) {
      console.error(`Error seeding ${fileName}:`, error);
    }
  }
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
