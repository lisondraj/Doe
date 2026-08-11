export async function signOutAdmin(): Promise<void> {
  await fetch("/api/admin/auth/signout", { method: "POST" });
  window.location.href = "/admin/login";
}
