import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaUser, FaPaperPlane, FaSearch, FaFilter, FaThumbsUp, FaReply, FaTrash, FaTags, FaSortAmountDown, FaExclamationCircle } from 'react-icons/fa';

const DiscussionPage = () => {
  const { user } = useSelector((state) => state.auth);
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [selectedSort, setSelectedSort] = useState('recent');
  const [newQuestion, setNewQuestion] = useState('');
  const [newQuestionTags, setNewQuestionTags] = useState([]);
  const [showNewQuestionForm, setShowNewQuestionForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [expandedDiscussion, setExpandedDiscussion] = useState(null);
  const [error, setError] = useState(null);

  const tags = ['All', 'Crop Management', 'Soil Health', 'Pest Control', 'Organic Farming', 'Irrigation', 'Market Prices'];
  const discussionEndRef = useRef(null);

  useEffect(() => {
    fetchDiscussions();
  }, [selectedSort]);

  const fetchDiscussions = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`http://localhost:9000/api/farmwise/discussions?sort=${selectedSort}`, {
        withCredentials: true
      });
      setDiscussions(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch discussions:', error);
      setError('Failed to load discussions. Please try again later.');
      setLoading(false);
    }
  };

  const handlePostQuestion = async (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    try {
      const response = await axios.post('http://localhost:9000/api/farmwise/discussions', {
        content: newQuestion,
        tags: newQuestionTags.length > 0 ? newQuestionTags : ['General']
      }, {
        withCredentials: true
      });

      setDiscussions([response.data.data, ...discussions]);
      setNewQuestion('');
      setNewQuestionTags([]);
      setShowNewQuestionForm(false);
      // Scroll to the new discussion
      discussionEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      console.error('Failed to post question:', error);
      setError('Failed to post question. Please try again.');
    }
  };

  const handlePostReply = async (discussionId) => {
    if (!replyContent.trim()) return;

    try {
      const response = await axios.post(`http://localhost:9000/api/farmwise/discussions/${discussionId}/replies`, {
        content: replyContent
      }, {
        withCredentials: true
      });

      // Update the discussion with the new reply
      setDiscussions(discussions.map(disc =>
        disc._id === discussionId
          ? { ...disc, replies: [...disc.replies, response.data.data] }
          : disc
      ));

      setReplyContent('');
      setReplyingTo(null);
    } catch (error) {
      console.error('Failed to post reply:', error);
      setError('Failed to post reply. Please try again.');
    }
  };

  const handleLike = async (discussionId) => {
    if (!user) {
      setError('Please log in to like discussions');
      return;
    }

    try {
      const response = await axios.patch(`http://localhost:9000/api/farmwise/discussions/${discussionId}/like`, {}, {
        withCredentials: true
      });

      // Update the discussion likes
      setDiscussions(discussions.map(disc =>
        disc._id === discussionId ? response.data.data : disc
      ));
    } catch (error) {
      console.error('Failed to like discussion:', error);
      setError('Failed to like the discussion. Please try again.');
    }
  };

  const handleTagSelection = (tag) => {
    if (newQuestionTags.includes(tag)) {
      setNewQuestionTags(newQuestionTags.filter(t => t !== tag));
    } else {
      setNewQuestionTags([...newQuestionTags, tag]);
    }
  };

  const handleDeleteDiscussion = async (discussionId) => {
    if (window.confirm('Are you sure you want to delete this discussion?')) {
      try {
        await axios.delete(`http://localhost:9000/api/farmwise/discussions/${discussionId}`, {
          withCredentials: true
        });
        setDiscussions(discussions.filter(disc => disc._id !== discussionId));
      } catch (error) {
        console.error('Failed to delete discussion:', error);
        setError('Failed to delete the discussion. Please try again.');
      }
    }
  };

  const filteredDiscussions = discussions.filter(discussion => {
    const matchesSearch = discussion.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      discussion.author.username.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTag = selectedTag === 'All' ||
      discussion.tags.includes(selectedTag);

    return matchesSearch && matchesTag;
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-bold text-green-700 mb-4">Farmer Discussion Forum</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Connect with other farmers and experts. Ask questions, share knowledge, and find solutions to farming challenges.
          </p>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-3"
          >
            <FaExclamationCircle className="text-xl" />
            <p>{error}</p>
            <button
              className="ml-auto text-red-500"
              onClick={() => setError(null)}
            >
              Close
            </button>
          </motion.div>
        )}

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-1/2">
              <input
                type="text"
                placeholder="Search discussions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2">
                <FaFilter className="text-gray-500" />
                <select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {tags.map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <FaSortAmountDown className="text-gray-500" />
                <select
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                  className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="recent">Most Recent</option>
                  <option value="likes">Most Liked</option>
                  <option value="replies">Most Replies</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Ask Question Section */}
        <div className="mb-8">
          {user ? (
            <div>
              <button
                onClick={() => setShowNewQuestionForm(!showNewQuestionForm)}
                className="bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
              >
                {showNewQuestionForm ? 'Cancel' : 'Ask a Question'}
              </button>

              {showNewQuestionForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white rounded-xl shadow-md p-6 mt-4"
                >
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Ask a Question</h3>
                  <form onSubmit={handlePostQuestion} className="space-y-4">
                    <div>
                      <textarea
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        placeholder="Describe your farming question or issue in detail..."
                        rows="4"
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <FaTags className="text-green-500" />
                        Select Tags (Optional)
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {tags.filter(tag => tag !== 'All').map(tag => (
                          <button
                            type="button"
                            key={tag}
                            onClick={() => handleTagSelection(tag)}
                            className={`px-3 py-1 rounded-full text-sm transition-colors ${newQuestionTags.includes(tag)
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                              }`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                      Post Question
                    </button>
                  </form>
                </motion.div>
              )}
            </div>
          ) : (
            <div className="bg-yellow-50 p-4 rounded-lg text-center">
              <p className="text-yellow-700 mb-2">Please log in to post questions and participate in discussions</p>
              <Link to="/login" className="text-green-600 font-medium hover:underline">
                Log in now
              </Link>
            </div>
          )}
        </div>

        {/* Discussions List */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
            <p className="mt-4 text-xl text-green-700">Loading discussions...</p>
          </div>
        ) : filteredDiscussions.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-md">
            <p className="text-xl text-gray-600">No discussions found</p>
            <p className="text-gray-500 mt-2">Be the first to start a discussion!</p>
          </div>
        ) : (
          <div className="space-y-6" ref={discussionEndRef}>
            {filteredDiscussions.map((discussion) => (
              <motion.div
                key={discussion._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 p-3 rounded-full mt-1">
                      <FaUser className={discussion.author.role === 'expert' ? "text-blue-600" : "text-green-600"} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {discussion.author.username}
                            {discussion.author.role === 'expert' && (
                              <span className="ml-2 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">Expert</span>
                            )}
                          </h3>
                          <p className="text-sm text-gray-500">{new Date(discussion.createdAt).toLocaleString()}</p>
                        </div>
                        <div className="flex gap-2">
                          {discussion.tags.map((tag, index) => (
                            <span key={index} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mt-3">
                        <p className="text-gray-700">
                          {expandedDiscussion === discussion._id
                            ? discussion.content
                            : discussion.content.length > 300
                              ? `${discussion.content.substring(0, 300)}...`
                              : discussion.content
                          }
                        </p>
                        {discussion.content.length > 300 && (
                          <button
                            onClick={() => setExpandedDiscussion(expandedDiscussion === discussion._id ? null : discussion._id)}
                            className="text-green-600 text-sm mt-2 hover:underline"
                          >
                            {expandedDiscussion === discussion._id ? 'Show less' : 'Read more'}
                          </button>
                        )}
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => handleLike(discussion._id)}
                            className={`flex items-center gap-1 text-sm ${user && discussion.likes.includes(user._id)
                                ? 'text-green-600'
                                : 'text-gray-500 hover:text-gray-700'
                              }`}
                            disabled={!user}
                          >
                            <FaThumbsUp />
                            <span>{discussion.likes?.length || 0}</span>
                          </button>

                          <button
                            onClick={() => setReplyingTo(replyingTo === discussion._id ? null : discussion._id)}
                            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
                            disabled={!user}
                          >
                            <FaReply />
                            <span>Reply ({discussion.replies?.length || 0})</span>
                          </button>
                        </div>

                        {user && discussion.author._id === user._id && (
                          <button
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDeleteDiscussion(discussion._id)}
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>

                      {/* Replies */}
                      {(discussion.replies?.length > 0 || replyingTo === discussion._id) && (
                        <div className="mt-4 pl-6 border-l-2 border-gray-100">
                          {discussion.replies?.map((reply) => (
                            <div key={reply._id} className="mb-4 last:mb-0">
                              <div className="flex items-start gap-3">
                                <div className={`p-2 rounded-full ${reply.author.role === 'expert' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                                  <FaUser className={reply.author.role === 'expert' ? "text-blue-600 text-sm" : "text-gray-600 text-sm"} />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-medium text-gray-800">
                                      {reply.author.username}
                                      {reply.author.role === 'expert' && (
                                        <span className="ml-2 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">Expert</span>
                                      )}
                                    </h4>
                                    <span className="text-xs text-gray-500">{new Date(reply.createdAt).toLocaleString()}</span>
                                  </div>
                                  <p className="text-gray-700 mt-1">{reply.content}</p>
                                </div>
                              </div>
                            </div>
                          ))}

                          {/* Reply Form */}
                          {replyingTo === discussion._id && user && (
                            <div className="mt-4">
                              <div className="flex flex-col gap-2">
                                <textarea
                                  value={replyContent}
                                  onChange={(e) => setReplyContent(e.target.value)}
                                  placeholder="Write your reply..."
                                  rows="2"
                                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                                <div className="flex justify-end space-x-2">
                                  <button
                                    onClick={() => setReplyingTo(null)}
                                    className="px-3 py-1 text-gray-600 hover:text-gray-800"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={() => handlePostReply(discussion._id)}
                                    className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg"
                                  >
                                    Reply
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Help Button */}
        <div className="fixed bottom-8 right-8">
          <Link to="/experts">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-green-500 hover:bg-green-600 text-white font-medium p-4 rounded-full shadow-lg"
            >
              <span className="sr-only">Get Expert Help</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </motion.button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DiscussionPage;