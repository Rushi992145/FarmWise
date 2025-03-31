import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { FaUser, FaThumbsUp, FaComments, FaEdit, FaTrash } from 'react-icons/fa';

const ProfilePage = () => {
  const { user } = useSelector((state) => state.auth);
  const [userBlogs, setUserBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserBlogs = async () => {
      if (user?._id) {
        try {
          const response = await axios.get(`http://localhost:9000/api/farmwise/blog/user/${user._id}`, {
            withCredentials: true
          });
          setUserBlogs(response.data.data || []);
        } catch (error) {
          console.error('Failed to fetch user blogs:', error);
        }
      }
      setLoading(false);
    };

    fetchUserBlogs();
  }, [user?._id]);

  const handleDeleteBlog = async (blogId) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await axios.delete(`http://localhost:9000/api/farmwise/blog/${blogId}`, {
          withCredentials: true
        });
        setUserBlogs(userBlogs.filter(blog => blog._id !== blogId));
      } catch (error) {
        console.error('Failed to delete blog:', error);
      }
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
        <div className="flex items-center space-x-4">
          <div className="bg-green-100 p-4 rounded-full">
            <FaUser className="text-green-600 text-3xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{user?.username || 'User'}</h1>
            <p className="text-green-600">{user?.userType === 'expert' ? 'Farming Expert' : 'Community Member'}</p>
            <p className="text-gray-600 mt-1">{user?.email}</p>
          </div>
        </div>
      </div>

      {user?.role === 'expert' && (
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">My Blogs</h2>
          {loading ? (
            <p className="text-center text-lg">Loading blogs...</p>
          ) : userBlogs.length === 0 ? (
            <p className="text-center text-lg text-gray-600">No blogs published yet</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userBlogs.map((blog) => (
                <div key={blog._id} className="bg-white rounded-xl shadow-md overflow-hidden">
                  {blog.blogPicture && (
                    <img
                      src={blog.blogPicture}
                      alt={blog.title}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/400x200?text=No+Image';
                      }}
                    />
                  )}
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{blog.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {blog.content.substring(0, 150)}...
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex space-x-4">
                        <span className="flex items-center">
                          <FaThumbsUp className="mr-1" />
                          {blog.likes?.length || 0}
                        </span>
                        <span className="flex items-center">
                          <FaComments className="mr-1" />
                          {blog.comments?.length || 0}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleDeleteBlog(blog._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash />
                        </button>
                        <button
                          onClick={() => {/* Add edit functionality */ }}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <FaEdit />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Regular User Section */}
      {user?.role !== 'expert' && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Community Member</h2>
          <p className="text-gray-600">
            Join our community of farming enthusiasts! Share your experiences and learn from others.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;