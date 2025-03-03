"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getUserProfile, updateProfilePic, signUpUser } from '../utils/auth'; // Import signUpUser
import { uploadAvatar } from '../utils/storage';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [uploads, setUploads] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false); // State for showing/hiding the popup
  const [isSignIn, setIsSignIn] = useState(true); // State to toggle between sign-in and sign-up
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState(''); // Added for sign-up
  const session = useSession();
  const supabaseClient = useSupabaseClient();

  useEffect(() => {
    const fetchProfile = async () => {
      if (session?.user?.id) {
        const userId = session.user.id;
        const userProfile = await getUserProfile(userId);
        setProfile(userProfile);
      }
      setLoading(false); // Set loading to false regardless of authentication
    };

    fetchProfile();
  }, [session]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && profile) {
      const avatarUrl = await uploadAvatar(e.target.files[0], profile.id);
      if (avatarUrl) {
        await updateProfilePic(profile.id, avatarUrl);
        setProfile({ ...profile, avatar_url: avatarUrl });
      }
    }
  };

  // Function to handle sign-in/sign-up form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSignIn) {
      // Handle sign-in logic (using Supabase Auth)
      const { error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        console.error('Sign-in error:', error.message);
        // Handle sign-in error (e.g., display error message)
      } else {
        setShowPopup(false); // Close the popup on successful sign-in
      }
    } else {
      // Handle sign-up logic (using your signUpUser function)
      const user = await signUpUser(email, password, username);
      if (user) {
        setShowPopup(false); // Close the popup on successful sign-up
      }
    }
  };

  return (
    <div className="flex h-screen bg-black text-white">
      {/* Sidebar */}
      <div className="w-1/5 bg-black text-white p-4">
        <h2 className="text-lg font-bold mb-6">Social_clone</h2>
        <nav>
          {/* ... navigation links ... */}
          <div
            className="p-3 hover:bg-gray-700 cursor-pointer rounded-lg"
            onClick={() => setShowPopup(true)} // Open the popup when "Account" is clicked
          >
            Account
          </div>
        </nav>
      </div>

      {/* Main Profile Section */}
      <div className="flex-1 bg-white p-6">
        {loading ? (
          <div>Loading...</div> // Show loading indicator
        ) : profile ? (
          // Render profile content if the user is logged in and profile is fetched
          <div className="border-2 border-black p-4 rounded-lg">
            <div className="flex items-center space-x-6">
              <div className="border-2 border-black rounded-full w-20 h-20 flex items-center justify-center">
                {profile.avatar_url ? (
                  <Image src={profile.avatar_url} alt="Profile" width={80} height={80} />
                ) : (
                  <span className="text-sm">Profile Pic</span>
                )}
              </div>
              {/* ... rest of the profile information ... */}
            </div>
            <input type="file" accept="image/*" onChange={handleAvatarChange} />
          </div>
        ) : (
          // Show a message if the user is not logged in
          <div>Please sign in to view your profile.</div>
        )}

        {/* Uploads Section */}
        {/* ... uploads section ... */}
      </div>

      {/* Sign-in/Sign-up Popup */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">{isSignIn ? 'Sign In' : 'Sign Up'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
                  Email:
                </label>
                <input
                  type="email"
                  id="email"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block text-gray-700 font-bold mb-2">
                  Password:
                </label>
                <input
                  type="password"
                  id="password"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {!isSignIn && ( // Show username field only for sign-up
                <div className="mb-4">
                  <label htmlFor="username" className="block text-gray-700 font-bold mb-2">
                    Username:
                  </label>
                  <input
                    type="text"
                    id="username"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              )}
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  {isSignIn ? 'Sign In' : 'Sign Up'}
                </button>
                <button
                  type="button"
                  className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                  onClick={() => setIsSignIn(!isSignIn)} // Toggle between sign-in and sign-up
                >
                  {isSignIn ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}