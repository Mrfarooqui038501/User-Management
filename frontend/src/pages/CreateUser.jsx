import React, { useState } from "react";
import { API } from "../utils/api";
import { uploadProfileImage } from "../utils/upload";

const CreateUser = () => {
  const [file, setFile] = useState(null);
  const [user, setUser] = useState({ name: "", email: "", phone: "", dob: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
    setError(""); 
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (selectedFile) {
      
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
      if (!validTypes.includes(selectedFile.type)) {
        setError("Please select a valid image file (JPEG, PNG, GIF)");
        setFile(null);
        setPreview(null);
        return;
      }
      
      
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        setFile(null);
        setPreview(null);
        return;
      }
      
      setFile(selectedFile);
      setError("");
      
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      console.log("📝 Submitting user data:", user);

      
      if (!user.name || !user.email || !user.phone || !user.dob) {
        setError("Please fill in all required fields");
        setLoading(false);
        return;
      }

      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(user.email)) {
        setError("Please enter a valid email address");
        setLoading(false);
        return;
      }

      let image_url = "";
      
      
      if (file) {
        try {
          console.log("📤 Uploading image...");
          image_url = await uploadProfileImage(file);
          console.log("✅ Image uploaded:", image_url);
        } catch (uploadError) {
          console.error("Image upload failed:", uploadError);
          setError(`Image upload failed: ${uploadError.message}`);
          setLoading(false);
          return;
        }
      }
      
      // Create user
      const userData = { 
        ...user, 
        image_url 
      };

      console.log("📨 Sending user data to API:", userData);

      const response = await API.post("/users", userData);
      
      console.log("✅ User created:", response.data);
      alert("User created successfully!");
      
      
      setUser({ name: "", email: "", phone: "", dob: "" });
      setFile(null);
      setPreview(null);
      
      
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = "";
      
    } catch (err) {
      console.error("❌ Error creating user:", err);
      
      
      const errorMessage = err.response?.data?.message 
        || err.response?.data?.error
        || err.message 
        || "Failed to create user. Please try again.";
      
      setError(errorMessage);
      
      
      if (err.response) {
        console.error("Error response:", {
          status: err.response.status,
          data: err.response.data
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form 
        onSubmit={handleSubmit} 
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create User</h2>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Name Field */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2 font-medium">
            Name <span className="text-red-500">*</span>
          </label>
          <input 
            type="text" 
            name="name"
            value={user.name}
            placeholder="Enter full name" 
            onChange={handleChange} 
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
            disabled={loading}
          />
        </div>

        {/* Email Field */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2 font-medium">
            Email <span className="text-red-500">*</span>
          </label>
          <input 
            type="email" 
            name="email"
            value={user.email}
            placeholder="Enter email address" 
            onChange={handleChange} 
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
            disabled={loading}
          />
        </div>

        {/* Phone Field */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2 font-medium">
            Phone <span className="text-red-500">*</span>
          </label>
          <input 
            type="tel" 
            name="phone"
            value={user.phone}
            placeholder="Enter phone number" 
            onChange={handleChange} 
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
            disabled={loading}
          />
        </div>

        {/* Date of Birth Field */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2 font-medium">
            Date of Birth <span className="text-red-500">*</span>
          </label>
          <input 
            type="date" 
            name="dob"
            value={user.dob}
            onChange={handleChange} 
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
            disabled={loading}
          />
        </div>

        {/* Profile Image Field */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-2 font-medium">
            Profile Image (Optional)
          </label>
          <input 
            type="file"
            accept="image/*"
            onChange={handleFileChange} 
            className="w-full text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            disabled={loading}
          />
          {preview && (
            <div className="mt-3">
              <img 
                src={preview} 
                alt="Preview" 
                className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
              />
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
          disabled={loading}
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating User...
            </>
          ) : (
            "Create User"
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateUser;