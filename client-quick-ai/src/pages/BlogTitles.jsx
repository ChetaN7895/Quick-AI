import { Hash, Sparkles } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import Markdown from "react-markdown";
import { useAuth } from "@clerk/clerk-react";

// ✅ Ensure correct backend URL
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const BlogTitles = () => {
  const blogCategories = [
    "General",
    "Technology",
    "Business",
    "Health",
    "LifeStyle",
    "Education",
    "Travel",
    "Food",
  ];

  const [selectedCategory, setSelectedCategory] = useState("General");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!input.trim()) {
      toast.error("Please enter a keyword");
      return;
    }

    setLoading(true);
    setContent(""); // clear old result

    try {
      const token = await getToken();
      const prompt = `Generate a creative, SEO-friendly blog title for the keyword "${input.trim()}" under the category "${selectedCategory}".`;

      const { data } = await axios.post(
        "/api/ai/generate-blog-titles",
        { prompt },
        {
          baseURL: import.meta.env.VITE_BASE_URL,
          withCredentials: true,
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
        }
      );

      console.log("🚀 API Response:", data);

      // ✅ Handle multiple possible backend formats
      const generated = data?.content || data?.title || data?.data?.title || "";

      if (data?.success && generated) {
        setContent(generated.trim());
      } else {
        toast.error(data?.message || "No data received from server");
      }
    } catch (error) {
      console.error("❌ API Error:", error);
      toast.error(error.response?.data?.message || "Server error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto p-6 flex flex-col lg:flex-row items-start gap-4 text-slate-700">
      {/* Left Column */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full lg:max-w-lg p-4 bg-white rounded-lg border border-gray-200"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#8E37EB]" />
          <h1 className="text-xl font-semibold">AI Blog Title Generator</h1>
        </div>

        <p className="mt-6 text-sm font-medium">Keyword</p>
        <input
          onChange={(e) => setInput(e.target.value)}
          value={input}
          type="text"
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300"
          placeholder="e.g. The Future of Artificial Intelligence..."
          required
        />

        <p className="mt-6 text-sm font-medium">Category</p>
        <div className="mt-3 flex gap-2 flex-wrap">
          {blogCategories.map((item) => (
            <span
              key={item}
              onClick={() => setSelectedCategory(item)}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${
                selectedCategory === item
                  ? "bg-blue-100 text-blue-700 border-blue-300"
                  : "text-gray-500 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {item}
            </span>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#d622ff] to-[#65ADFF] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer disabled:opacity-70"
        >
          {loading ? (
            <span className="w-4 h-4 my-1 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
          ) : (
            <Hash className="w-5" />
          )}
          {loading ? "Generating..." : "Generate Title"}
        </button>
      </form>

      {/* Right Column */}
      <div className="w-full lg:max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96">
        <div className="flex items-center gap-3">
          <Hash className="w-5 h-5 text-[#4AAAFF]" />
          <h1 className="text-xl font-semibold">Generated Titles</h1>
        </div>

        <div className="flex-1 mt-3 overflow-y-auto text-sm text-slate-600">
          {!content ? (
            <div className="flex h-full justify-center items-center text-gray-400 flex-col gap-2">
              <Hash className="w-8 h-8" />
              <p>Enter a topic and click “Generate Title” to get started</p>
            </div>
          ) : (
            <div className="mt-2 prose prose-sm max-w-none text-gray-700">
              <Markdown>{content}</Markdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogTitles;
