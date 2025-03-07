"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getUserProfile, updateProfilePic, signUpUser } from '../utils/auth';
import { uploadAvatar } from '../utils/storage';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import Link from 'next/link';

interface Profile {
  id: string;
  username: string;
  avatar_url?: string;
  bio?: string;
  // Add other profile fields as needed
}

interface Post {
  id: string;
  user_id: string;
  image_url?: string;
  caption?: string;
  created_at: string;
  // Add other post fields as needed
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [editingBio, setEditingBio] = useState(false);
  const session = useSession();
  const supabaseClient = useSupabaseClient();


  useEffect(() => {
    const fetchProfile = async () => {
      if (session?.user?.id) {
        const userId = session.user.id;
        const userProfile = await getUserProfile(userId);
        setProfile(userProfile);
        
        // Fetch user posts
        const { data, error } = await supabaseClient
          .from('posts')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
          
        if (data && !error) {
          setPosts(data);
        }
        
        // Set bio if it exists in profile
        if (userProfile?.bio) {
          setBio(userProfile.bio);
        }
      }
      setLoading(false);
    };

    fetchProfile();
  }, [session, supabaseClient]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && profile) {
      const avatarUrl = await uploadAvatar(e.target.files[0], profile.id);
      if (avatarUrl) {
        await updateProfilePic(profile.id, avatarUrl);
        setProfile({ ...profile, avatar_url: avatarUrl });
      }
    }
  };

  const updateBio = async () => {
    if (profile) {
      try {
        const { error } = await supabaseClient
          .from('profiles')
          .update({ bio })
          .eq('id', profile.id);
          
        if (!error) {
          setProfile({ ...profile, bio });
          setEditingBio(false);
        }
      } catch (error) {
        console.error('Error updating bio:', error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSignIn) {
      const { error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        console.error('Sign-in error:', error.message);
        // You could add an error state here to display the error message
      } else {
        setShowPopup(false);
      }
    } else {
      const user = await signUpUser(email, password, username);
      if (user) {
        setShowPopup(false);
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/5 bg-black text-white p-4">
      <h1 className="text-2xl font-bold">Social_clone</h1>
        <nav className="mt-6 space-y-4">
          <Link href="../page.tsx" className="block p-2 hover:bg-gray-800 rounded">Home</Link>
          <Link href="#" className="block p-2 hover:bg-gray-800 rounded">Search</Link>
          <Link href="#" className="block p-2 hover:bg-gray-800 rounded">Explore</Link>
          <Link href="#" className="block p-2 hover:bg-gray-800 rounded">Reels</Link>
          <Link href="#" className="block p-2 hover:bg-gray-800 rounded">Messages</Link>
          <Link href="#" className="block p-2 hover:bg-gray-800 rounded">Notifications</Link>
          <Link href="/profile" className="block p-2 hover:bg-gray-800 rounded">Profile</Link>
          <div
            className="p-3 hover:bg-gray-700 cursor-pointer rounded-lg"
            onClick={() => setShowPopup(true)}
          >
            Account
          </div>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
          </div>
        ) : session ? (
          <>
            {/* Profile Header */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="flex flex-col md:flex-row items-start md:items-center">
                {/* Avatar Section */}
                <div className="mb-4 md:mb-0 md:mr-8">
                  <div className="relative group">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-gray-300 overflow-hidden bg-gray-200 flex items-center justify-center">
                      {profile?.avatar_url ? (
                        <Image 
                          src={profile.avatar_url} 
                          alt="Profile" 
                          width={128} 
                          height={128} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-500">No Profile Pic</span>
                      )}
                    </div>
                    <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity">
                      <span>Upload</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleAvatarChange} 
                        className="hidden" 
                      />
                    </label>
                  </div>
                </div>

                {/* Profile Info */}
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center mb-4">
                    <h1 className="text-xl font-bold mr-4">{profile?.username || 'Username'}</h1>
                    <button className="mt-2 md:mt-0 px-4 py-1 border border-gray-300 rounded font-semibold text-sm">
                      Edit Profile
                    </button>
                  </div>

                  {/* Stats */}
                  <div className="flex space-x-6 mb-4">
                    <div><span className="font-semibold">{posts.length}</span> posts</div>
                    <div><span className="font-semibold">0</span> followers</div>
                    <div><span className="font-semibold">0</span> following</div>
                  </div>

                  {/* Bio */}
                  <div>
                    {editingBio ? (
                      <div className="flex items-start">
                        <textarea
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows={3}
                          placeholder="Write your bio..."
                        />
                        <div className="ml-2 flex flex-col space-y-2">
                          <button 
                            onClick={updateBio}
                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                          >
                            Save
                          </button>
                          <button 
                            onClick={() => {
                              setBio(profile?.bio || '');
                              setEditingBio(false);
                            }}
                            className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="mb-2">
                        {bio ? (
                          <p>{bio}</p>
                        ) : (
                          <p className="text-gray-500 italic">No bio yet.</p>
                        )}
                        <button 
                          onClick={() => setEditingBio(true)} 
                          className="text-blue-500 text-sm hover:underline mt-1"
                        >
                          {bio ? 'Edit Bio' : 'Add Bio'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Posts Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="border-b pb-4 mb-4">
                <h2 className="text-xl font-semibold">Posts</h2>
              </div>

              {posts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {posts.map((post) => (
                    <div key={post.id} className="aspect-square bg-gray-200 rounded-md overflow-hidden relative">
                      {post.image_url ? (
                        <Image 
                          src={post.image_url} 
                          alt="Post" 
                          layout="fill" 
                          objectFit="cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                          No image
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No posts yet.</p>
                  <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                    Create your first post
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Welcome to Social_clone</h2>
              <p className="mb-6">Please sign in to view your profile.</p>
              <button 
                onClick={() => setShowPopup(true)}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Sign In
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sign-in/Sign-up Popup */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{isSignIn ? 'Sign In' : 'Sign Up'}</h2>
              <button 
                onClick={() => setShowPopup(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
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
              {!isSignIn && (
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
                  onClick={() => setIsSignIn(!isSignIn)}
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