import axios from "axios";

export const uploadProfileImage = async (file) => {
  try {
    if (!file) {
      throw new Error("No file provided");
    }

    console.log("📤 Starting upload:", file.name);

    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post("http://localhost:5000/api/upload", formData, {
      headers: { 
        "Content-Type": "multipart/form-data" 
      },
      timeout: 30000, // 30 seconds timeout
    });

    console.log("✅ Upload successful:", res.data.url);
    return res.data.url;
  } catch (err) {
    console.error("❌ Image upload error:", err.response?.data || err.message);
    throw new Error(err.response?.data?.message || "Failed to upload image");
  }
};