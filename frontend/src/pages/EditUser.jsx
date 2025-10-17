import React, { useEffect, useState } from "react";
import { API } from "../utils/api";

const EditUser = ({ userId }) => {
  const [user, setUser] = useState({});
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const resUser = await API.get(`/users/${userId}`);
      setUser(resUser.data);
      const resAll = await API.get("/users");
      setAllUsers(resAll.data.filter(u => u.id !== userId));
    };
    fetchData();
  }, [userId]);

  const handleChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  const handleSave = async () => {
    try {
      await API.put(`/users/${userId}`, user);
      alert("User updated!");
    } catch (err) {
      console.error(err);
    }
  };

  const toggleFollow = async (targetId) => {
    try {
      const isFollowing = user.Following.some(f => f.id === targetId);
      await API.post(`/users/${isFollowing ? "unfollow" : "follow"}`, {
        followerId: userId,
        followingId: targetId
      });
      const resUser = await API.get(`/users/${userId}`);
      setUser(resUser.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Edit User</h1>
      <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
        <input
          type="text"
          name="name"
          value={user.name || ""}
          placeholder="Name"
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
        />
        <input
          type="email"
          name="email"
          value={user.email || ""}
          placeholder="Email"
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
        />
        <input
          type="text"
          name="phone"
          value={user.phone || ""}
          placeholder="Phone"
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
        />
        <input
          type="date"
          name="dob"
          value={user.dob || ""}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
        />
        <button
          onClick={handleSave}
          className="w-full bg-green-500 text-white p-2 rounded mb-6"
        >
          Save Changes
        </button>

        <h2 className="text-xl font-semibold mb-3">Following</h2>
        <ul>
          {allUsers.map((u) => {
            const isFollowing = user.Following?.some(f => f.id === u.id);
            return (
              <li key={u.id} className="flex justify-between items-center mb-2">
                <span>{u.name}</span>
                <button
                  onClick={() => toggleFollow(u.id)}
                  className={`px-3 py-1 rounded ${
                    isFollowing ? "bg-red-500 text-white" : "bg-blue-500 text-white"
                  }`}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default EditUser;
