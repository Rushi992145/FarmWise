import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaUser, FaThumbsUp, FaComments, FaEdit, FaTrash, FaCalendarAlt, FaGraduationCap, FaBriefcase, FaMapMarkerAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const { user } = useSelector((state) => state.auth);
  const [userBlogs, setUserBlogs] = useState([]);
  const [expertProfile, setExpertProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?._id) {
        setLoading(true);
        try {
          // Fetch user blogs if they exist
          const blogsResponse = await axios.get(`http://localhost:9000/api/farmwise/blog/user/${user._id}`, {
            withCredentials: true
          });
          setUserBlogs(blogsResponse.data.data || []);

          // Fetch expert profile if user is an expert
          if (user.role === 'expert') {
            const expertResponse = await axios.get(`http://localhost:9000/api/farmwise/experts/profile`, {
              withCredentials: true
            });
            setExpertProfile(expertResponse.data.data);

            // Fetch expert appointments
            const appointmentsResponse = await axios.get(`http://localhost:9000/api/farmwise/booking/expert`, {
              withCredentials: true
            });
            setAppointments(appointmentsResponse.data.data || []);
          } else {
            // Fetch user appointments
            const appointmentsResponse = await axios.get(`http://localhost:9000/api/farmwise/booking/user`, {
              withCredentials: true
            });
            setAppointments(appointmentsResponse.data.data || []);
          }
        } catch (error) {
          console.error('Failed to fetch user data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [user?._id, user?.role]);

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

  const formatAppointmentStatus = (status) => {
    switch (status) {
      case 'pending': return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">Pending</span>;
      case 'confirmed': return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full">Confirmed</span>;
      case 'completed': return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">Completed</span>;
      case 'cancelled': return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full">Cancelled</span>;
      default: return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex justify-center items-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
          <p className="mt-4 text-xl text-green-700">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-10">
      <div className="container mx-auto px-4">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="bg-green-100 p-6 rounded-full">
              <FaUser className="text-green-600 text-5xl" />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-800">{user?.username || 'User'}</h1>
              <p className="text-green-600 text-lg">
                {user?.role === 'expert' ? 'Farming Expert' : 'Community Member'}
              </p>
              <p className="text-gray-600 mt-2">{user?.email}</p>

              {expertProfile && (
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaGraduationCap className="text-green-600" />
                    <span>{expertProfile.degreeOrCirtification}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <FaBriefcase className="text-green-600" />
                    <span>{expertProfile.experience} years of experience</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <FaMapMarkerAlt className="text-green-600" />
                    <span>{expertProfile.city}, {expertProfile.country}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-md mb-8 overflow-hidden">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-6 py-4 font-medium ${activeTab === 'profile'
                ? 'text-green-600 border-b-2 border-green-500'
                : 'text-gray-600 hover:text-green-600'}`}
            >
              Profile
            </button>
            {user?.role === 'expert' && (
              <button
                onClick={() => setActiveTab('blogs')}
                className={`px-6 py-4 font-medium ${activeTab === 'blogs'
                  ? 'text-green-600 border-b-2 border-green-500'
                  : 'text-gray-600 hover:text-green-600'}`}
              >
                My Blogs
              </button>
            )}
            <button
              onClick={() => setActiveTab('appointments')}
              className={`px-6 py-4 font-medium ${activeTab === 'appointments'
                ? 'text-green-600 border-b-2 border-green-500'
                : 'text-gray-600 hover:text-green-600'}`}
            >
              Appointments
            </button>
          </div>
        </div>

        {/* Profile Tab Content */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            {expertProfile ? (
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">About Me</h2>
                <p className="text-gray-700 mb-6">{expertProfile.about}</p>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">Specializations</h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  {expertProfile.specialization.map((spec, index) => (
                    <span key={index} className="px-3 py-1 bg-green-100 text-green-700 rounded-full">
                      {spec}
                    </span>
                  ))}
                </div>

                <div className="flex justify-end">
                  <Link to="/experts">
                    <button className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                      View Public Profile
                    </button>
                  </Link>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Welcome to Farmwise!</h2>
                <p className="text-gray-700 mb-6">
                  As a community member, you can interact with other farmers, ask questions in the discussion forum, and book consultations with our farming experts.
                </p>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Want to join as an expert?</h3>
                  <p className="text-gray-700 mb-4">
                    If you have expertise in agriculture and want to help other farmers, consider applying to become a Farmwise expert.
                  </p>
                  <button className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                    Apply as Expert
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Blogs Tab Content */}
        {activeTab === 'blogs' && (
          <>
            <div className="mb-6">
              <Link to="/blog">
                <button className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2">
                  <FaEdit /> Write New Blog
                </button>
              </Link>
            </div>

            {userBlogs.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <p className="text-xl text-gray-600 mb-4">You haven't published any blogs yet</p>
                <p className="text-gray-500">Share your farming knowledge and experiences with the community</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userBlogs.map((blog) => (
                  <motion.div
                    key={blog._id}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
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
                        {blog.content?.substring(0, 150)}...
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
                          <Link to={`/blog/edit/${blog._id}`}>
                            <button className="text-blue-500 hover:text-blue-700">
                              <FaEdit />
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Appointments Tab Content */}
        {activeTab === 'appointments' && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                {user?.role === 'expert' ? 'My Consultations' : 'My Appointments'}
              </h2>

              {appointments.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-xl text-gray-600 mb-4">No appointments found</p>
                  {user?.role !== 'expert' && (
                    <Link to="/experts">
                      <button className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                        Book a Consultation
                      </button>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {user?.role === 'expert' ? 'Client' : 'Expert'}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date & Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Message
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {appointments.map((appointment) => (
                        <tr key={appointment._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                                <FaUser className="text-green-600" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {user?.role === 'expert'
                                    ? appointment.userId.username
                                    : appointment.expertId.userId.username}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {new Date(appointment.date).toLocaleDateString()}
                            </div>
                            <div className="text-sm text-gray-500">
                              {appointment.time}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {formatAppointmentStatus(appointment.status)}
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 max-w-xs truncate">
                              {appointment.message}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;