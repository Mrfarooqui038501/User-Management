import React, { useEffect, useState } from "react";
import { API } from "../utils/api";
import { useNavigate } from "react-router-dom"; // <-- for navigation

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(1); // replace with logged-in user ID
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const diff = Date.now() - birthDate.getTime();
    const age = new Date(diff).getUTCFullYear() - 1970;
    return age;
  };

  const handleFollow = async (targetId) => {
    try {
      await API.post("/users/follow", { followerId: currentUserId, followingId: targetId });
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUnfollow = async (targetId) => {
    try {
      await API.post("/users/unfollow", { followerId: currentUserId, followingId: targetId });
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">User Dashboard</h1>
        <button
          onClick={() => navigate("/create")}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          + Create User
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => {
          const isFollowing = user.Followers.some(f => f.id === currentUserId);
          return (
            <div key={user.id} className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
              <img
                src={user.image_url || "https://via.placeholder.com/100"}
                alt={user.name}
                className="w-24 h-24 rounded-full object-cover mb-4"
              />
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p>Email: {user.email}</p>
              <p>Phone: {user.phone}</p>
              <p>Age: {calculateAge(user.dob)}</p>
              <p>Followers: {user.Followers.length}</p>
              <p>Following: {user.Following.length}</p>
              {user.id !== currentUserId && (
                <button
                  onClick={() => (isFollowing ? handleUnfollow(user.id) : handleFollow(user.id))}
                  className={`mt-3 px-4 py-2 rounded ${
                    isFollowing ? "bg-red-500 text-white" : "bg-blue-500 text-white"
                  }`}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
