import React, { useEffect, useState, useCallback } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { Heart } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Community = () => {
  const [creations, setCreations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const { getToken } = useAuth();

  // ✅ Fetch all published creations
  const fetchCreations = useCallback(async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/user/get-published-creations", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setCreations(data.creations);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to fetch creations");
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  // ✅ Toggle Like / Unlike (with optimistic UI update)
  const imageLikeToggle = async (id) => {
    // Optimistically update UI
    setCreations((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              likes: item.likes?.includes(user?.id)
                ? item.likes.filter((uid) => uid !== user?.id)
                : [...(item.likes || []), user?.id],
            }
          : item
      )
    );

    try {
      const token = await getToken();
      const { data } = await axios.post(
        "/api/user/toggle-like-creation",
        { id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ✅ Show success message from backend (e.g. "Creation Liked" / "Creation Unliked")
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error syncing like with server");
    }
  };

  useEffect(() => {
    if (user) fetchCreations();
  }, [user, fetchCreations]);

  // ✅ Loading state
  if (loading)
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-slate-600 animate-pulse">Loading creations...</p>
      </div>
    );

  // ✅ No creations
  if (creations.length === 0)
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-slate-600">No creations yet.</p>
      </div>
    );

  // ✅ Display Creations Grid
  return (
    <div className="flex-1 h-full flex flex-col gap-4 p-6">
      <h1 className="text-xl font-semibold text-slate-700 mb-2">
        Community Creations
      </h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {creations.map((creation) => (
          <div
            key={creation.id}
            className="relative group rounded-lg overflow-hidden bg-white shadow-sm"
          >
            <img
              src={creation.content}
              alt={creation.prompt || "Creation"}
              className="w-full max-h-[400px] object-contain rounded-lg bg-white transition-transform duration-300 group-hover:scale-105"
            />

            <div className="absolute inset-0 flex justify-end items-end p-3 group-hover:justify-between bg-gradient-to-b from-transparent to-black/80 text-white transition-all duration-300">
              <p className="text-sm hidden group-hover:block truncate">
                {creation.prompt}
              </p>

              <div className="flex gap-1 items-center">
                <p>{creation.likes?.length || 0}</p>
                <Heart
                  onClick={(e) => {
                    e.stopPropagation();
                    imageLikeToggle(creation.id);
                  }}
                  className={`min-w-5 h-5 hover:scale-110 cursor-pointer transition-transform ${
                    creation.likes?.includes(user?.id)
                      ? "fill-red-500 text-red-600 animate-pulse"
                      : "text-white"
                  }`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Community;
