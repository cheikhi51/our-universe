import { supabase } from "../lib/supabaseClient";

const MEMORY_BUCKET = "memories";

/*
 * ============================================
 * GET MEMORIES
 * ============================================
 */

export async function getMyMemories(universeId) {
  const { data, error } = await supabase
    .from("memories")
    .select("*")
    .eq("universe_id", universeId)
    .order("memory_date", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  /*
   * Convert private Storage paths into
   * temporary signed URLs.
   *
   * Existing Unsplash URLs are kept as-is.
   */

  const memoriesWithImages = await Promise.all(
    data.map(async (memory) => {
      if (
        !memory.image_path ||
        memory.image_path.startsWith("http")
      ) {
        return {
          ...memory,
          image_url: memory.image_path,
        };
      }

      const { data: signedData, error: signedError } =
        await supabase.storage
          .from(MEMORY_BUCKET)
          .createSignedUrl(
            memory.image_path,
            60 * 60
          );

      if (signedError) {
        console.error(
          "Failed to create signed URL:",
          signedError
        );

        return {
          ...memory,
          image_url: null,
        };
      }

      return {
        ...memory,
        image_url: signedData.signedUrl,
      };
    })
  );

  return memoriesWithImages;
}


/*
 * ============================================
 * UPLOAD MEMORY PHOTO
 * ============================================
 */

export async function uploadMemoryPhoto(
  universeId,
  file
) {
  if (!file) {
    throw new Error("No image selected.");
  }

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (!allowedTypes.includes(file.type)) {
    throw new Error(
      "Only JPG, PNG and WebP images are allowed."
    );
  }

  const maxSize = 10 * 1024 * 1024;

  if (file.size > maxSize) {
    throw new Error(
      "The image must be smaller than 10 MB."
    );
  }

  const extension =
    file.name.split(".").pop()?.toLowerCase() || "jpg";

  const fileName =
    `${crypto.randomUUID()}.${extension}`;

  const filePath =
    `${universeId}/${fileName}`;

  const { error } = await supabase.storage
    .from(MEMORY_BUCKET)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (error) {
    throw error;
  }

  return filePath;
}


/*
 * ============================================
 * CREATE MEMORY
 * ============================================
 */

export async function createMemory({
  universeId,
  title,
  description,
  memoryDate,
  imagePath = null,
}) {
  const { data, error } = await supabase
    .from("memories")
    .insert({
      universe_id: universeId,
      title,
      description,
      memory_date: memoryDate,
      image_path: imagePath,
    })
    .select()
    .single();

  if (error) throw error;

  let imageUrl = null;

  if (data.image_path) {
    if (data.image_path.startsWith("http")) {
      imageUrl = data.image_path;
    } else {
      const { data: signedData, error: signedError } =
        await supabase.storage
          .from(MEMORY_BUCKET)
          .createSignedUrl(
            data.image_path,
            60 * 60
          );

      if (signedError) {
        console.error(
          "Failed to create signed URL:",
          signedError
        );
      } else {
        imageUrl = signedData.signedUrl;
      }
    }
  }

  return {
    ...data,
    image_url: imageUrl,
  };
}


/*
 * ============================================
 * UPDATE MEMORY
 * ============================================
 */

export async function updateMemory(
  id,
  updates
) {
  const { data, error } = await supabase
    .from("memories")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}


/*
 * ============================================
 * DELETE MEMORY
 * ============================================
 */

export async function deleteMemory(id) {
  const { error } = await supabase
    .from("memories")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
}
export async function updateMemory(id, updates) {
  const { data, error } = await supabase
    .from("memories")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function deleteMemory(id) {
  // First get the memory so we know which Storage file to remove
  const { data: memory, error: fetchError } = await supabase
    .from("memories")
    .select("image_path")
    .eq("id", id)
    .single();

  if (fetchError) throw fetchError;

  // Delete the database record
  const { error: deleteError } = await supabase
    .from("memories")
    .delete()
    .eq("id", id);

  if (deleteError) throw deleteError;

  // Delete the associated image from Storage
  if (
    memory?.image_path &&
    !memory.image_path.startsWith("http")
  ) {
    const { error: storageError } = await supabase.storage
      .from(MEMORY_BUCKET)
      .remove([memory.image_path]);

    if (storageError) {
      console.error(
        "Memory deleted, but image cleanup failed:",
        storageError
      );
    }
  }
}