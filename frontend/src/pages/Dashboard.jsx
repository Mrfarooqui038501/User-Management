import React, { useEffect, useState } from "react";
import { API } from "../utils/api";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/users");
      setUsers(res.data);
      if (!currentUserId && res.data.length > 0) setCurrentUserId(res.data[0].id);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch users. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const calculateAge = (dob) => {
    const diff = Date.now() - new Date(dob).getTime();
    return new Date(diff).getUTCFullYear() - 1970;
  };

  const handleFollow = async (targetId) => {
    try {
      await API.post("/users/follow", { followerId: currentUserId, followingId: targetId });
      await fetchUsers();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to follow user");
    }
  };

  const handleUnfollow = async (targetId) => {
    try {
      await API.post("/users/unfollow", { followerId: currentUserId, followingId: targetId });
      await fetchUsers();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to unfollow user");
    }
  };

  const handleEdit = (userId) => {
    navigate(`/edit/${userId}`);
  };

  const confirmDelete = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!userToDelete) return;
    try {
      await API.delete(`/users/${userToDelete.id}`);
      alert("User deleted successfully!");
      setShowDeleteModal(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  const currentUser = users.find((u) => u.id === currentUserId);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">User Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage and view all users</p>
        </div>
        <button
          onClick={() => navigate("/create")}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition shadow-lg font-semibold"
        >
          + Create User
        </button>
      </div>

      {/* Stats Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-gray-600 text-sm font-medium">Total Users</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{users.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-gray-600 text-sm font-medium">Following</h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">
            {currentUser?.Following?.length || 0}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-gray-600 text-sm font-medium">Followers</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {currentUser?.Followers?.length || 0}
          </p>
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {users.map((user) => {
          const isCurrentUser = user.id === currentUserId;
          const isFollowing = currentUser?.Following?.some((f) => f.id === user.id);

          return (
            <div
              key={user.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              {/* User Image Header */}
              <div className="relative h-48 bg-gradient-to-br from-blue-400 to-purple-500">
                <img
                  src={user.image_url || "https://via.placeholder.com/150"}
                  alt={user.name}
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                />
              </div>

              {/* User Info */}
              <div className="pt-20 pb-6 px-6 text-center">
                <h2 className="text-xl font-bold text-gray-800 mb-1 truncate">{user.name}</h2>
                <p className="text-sm text-gray-500 mb-1 truncate">{user.email}</p>
                <p className="text-sm text-gray-500 mb-1">{user.phone}</p>
                <p className="text-xs text-gray-400 mb-4">Age: {calculateAge(user.dob)} years</p>

                {/* Stats */}
                <div className="flex justify-center gap-6 mb-4 py-3 border-t border-b border-gray-200">
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{user.Followers?.length || 0}</p>
                    <p className="text-xs text-gray-500">Followers</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-600">{user.Following?.length || 0}</p>
                    <p className="text-xs text-gray-500">Following</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  {!isCurrentUser && (
                    <button
                      onClick={() =>
                        isFollowing ? handleUnfollow(user.id) : handleFollow(user.id)
                      }
                      className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors ${
                        isFollowing
                          ? "bg-red-500 hover:bg-red-600 text-white"
                          : "bg-blue-500 hover:bg-blue-600 text-white"
                      }`}
                    >
                      {isFollowing ? "Unfollow" : "Follow"}
                    </button>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(user.id)}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-semibold transition-colors"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => confirmDelete(user)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg font-semibold transition-colors"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Confirm Delete</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-800">{userToDelete?.name}</span>?
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setUserToDelete(null);
                }}
                className="flex-1 bg-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-500 py-3 rounded-lg font-semibold text-white hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
