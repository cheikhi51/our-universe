import { supabase } from "../lib/supabaseClient";

const MEMORY_BUCKET = "memories";
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export async function getSignedMemoryImageUrl(imagePath) {
  if (!imagePath) return null;

  // Keep compatibility with your old Unsplash/static memories.
  if (imagePath.startsWith("http")) {
    return imagePath;
  }

  const { data, error } = await supabase.storage
    .from(MEMORY_BUCKET)
    .createSignedUrl(imagePath, 60 * 60);

  if (error) {
    console.error("Failed to create signed URL:", error);
    return null;
  }

  return data.signedUrl;
}

export async function getMyMemories(universeId) {
  const { data, error } = await supabase
    .from("memories")
    .select("*")
    .eq("universe_id", universeId)
    .order("memory_date", { ascending: false });

  if (error) throw error;

  return Promise.all(
    data.map(async (memory) => ({
      ...memory,
      image_url: await getSignedMemoryImageUrl(memory.image_path),
    }))
  );
}

export async function uploadMemoryPhoto(universeId, file) {
  if (!file) {
    throw new Error("Please select an image.");
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error(
      "Please choose a JPG, PNG or WebP image."
    );
  }

  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error(
      "This image is too large. Please choose an image smaller than 10 MB."
    );
  }

  const extension =
    file.name.split(".").pop()?.toLowerCase() || "jpg";

  const fileName = `${crypto.randomUUID()}.${extension}`;
  const filePath = `${universeId}/${fileName}`;

  const { error } = await supabase.storage
    .from(MEMORY_BUCKET)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (error) {
    throw new Error(
      error.message || "Unable to upload the image."
    );
  }

  return filePath;
}

export async function deleteMemoryPhoto(imagePath) {
  if (!imagePath || imagePath.startsWith("http")) {
    return;
  }

  const { error } = await supabase.storage
    .from(MEMORY_BUCKET)
    .remove([imagePath]);

  if (error) {
    console.error(
      "Failed to remove memory image:",
      error
    );
  }
}

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

  if (error) {
    // If DB creation fails after upload,
    // don't leave the image orphaned.
    if (imagePath) {
      await deleteMemoryPhoto(imagePath);
    }

    throw error;
  }

  return {
    ...data,
    image_url: await getSignedMemoryImageUrl(
      data.image_path
    ),
  };
}

export async function updateMemory(id, updates) {
  const { data: currentMemory, error: fetchError } =
    await supabase
      .from("memories")
      .select("image_path")
      .eq("id", id)
      .single();

  if (fetchError) throw fetchError;

  const oldImagePath = currentMemory?.image_path;
  const newImagePath = updates.image_path;

  const { data, error } = await supabase
    .from("memories")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    // The new image was uploaded but DB update failed.
    // Remove it so Storage doesn't accumulate orphan files.
    if (
      newImagePath &&
      newImagePath !== oldImagePath
    ) {
      await deleteMemoryPhoto(newImagePath);
    }

    throw error;
  }

  // Delete the previous uploaded image only after
  // the DB update succeeded.
  if (
    newImagePath &&
    oldImagePath &&
    newImagePath !== oldImagePath
  ) {
    await deleteMemoryPhoto(oldImagePath);
  }

  return {
    ...data,
    image_url: await getSignedMemoryImageUrl(
      data.image_path
    ),
  };
}

export async function deleteMemory(id) {
  const { data: memory, error: fetchError } =
    await supabase
      .from("memories")
      .select("image_path")
      .eq("id", id)
      .single();

  if (fetchError) throw fetchError;

  const { error: deleteError } = await supabase
    .from("memories")
    .delete()
    .eq("id", id);

  if (deleteError) throw deleteError;

  if (memory?.image_path) {
    await deleteMemoryPhoto(memory.image_path);
  }
}