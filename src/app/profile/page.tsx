"use client";
import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";

const ProfilePage = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const uploads = [
    "/uploads/Kohli.png",
    "/uploads/Gojo.png",
    "/uploads/Sallubhai.png",
  ];

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar */}
      <aside className="w-64 p-4 border-r border-gray-800 hidden md:block">
        <h1 className="text-2xl font-bold">Social_clone</h1>
        <nav className="mt-6 space-y-4">
          {["Home", "Search", "Explore", "Reels", "Messages", "Notifications", "Profile"].map(
            (item, i) => (
              <a key={i} href="/" className="block p-2 hover:bg-gray-800 rounded">
                {item}
              </a>
            )
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 max-w-4xl mx-auto">
        {/* Profile Info */}
        <div className="flex items-center space-x-6 p-4 border-b border-gray-700">
          <div className="w-24 h-24 bg-gray-500 rounded-full flex items-center justify-center overflow-hidden">
            <img
              src="/uploads/Latest_pic-modified.png"
              alt="DP"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-xl font-bold">Mohammed Naseeruddin Taufiq</h2>
            <p className="text-sm text-gray-400">
              Passionate software developer with a strong foundation in full-stack web development and data analytics
            </p>
            <p className="text-sm text-gray-400">
              Followers: <b>1.2M</b> | Following: <b>600</b>
            </p>
          </div>
        </div>

        {/* Uploads Section */}
        <div className="flex flex-col items-center gap-6">
          <h3 className="text-lg font-bold mb-4">Uploads</h3>
            {/* Profile Uploads Section */}
            <div className="flex gap-4 justify-center">
            {uploads.map((src, index) => (
              <div key={index} className="w-48 h-48 bg-gray-800 flex items-center justify-center rounded-lg overflow-hidden">
                <img
                  src={src}
                  alt={`Upload ${index}`}
                  className="object-contain w-full h-full cursor-pointer"
                  onClick={() => setSelectedImage(src)}
                />
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Zoomed-In Image Overlay */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 left-4 text-white bg-gray-800 p-2 rounded-full"
          >
            <ArrowLeft size={24} />
          </button>
          <img src={selectedImage} alt="Zoomed" className="max-w-[90%] max-h-[90%] rounded-lg" />
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
