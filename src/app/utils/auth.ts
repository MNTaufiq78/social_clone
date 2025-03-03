import { supabase } from "../lib/supabase";

export const signUpUser = async (email: string, password: string, username: string) => {
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    console.error("Signup Error:", error.message);
    return null;
  }

  // Insert user into `uers` table (Corrected table name)
  const { error: dbError } = await supabase
    .from("uers") // Corrected table name here
    .insert([{ id: data.user?.id, email, username }]);

  if (dbError) {
    console.error("Database Insert Error:", dbError.message);
    return null;
  }

  return data.user;
};

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from("uers") // Corrected table name here
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Fetch Error:", error.message);
    return null;
  }

  return data;
};

export const updateProfilePic = async (userId: string, avatarUrl: string) => {
  const { error } = await supabase
    .from("uers") // Corrected table name here
    .update({ avatar_url: avatarUrl })
    .eq("id", userId);

  if (error) {
    console.error("Update Error:", error.message);
    return null;
  }

  return true;
};