import { Image, Sparkles } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const GenerateImages = () => {
  const ImageStyle = [
    "Realistic",
    "Ghibli Style",
    "Anime Style",
    "Cartoon Style",
    "Fantasy Style",
    "3D Style",
    "Portrait Style",
  ];

  const [selectedStyle, setSelectedStyle] = useState("Realistic");
  const [input, setInput] = useState("");
  const [publish, setPublish] = useState(false);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const { getToken } = useAuth();

  // ✅ Local prompt sanitizer (to avoid server rejection)
  const sanitizePrompt = (text) => {
    return text
      .replace(/\b(student|child|kid|boy|girl|teen|baby)\b/gi, "person")
      .replace(
        /\b(lying|hurt|injured|naked|bleeding|crying|sleeping)\b/gi,
        "standing"
      )
      .replace(
        /\b(on the ground|in bed|school|classroom)\b/gi,
        "in a clean room"
      )
      .replace(/\b(blood|weapon|corpse|fight|violence)\b/gi, "object")
      .replace(/\s+/g, " ")
      .trim();
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!input.trim()) return toast.error("Please enter a description.");

    try {
      setLoading(true);
      setContent("");

      // ✅ Clean and safe prompt
      const safeInput = sanitizePrompt(input);
      const prompt = `A safe, artistic image of ${safeInput} in ${selectedStyle}.`;

      const { data } = await axios.post(
        "/api/ai/generate-image",
        { prompt, publish },
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );

      if (
        data.success &&
        (data.content.startsWith("http") ||
          data.content.startsWith("data:image"))
      ) {
        setContent(data.content);
      } else {
        setContent("");
        toast.error(
          data.message ||
            "The image could not be generated. Try another prompt."
        );
      }
    } catch (error) {
      setContent("");
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong while generating the image."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
      {/* Left Column */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#00AD25]" />
          <h1 className="text-xl font-semibold">AI Image Generator</h1>
        </div>

        <p className="mt-6 text-sm font-medium">Describe Your Image</p>
        <textarea
          onChange={(e) => setInput(e.target.value)}
          value={input}
          rows={4}
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300"
          placeholder="Example: A book and a pen on a wooden table..."
          required
        />

        <p className="mt-6 text-sm font-medium">Style</p>
        <div className="mt-3 flex gap-3 flex-wrap">
          {ImageStyle.map((item) => (
            <span
              key={item}
              onClick={() => setSelectedStyle(item)}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer transition-all ${
                selectedStyle === item
                  ? "bg-green-50 text-green-700 border-green-400"
                  : "text-gray-500 border-gray-300 hover:border-green-400"
              }`}
            >
              {item}
            </span>
          ))}
        </div>

        <div className="my-6 flex items-center gap-2">
          <label className="relative cursor-pointer">
            <input
              type="checkbox"
              onChange={(e) => setPublish(e.target.checked)}
              checked={publish}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-300 rounded-full peer-checked:bg-green-500 transition" />
            <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition peer-checked:translate-x-4" />
          </label>
          <p className="text-sm">Make This Image Public</p>
        </div>

        <button
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#00AD25] to-[#04FF50] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer disabled:opacity-50"
        >
          <Image className="w-5" />
          {loading ? "Generating..." : "Generate Image"}
        </button>
      </form>

      {/* Right Column */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 shadow-sm">
        <div className="flex items-center gap-3">
          <Image className="w-5 h-5 text-[#00AD25]" />
          <h1 className="text-xl font-semibold">Generated Image</h1>
        </div>

        {!content ? (
          <div className="flex-1 flex justify-center items-center text-gray-400 text-sm flex-col gap-4 text-center">
            <Image className="w-9 h-9" />
            <p>Enter a topic and click “Generate Image” to get started.</p>
          </div>
        ) : (
          <div className="mt-3 h-full">
            <img
              src={content}
              alt="Generated"
              className="w-full h-auto rounded-md shadow-sm"
              onError={() => {
                setContent("");
                toast.error("Image could not be displayed. Try regenerating.");
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateImages;
