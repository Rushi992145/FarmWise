import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaThumbsUp, FaUser, FaSearch, FaHotjar, FaTrophy, FaClock, FaComments, FaShare, FaTimes } from "react-icons/fa";

const posts = [
  {
    id: 1,
    title: "How AI is Changing Organic Farming",
    content: "AI-powered systems are revolutionizing agriculture by optimizing crop growth and improving yield predictions. With machine learning algorithms, farmers can now better understand soil conditions and make data-driven decisions...",
    author: "John Doe",
    date: "March 15, 2025",
    likes: 120,
    comments: 45,
    shares: 23,
    tags: ["AI", "Technology", "Organic"],
    image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?ixlib=rb-4.0.3"
  },
  {
    id: 2,
    title: "Sustainable Farming Techniques",
    content: "Organic farming relies on natural fertilizers and crop rotation to improve soil health. These methods not only protect the environment but also produce healthier crops with better nutritional value...",
    author: "Sarah Green",
    date: "March 14, 2025",
    likes: 95,
    comments: 32,
    shares: 18,
    tags: ["Organic", "Sustainability"],
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3"
  },
  {
    id: 3,
    title: "The Future of Agriculture with Robotics",
    content: "With advancements in robotics, farming is becoming more efficient and eco-friendly. Automated systems can now handle everything from planting to harvesting with incredible precision...",
    author: "Michael Brown",
    date: "March 13, 2025",
    likes: 80,
    comments: 28,
    shares: 15,
    tags: ["Robotics", "Innovation"],
    image: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?ixlib=rb-4.0.3"
  },
];

const UserProfile = ({ author }) => {
  const userPosts = posts.filter(post => post.author === author);

  return (
    <div className="space-y-4">
      <div className="p-4 bg-green-50 rounded-xl">
        <div className="flex items-center space-x-3">
          <FaUser className="text-green-600 text-3xl" />
          <div>
            <h3 className="text-lg font-semibold">{author}</h3>
            <p className="text-green-600">Organic Farming Expert</p>
            <div className="flex space-x-4 mt-2 text-sm text-gray-600">
              <span>{userPosts.length} posts</span>
              <span>•</span>
              <span>{userPosts.reduce((acc, post) => acc + post.likes, 0)} total likes</span>
            </div>
          </div>
        </div>
      </div>

      <h4 className="font-semibold text-gray-700">Other posts by {author}</h4>
      <div className="space-y-3">
        {userPosts.map(post => (
          <div key={post.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
            <h5 className="font-medium text-gray-800">{post.title}</h5>
            <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
              <span>{post.date}</span>
              <div className="flex items-center space-x-1">
                <FaThumbsUp className="text-xs" />
                <span>{post.likes}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Blog = () => {
  const [selectedPost, setSelectedPost] = useState(null);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("trending");

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <motion.aside
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="w-full md:w-1/4"
          >
            <div className="bg-white p-4 rounded-2xl shadow-md sticky top-24">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Filters</h2>
              <ul className="space-y-2">
                {[
                  { icon: <FaHotjar />, label: "Trending", value: "trending" },
                  { icon: <FaTrophy />, label: "Most Liked", value: "liked" },
                  { icon: <FaClock />, label: "Recent Posts", value: "recent" }
                ].map((filter) => (
                  <motion.li
                    key={filter.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveFilter(filter.value)}
                    className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer ${activeFilter === filter.value
                        ? 'bg-green-100 text-green-600'
                        : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    {filter.icon}
                    <span>{filter.label}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.aside>

          <motion.main
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-full md:w-2/4"
          >
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="Search for blogs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full p-3 pl-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
              />
              <FaSearch className="absolute left-4 top-3.5 text-gray-400" />
            </div>

            {selectedPost ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-md overflow-hidden"
              >
                {selectedPost.image && (
                  <img
                    src={selectedPost.image}
                    alt={selectedPost.title}
                    className="w-full h-64 object-cover"
                  />
                )}
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold text-gray-800">{selectedPost.title}</h2>
                    <button
                      onClick={() => setSelectedPost(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <FaTimes />
                    </button>
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
                    <FaUser className="text-green-500" />
                    <span>{selectedPost.author}</span>
                    <span>•</span>
                    <span>{selectedPost.date}</span>
                  </div>

                  <p className="text-gray-700 leading-relaxed mb-6">
                    {selectedPost.content}
                  </p>

                  <div className="flex items-center justify-between border-t pt-4">
                    <div className="flex items-center space-x-6 text-gray-500">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        className="flex items-center space-x-2"
                      >
                        <FaThumbsUp />
                        <span>{selectedPost.likes}</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        className="flex items-center space-x-2"
                      >
                        <FaComments />
                        <span>{selectedPost.comments}</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        className="flex items-center space-x-2"
                      >
                        <FaShare />
                        <span>{selectedPost.shares}</span>
                      </motion.button>
                    </div>
                    <div className="flex gap-2">
                      {selectedPost.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {filteredPosts.map((post) => (
                  <motion.div
                    key={post.id}
                    whileHover={{ scale: 1.01 }}
                    className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer"
                    onClick={() => setSelectedPost(post)}
                  >
                    {post.image && (
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                        <FaUser className="text-green-500" />
                        <span>{post.author}</span>
                        <span>•</span>
                        <span>{post.date}</span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{post.title}</h3>
                      <p className="text-gray-600 mb-4">{post.content.substring(0, 150)}...</p>
                      <div className="flex items-center space-x-6 text-gray-500">
                        <div className="flex items-center space-x-2">
                          <FaThumbsUp />
                          <span>{post.likes}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FaComments />
                          <span>{post.comments}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FaShare />
                          <span>{post.shares}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        {post.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.main>

          {/* Right Sidebar - User Profile */}
          <motion.aside
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="w-full md:w-1/4"
          >
            <div className="bg-white p-4 rounded-2xl shadow-md sticky top-24">
              {selectedPost ? (
                <UserProfile author={selectedPost.author} />
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <p>Select a post to see author details</p>
                </div>
              )}
            </div>
          </motion.aside>
        </div>
      </div>
    </div>
  );
};

export default Blog;
