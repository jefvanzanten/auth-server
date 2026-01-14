import { db } from "../src/db";
import { user, account } from "../src/db/schema";
import { eq } from "drizzle-orm";

// Import Better Auth's internal password hashing
// @ts-ignore - internal module
import { hashPassword } from "better-auth/crypto";

async function seed() {
  console.log("🌱 Seeding database...");

  const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123456";
  const adminName = process.env.ADMIN_NAME || "Admin";

  // Check if admin already exists
  const existingAdmin = db
    .select()
    .from(user)
    .where(eq(user.email, adminEmail))
    .get();

  if (existingAdmin) {
    console.log(`ℹ️  Admin user already exists: ${adminEmail}`);
    console.log("✅ Seeding complete!");
    return;
  }

  // Hash password using Better Auth's hashing function
  const hashedPassword = await hashPassword(adminPassword);

  const userId = crypto.randomUUID();
  const now = new Date();

  // Create admin user
  db.insert(user).values({
    id: userId,
    name: adminName,
    email: adminEmail,
    emailVerified: true,
    role: "admin",
    banned: false,
    createdAt: now,
    updatedAt: now,
  }).run();

  // Create credential account
  db.insert(account).values({
    id: crypto.randomUUID(),
    accountId: userId,
    providerId: "credential",
    userId: userId,
    password: hashedPassword,
    createdAt: now,
    updatedAt: now,
  }).run();

  console.log(`✅ Admin user created: ${adminEmail}`);
  console.log(`   Password: ${adminPassword}`);
  console.log(`   Role: admin`);
  console.log("✅ Seeding complete!");
}

seed().catch(console.error);
