"use client";
import React, { useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react"; // Icons for mute/unmute

const ReelVideo = () => {
  // Explicitly type the ref as an HTMLVideoElement or null
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <div className="relative flex justify-center">
      <video
        ref={videoRef}
        className="w-[300px] h-[500px] rounded-lg object-cover"
        src="/feed/Feed_1.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
      
      {/* Mute/Unmute Button */}
      <button
        onClick={toggleMute}
        className="absolute bottom-4 right-4 bg-black bg-opacity-50 p-2 rounded-full text-white"
      >
        {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
      </button>
    </div>
  );
};

const InstaClone = () => {
  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar */}
      <aside className="w-64 p-4 border-r border-gray-800 hidden md:block">
        <h1 className="text-2xl font-bold">Social_clone</h1>
        <nav className="mt-6 space-y-4">
          <a href="#" className="block p-2 hover:bg-gray-800 rounded">Home</a>
          <a href="#" className="block p-2 hover:bg-gray-800 rounded">Search</a>
          <a href="#" className="block p-2 hover:bg-gray-800 rounded">Explore</a>
          <a href="#" className="block p-2 hover:bg-gray-800 rounded">Reels</a>
          <a href="#" className="block p-2 hover:bg-gray-800 rounded">Messages</a>
          <a href="#" className="block p-2 hover:bg-gray-800 rounded">Notifications</a>
          <a href="/profile" className="block p-2 hover:bg-gray-800 rounded">Profile</a>
        </nav>
      </aside>
      
      {/* Main Feed */}
      <main className="flex-1 p-4 max-w-2xl mx-auto">
        {/* Stories */}
        <div className="flex space-x-4 overflow-x-auto p-2">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="w-16 h-16 bg-gray-800 rounded-full p-1 border-2 border-pink-500"></div>
          ))}
        </div>
        
        {/* Posts */}
        <div className="mt-6">
          <div className="bg-gray-900 p-4 rounded-lg mb-4">
            <h3 className="font-bold">MNTaufiq</h3>
            <p className="text-sm text-gray-400">Online</p>
            <div className="flex justify-center">
              <ReelVideo />
            </div>
          </div>
        </div>
      </main>
      
      {/* Right Panel */}
      <aside className="w-64 p-4 border-l border-gray-800 hidden lg:block">
        <h3 className="text-lg font-bold">Suggested for you</h3>
        <div className="mt-4 space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-2 hover:bg-gray-800 rounded">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gray-800 rounded-full"></div>
                <span>User {i + 1}</span>
              </div>
              <button className="text-blue-400">Follow</button>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
};

export default InstaClone;
