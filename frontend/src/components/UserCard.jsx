import React from "react";
import { API } from "../utils/api";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const UserCard = ({ user, refresh }) => {
  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this user?")) {
      await API.delete(`/users/${user.id}`);
      toast.success("User deleted");
      refresh();
    }
  };

  const handleFollow = async (targetId) => {
    await API.post("/users/follow", {
      follower_id: user.id, // in real case, use logged-in user
      following_id: targetId,
    });
    toast.success("Followed!");
    refresh();
  };

  const calculateAge = (dob) => {
    const diff = Date.now() - new Date(dob).getTime();
    const age = new Date(diff).getUTCFullYear() - 1970;
    return age;
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-4">
      <img
        src={user.image_url}
        alt={user.name}
        className="h-32 w-32 rounded-full mx-auto object-cover"
      />
      <h2 className="text-xl font-bold text-center mt-2">{user.name}</h2>
      <p className="text-center text-gray-600">{user.email}</p>
      <p className="text-center text-sm">Age: {calculateAge(user.dob)}</p>
      <div className="flex justify-around mt-2 text-sm text-gray-700">
        <p>Followers: {user.followers}</p>
        <p>Following: {user.following}</p>
      </div>

      <div className="flex justify-around mt-4">
        <Link
          to={`/edit/${user.id}`}
          className="bg-green-500 text-white px-3 py-1 rounded-md"
        >
          Edit
        </Link>
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-3 py-1 rounded-md"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default UserCard;
