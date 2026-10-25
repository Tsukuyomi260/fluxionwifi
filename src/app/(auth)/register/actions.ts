"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function register(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const country = formData.get("country") as string;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
        phone,
        country,
      },
    },
  });

  if (error) {
    const messages: Record<string, string> = {
      "User already registered": "Un compte existe déjà avec cet email",
      "Password should be at least 6 characters": "Le mot de passe doit contenir au moins 6 caractères",
      "Unable to validate email address: invalid format": "Format d'email invalide",
    };
    return { error: messages[error.message] || error.message };
  }

  redirect("/dashboard");
}
