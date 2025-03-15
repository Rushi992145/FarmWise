import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUser, FaSearch, FaHotjar, FaTrophy, FaClock, FaComments, FaShare, FaThumbsUp, FaTimes, FaImage, FaPlus } from "react-icons/fa";

const CreatePostModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    topic: "",
    content: "",
    tags: "",
    image: null
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()),
      id: Date.now(),
      author: "You",
      role: "Farmer",
      likes: 0,
      shares: 0,
      comments: [],
      timestamp: "Just now"
    });
    onClose();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 backdrop-blur bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-2xl p-6 w-full max-w-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Create Discussion</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Topic</label>
                <input
                  type="text"
                  value={formData.topic}
                  onChange={e => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="What would you like to discuss?"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Content</label>
                <textarea
                  value={formData.content}
                  onChange={e => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[150px]"
                  placeholder="Describe your question or topic in detail..."
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={e => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., Organic, Fertilizers, Wheat"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Image (optional)</label>
                <div className="flex items-center space-x-4">
                  <label className="cursor-pointer flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50">
                    <FaImage className="text-gray-500" />
                    <span>Choose Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  {formData.image && (
                    <div className="relative">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="h-20 w-20 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, image: null }))}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <motion.button
                  type="button"
                  onClick={onClose}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700"
                >
                  Create Post
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const DiscussionPage = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      topic: "Organic Fertilizers",
      author: "Rahul Sharma",
      role: "Farmer",
      content: "Which organic fertilizers work best for wheat crops? I've been trying different combinations but haven't found the optimal solution yet. Looking for expert advice and fellow farmers' experiences.",
      likes: 24,
      shares: 8,
      image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449",
      comments: [
        {
          user: "Dr. Mehta",
          role: "Expert",
          text: "Compost and vermicompost are great options! They improve soil structure and provide balanced nutrition.",
          likes: 12,
          timestamp: "2h ago"
        },
        {
          user: "Amit Kumar",
          role: "Farmer",
          text: "I use cow manure, works great! Mix it with some neem cake for better results.",
          likes: 8,
          timestamp: "1h ago"
        },
      ],
      timestamp: "5h ago",
      tags: ["Organic", "Fertilizers", "Wheat"]
    },
    {
      id: 2,
      topic: "Pest Control",
      author: "Pooja Reddy",
      role: "Farmer",
      content: "How do you naturally control pests in tomato farming? I'm losing about 20% of my crop to pests and want to try organic solutions before resorting to chemicals.",
      likes: 31,
      shares: 12,
      image: "https://images.unsplash.com/photo-1592491890705-ef26fa8d2f47",
      comments: [
        {
          user: "Dr. Singh",
          role: "Expert",
          text: "Neem oil spray is highly effective! Mix 2-3ml per liter of water and spray weekly.",
          likes: 15,
          timestamp: "3h ago"
        },
      ],
      timestamp: "8h ago",
      tags: ["Pest Control", "Organic", "Tomatoes"]
    },
  ]);

  const [newComment, setNewComment] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);
  const [activeFilter, setActiveFilter] = useState("trending");
  const [search, setSearch] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const addComment = (postId) => {
    if (!newComment.trim()) return;
    const updatedPosts = posts.map((post) =>
      post.id === postId
        ? {
          ...post,
          comments: [
            ...post.comments,
            {
              user: "You",
              role: "Farmer",
              text: newComment,
              likes: 0,
              timestamp: "Just now"
            }
          ]
        }
        : post
    );
    setPosts(updatedPosts);
    setNewComment("");
  };

  const handleCreatePost = (newPost) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <motion.aside
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="w-full md:w-1/4"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsCreateModalOpen(true)}
              className="w-full mb-4 bg-green-600 text-white p-3 rounded-xl flex items-center justify-center space-x-2 hover:bg-green-700"
            >
              <FaPlus />
              <span>Create Discussion</span>
            </motion.button>

            <div className="bg-white p-4 rounded-2xl shadow-md sticky top-24">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Filters</h2>
              <ul className="space-y-2">
                {[
                  { icon: <FaHotjar />, label: "Trending", value: "trending" },
                  { icon: <FaTrophy />, label: "Most Helpful", value: "helpful" },
                  { icon: <FaClock />, label: "Recent", value: "recent" }
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
                placeholder="Search discussions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full p-3 pl-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
              />
              <FaSearch className="absolute left-4 top-3.5 text-gray-400" />
            </div>

            <div className="space-y-6">
              {posts.map((post) => (
                <motion.div
                  key={post.id}
                  whileHover={{ scale: 1.01 }}
                  className="bg-white rounded-2xl shadow-md overflow-hidden"
                >
                  {post.image && (
                    <img
                      src={post.image}
                      alt={post.topic}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                      <div className="flex items-center space-x-2">
                        <FaUser className={post.role === "Expert" ? "text-yellow-500" : "text-green-500"} />
                        <span className="font-medium">{post.author}</span>
                        {post.role === "Expert" && (
                          <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs">
                            Expert
                          </span>
                        )}
                      </div>
                      <span>•</span>
                      <span>{post.timestamp}</span>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{post.topic}</h3>
                    <p className="text-gray-600 mb-4">{post.content}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-6 text-gray-500">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            className="flex items-center space-x-2"
                          >
                            <FaThumbsUp />
                            <span>{post.likes}</span>
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            className="flex items-center space-x-2"
                          >
                            <FaComments />
                            <span>{post.comments.length}</span>
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            className="flex items-center space-x-2"
                          >
                            <FaShare />
                            <span>{post.shares}</span>
                          </motion.button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {post.comments.map((comment, index) => (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={index}
                            className="bg-gray-50 rounded-xl p-4"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <FaUser className={comment.role === "Expert" ? "text-yellow-500" : "text-green-500"} />
                                <span className="font-medium">{comment.user}</span>
                                {comment.role === "Expert" && (
                                  <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs">
                                    Expert
                                  </span>
                                )}
                                <span className="text-gray-500 text-sm">{comment.timestamp}</span>
                              </div>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                className="flex items-center space-x-1 text-gray-500"
                              >
                                <FaThumbsUp className="text-sm" />
                                <span className="text-sm">{comment.likes}</span>
                              </motion.button>
                            </div>
                            <p className="text-gray-700">{comment.text}</p>
                          </motion.div>
                        ))}
                      </div>

                      <div className="mt-4 flex space-x-2">
                        <input
                          type="text"
                          placeholder="Add a comment..."
                          value={selectedPost === post.id ? newComment : ""}
                          onChange={(e) => setNewComment(e.target.value)}
                          onFocus={() => setSelectedPost(post.id)}
                          className="flex-grow p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => addComment(post.id)}
                          className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700"
                        >
                          Comment
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.main>

          <motion.aside
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="w-full md:w-1/4"
          >
            <div className="bg-white p-4 rounded-2xl shadow-md sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Top Contributors</h2>
              <div className="space-y-4">
                {[
                  { name: "Dr. Mehta", role: "Expert", posts: 156, likes: 1.2 },
                  { name: "Amit Kumar", role: "Farmer", posts: 89, likes: 856 },
                  { name: "Dr. Singh", role: "Expert", posts: 134, likes: 1.1 },
                ].map((contributor, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50"
                  >
                    <FaUser className={contributor.role === "Expert" ? "text-yellow-500" : "text-green-500"} />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{contributor.name}</span>
                        {contributor.role === "Expert" && (
                          <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs">
                            Expert
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        {contributor.posts} posts • {contributor.likes} likes
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.aside>
        </div>
      </div>

      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePost}
      />
    </div>
  );
};

export default DiscussionPage;
