import { FileText, Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import ReactMarkdown from 'react-markdown';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const ReviewResume = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    
    if (!file) {
      toast.error("Please select a PDF file first");
      return;
    }

    try {
      setLoading(true);
      setContent("");

      const token = await getToken();
      const formData = new FormData();
      formData.append("resume", file);

      const { data } = await axios.post(
        "/api/ai/resume-review",
        formData,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        setContent(data.content);
        toast.success("Resume reviewed successfully!");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Resume review error:", error);
      toast.error(error.response?.data?.message || error.message || "Failed to review resume");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        toast.error("Please select a PDF file");
        e.target.value = ""; // Reset file input
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        e.target.value = "";
        return;
      }
      setFile(selectedFile);
    }
  };

  return (
    <div className="h-full overflow-y-auto p-6 flex flex-col md:flex-row items-start gap-6 text-slate-700">
      {/* Left Column - Upload Form */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full md:max-w-lg p-6 bg-white rounded-lg border border-gray-200 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="w-6 h-6 text-[#4A7AFF]" />
          <h1 className="text-xl font-semibold">Resume Review</h1>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Resume (PDF)
          </label>
          <input
            onChange={handleFileChange}
            type="file"
            accept=".pdf,application/pdf"
            className="w-full p-2 outline-none text-sm rounded-md border border-gray-300 text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#4A7AFF] file:text-white hover:file:bg-[#3A6AEF]"
            required
            disabled={loading}
          />
          <p className="text-xs text-gray-500 mt-2">
            Maximum file size: 5MB • PDF format only
          </p>
        </div>

        <button
          type="submit"
          disabled={loading || !file}
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#da0b00] to-[#b30024] text-white px-4 py-3 text-sm font-medium rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Processing...
            </>
          ) : (
            <>
              <FileText className="w-5 h-5" />
              Review Resume
            </>
          )}
        </button>
      </form>

      {/* Right Column - Results */}
      <div className="w-full md:max-w-lg p-6 bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col min-h-96">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-5 h-5 text-[#00da57]" />
          <h1 className="text-xl font-semibold">Analysis Results</h1>
        </div>
        
        {!content ? (
          <div className="flex-1 flex flex-col justify-center items-center text-center">
            <div className="text-sm flex flex-col items-center gap-4 text-gray-400">
              <FileText className="w-12 h-12 opacity-50" />
              <p>Upload a resume and click "Review Resume" to get started</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown>
                {content}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewResume;