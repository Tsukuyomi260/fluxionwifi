"use server";

import { createClient } from "@/lib/supabase/server";

export async function resetPassword(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(
    formData.get("email") as string,
    { redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password` }
  );

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
