import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const RESUME_BUCKET = "internship-resumes";

export { RESUME_BUCKET };

export type InternshipApplicationRow = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  country: "canada" | "us";
  education: "highschool" | "university" | "graduated";
  school_name: string;
  program_of_study: string;
  areas: string[];
  resume_storage_path: string | null;
  resume_file_name: string | null;
  resume_file_type: string | null;
  linkedin_username: string | null;
  additional_notes: string | null;
  email_sent_at: string | null;
};

export type InternshipApplicationEmailRow = {
  id: string;
  application_id: string;
  sent_at: string;
  recipient_email: string;
  trigger: "initial" | "admin_resend";
  status: "sent" | "failed";
  resend_message_id: string | null;
  error_message: string | null;
};

export function createSupabaseAdmin(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("Supabase server credentials are not configured.");
  }

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
