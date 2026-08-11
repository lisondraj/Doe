import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const ADMIN_EMAIL = "jameslisondra@hotmail.com";

function loadEnvFile() {
  try {
    const envPath = resolve(process.cwd(), ".env");
    const contents = readFileSync(envPath, "utf8");
    for (const line of contents.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const separator = trimmed.indexOf("=");
      if (separator === -1) continue;
      const key = trimmed.slice(0, separator).trim();
      const value = trimmed.slice(separator + 1).trim().replace(/^['"]|['"]$/g, "");
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // .env is optional when vars are already exported.
  }
}

loadEnvFile();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey || serviceRoleKey.startsWith("your-")) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { data: listed, error: listError } = await supabase.auth.admin.listUsers({
  page: 1,
  perPage: 200,
});

if (listError) {
  console.error("Could not list auth users:", listError.message);
  process.exit(1);
}

const existing = listed.users.find(
  (user) => user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase(),
);

if (existing) {
  console.log(`Admin auth user already exists: ${ADMIN_EMAIL} (${existing.id})`);
  process.exit(0);
}

const { data, error } = await supabase.auth.admin.createUser({
  email: ADMIN_EMAIL,
  email_confirm: true,
});

if (error) {
  console.error("Could not create admin auth user:", error.message);
  process.exit(1);
}

console.log(`Created admin auth user: ${ADMIN_EMAIL} (${data.user?.id ?? "unknown id"})`);
