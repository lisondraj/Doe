import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import "@/lib/admin/admin-page.css";
import "@/lib/product/product-brown-mock.css";

const ERROR_MESSAGES: Record<string, string> = {
  unauthorized: "This address is not authorized for admin access.",
};

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams?: { error?: string };
}) {
  const initialError = searchParams?.error ? ERROR_MESSAGES[searchParams.error] ?? "Could not sign in." : null;

  return (
    <main className="admin-page-root admin-login-page product-brown-admin-mode">
      <AdminLoginForm initialError={initialError} />
    </main>
  );
}
