"use server";

interface UpdateProfileInput {
  name: string;
  email: string;
  company: string;
}

export async function updateProfile(data: UpdateProfileInput) {
  if (!data.name || !data.email) {
    throw new Error("Name and email are required.");
  }

  return { success: true };
}

export async function uploadAvatar(formData: FormData) {
  const file = formData.get("file") as File | null;
  if (!file) {
    throw new Error("No file uploaded");
  }

  return { success: true, filename: file.name };
}
