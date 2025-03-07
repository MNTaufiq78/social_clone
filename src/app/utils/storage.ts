import { supabase } from "@/app/lib/supabase";

export const uploadAvatar = async (file: File, userId: string) => {
    const filePath = `${userId}/${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from("/uploads")
      .upload(filePath, file);
  
    if (error) {
      console.error("Upload Error:", error.message);
      return null;
    }
  
    const { data: publicUrlData } = supabase.storage.from("/uploads").getPublicUrl(filePath);
    return publicUrlData.publicUrl;
  };
  