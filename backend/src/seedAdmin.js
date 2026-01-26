import bcrypt from "bcryptjs";
import { db } from "./db.js";

export function seedAdmin() {
  const email = process.env.ADMIN_EMAIL || "admin@admin.com";
  const password = process.env.ADMIN_PASSWORD || "admin1234";

  const exists = db.prepare("SELECT id FROM admin_users WHERE email = ?").get(email);
  if (exists) {
    console.log(`[seed] Admin ya existe: ${email}`);
    return;
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  db.prepare("INSERT INTO admin_users (email, passwordHash) VALUES (?, ?)").run(email, passwordHash);

  console.log(`[seed] Admin creado ✅`);
  console.log(`Email: ${email}`);
  console.log(`Pass:  ${password}`);
}
