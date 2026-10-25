"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });

  if (error) {
    const messages: Record<string, string> = {
      "Invalid login credentials": "Email ou mot de passe incorrect",
      "Email not confirmed": "Veuillez confirmer votre email avant de vous connecter",
      "Invalid email or password": "Email ou mot de passe incorrect",
      "Too many requests": "Trop de tentatives. Veuillez réessayer plus tard",
    };
    return { error: messages[error.message] || error.message };
  }

  redirect("/dashboard");
}
