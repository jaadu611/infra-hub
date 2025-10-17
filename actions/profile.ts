"use server";

interface UpdateProfileInput {
  name: string;
  email: string;
  company: string;
}

interface UpdatePasswordInput {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export async function updateProfile(data: UpdateProfileInput) {
  if (!data.name || !data.email) {
    throw new Error("Name and email are required.");
  }

  await new Promise((resolve) => setTimeout(resolve, 500));

  return { success: true };
}

export async function updatePassword(data: UpdatePasswordInput) {
  if (data.newPassword !== data.confirmPassword) {
    throw new Error("Passwords do not match.");
  }

  await new Promise((resolve) => setTimeout(resolve, 500));

  return { success: true };
}

export async function uploadAvatar(formData: FormData) {
  const file = formData.get("file") as File | null;
  if (!file) {
    throw new Error("No file uploaded");
  }

  await new Promise((resolve) => setTimeout(resolve, 500));

  return { success: true, filename: file.name };
}
