import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import "@/lib/admin/admin-page.css";
import "@/lib/product/product-brown-mock.css";

const ERROR_MESSAGES: Record<string, string> = {
  missing_code: "Sign-in link was incomplete. Request a new code.",
  callback_failed: "Sign-in link expired or was already used. Request a new code.",
  unauthorized: "This address is not authorized for admin access.",
};

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams?: { error?: string };
}) {
  const initialError = searchParams?.error ? ERROR_MESSAGES[searchParams.error] ?? "Could not sign in." : null;

  return (
    <main className="admin-page-root admin-login-page">
      <AdminLoginForm initialError={initialError} />
    </main>
  );
}
