import React, { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from 'react-lottie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import socketService from '../services/socket.service';
import { useSelector } from 'react-redux';
import { FaUser, FaPaperPlane, FaEllipsisV } from 'react-icons/fa';

const BACKEND_URL = 'http://localhost:9000';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [socket, setSocket] = useState(null);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { accessToken, refreshToken } = useSelector((state) => state.auth);
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = user?._id;
    const token = accessToken

    if (!userId || !token) {
      console.error('User ID or token not found');
      return;
    }

    // Initialize socket connection
    const newSocket = socketService.connect(userId);
    if (!newSocket) {
      console.error('Failed to initialize socket connection');
      return;
    }

    setSocket(newSocket);

    // Fetch initial messages
    fetchMessages();

    // Socket event listeners
    newSocket.on('receiveMessage', handleNewMessage);
    newSocket.on('userTyping', handleUserTyping);
    newSocket.on('error', handleSocketError);

    return () => {
      if (newSocket) {
        newSocket.off('receiveMessage');
        newSocket.off('userTyping');
        newSocket.off('error');
        socketService.disconnect();
      }
    };
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  useEffect(() => {
    if (activeConversation) {
      fetchMessages(activeConversation._id);
    }
  }, [activeConversation]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/farmwise/messages/get`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
        withCredentials: true
      });

      if (response.data.success) {
        setMessages(response.data.data.map(formatMessage));
      }
    } catch (error) {
      setError('Failed to load messages');
      console.error('Error fetching messages:', error);
    }
  };

  const fetchConversations = async () => {
    try {
      const response = await axios.get('http://localhost:9000/api/farmwise/conversations', {
        withCredentials: true
      });
      setConversations(response.data.data || []);
      setLoading(false);

      // Set first conversation as active if available
      if (response.data.data && response.data.data.length > 0) {
        setActiveConversation(response.data.data[0]);
      }
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
      setLoading(false);
    }
  };

  const handleNewMessage = (message) => {
    setMessages(prev => [...prev, formatMessage(message)]);
    scrollToBottom();
  };

  const handleUserTyping = (userId) => {
    if (userId !== user?._id) {
      setIsTyping(true);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 2000);
    }
  };

  const handleSocketError = (error) => {
    setError(error.message);
    console.error('Socket error:', error);
  };

  const formatMessage = (message) => ({
    id: message._id,
    text: message.message,
    sender: {
      id: message.user._id,
      name: message.user.username,
      avatar: message.user.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${message.user.username}`
    },
    timestamp: new Date(message.createdAt),
    status: 'sent',
    replyTo: message.replyTo ? {
      text: message.replyTo.message,
      sender: {
        name: message.replyTo.user.username
      }
    } : null,
    images: message.image ? [message.image] : []
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!socket) return;

    if (newMessage.trim() || fileInputRef.current?.files?.length) {
      try {
        const formData = new FormData();
        formData.append('message', newMessage.trim());

        if (fileInputRef.current?.files?.length) {
          const file = fileInputRef.current.files[0];
          formData.append('image', file);
        }

        if (replyTo) {
          formData.append('replyTo', replyTo.id);
        }

        // Send message to backend
        const response = await axios.post(
          `${BACKEND_URL}/api/farmwise/messages/send`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'multipart/form-data'
            },
            withCredentials: true
          }
        );

        if (response.data.success) {
          // Emit message through socket
          socket.emit('sendMessage', {
            userId: user._id,
            message: newMessage.trim(),
            replyTo: replyTo?.id,
            image: response.data.data.image
          });

          setNewMessage('');
          setReplyTo(null);
          if (fileInputRef.current) fileInputRef.current.value = '';
        }
      } catch (error) {
        setError('Failed to send message');
        console.error('Error sending message:', error);
      }
    }
  };

  const handleReply = (message) => {
    setReplyTo(message);
    setNewMessage('');
  };

  const handleTyping = () => {
    if (socket) {
      socket.emit('userTyping', user._id);
    }
  };

  const startNewConversation = async (expertId) => {
    try {
      const response = await axios.post('http://localhost:9000/api/farmwise/conversations', {
        recipientId: expertId
      }, {
        withCredentials: true
      });

      setConversations([response.data.data, ...conversations]);
      setActiveConversation(response.data.data);
    } catch (error) {
      console.error('Failed to start conversation:', error);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const Message = ({ message, index }) => {
    const isCurrentUser = message.sender.id === user._id;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div className={`flex ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'} max-w-[80%] items-end group`}>
          <motion.img
            whileHover={{ scale: 1.1 }}
            src={message.sender.avatar}
            alt={message.sender.name}
            className="w-8 h-8 rounded-full"
          />

          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`mx-2 ${isCurrentUser ? 'items-end' : 'items-start'}`}
          >
            {/* Sender Name */}
            <div className={`text-xs font-medium mb-1 ${isCurrentUser ? 'text-right text-green-600' : 'text-left text-gray-600'
              }`}>
              {message.sender.name}
            </div>

            <div className={`rounded-2xl p-4 ${isCurrentUser
                ? 'bg-gradient-to-r from-green-400 to-green-500 text-white'
                : 'bg-gradient-to-r from-gray-100 to-gray-200'
              } shadow-md hover:shadow-lg transition-shadow duration-300`}>
              {message.replyTo && (
                <div className={`mb-2 p-2 rounded-lg ${isCurrentUser ? 'bg-green-600/30' : 'bg-gray-200/50'
                  } text-sm`}>
                  <div className="font-medium">{message.replyTo.sender.name}</div>
                  <div className="truncate">{message.replyTo.text}</div>
                </div>
              )}

              <p className="mb-1">{message.text}</p>

              {message.images?.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {message.images.map((image, idx) => (
                    <motion.img
                      whileHover={{ scale: 1.05 }}
                      key={idx}
                      src={image}
                      alt={`Shared image ${idx + 1}`}
                      className="rounded-lg max-w-xs cursor-pointer"
                      onClick={() => {/* Add image preview functionality */ }}
                    />
                  ))}
                </div>
              )}

              <div className={`text-xs mt-1 ${isCurrentUser ? 'text-white/70' : 'text-gray-500'
                }`}>
                {format(new Date(message.timestamp), 'HH:mm')}
              </div>
            </div>

            {/* Message Actions - Only show on hover */}
            <div className={`flex gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${isCurrentUser ? 'justify-end' : 'justify-start'
              }`}>
              <button
                onClick={() => handleReply(message)}
                className="text-xs text-gray-500 hover:text-green-600 transition-colors duration-200"
              >
                Reply
              </button>
              <button
                className="text-xs text-gray-500 hover:text-green-600 transition-colors duration-200"
              >
                React
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-bold text-green-700 mb-4">Discussion Forum</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Connect directly with farming experts and other farmers for personalized discussions and advice.
          </p>
        </motion.div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden min-h-[600px]">
          <div className="flex flex-col md:flex-row h-[600px]">
            {/* Conversations List */}
            <div className="w-full md:w-1/3 bg-gray-50 border-r border-gray-200">
              <div className="p-4 border-b border-gray-200 bg-white">
                <h2 className="text-lg font-semibold text-gray-800">Conversations</h2>
              </div>

              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-green-500 border-t-transparent"></div>
                </div>
              ) : conversations.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <p>No conversations yet</p>
                  <p className="text-sm mt-2">Start chatting with experts from the experts page</p>
                </div>
              ) : (
                <div className="overflow-y-auto h-[calc(600px-64px)]">
                  {conversations.map((conversation) => {
                    const otherUser = conversation.participants.find(p => p._id !== user._id);
                    return (
                      <div
                        key={conversation._id}
                        onClick={() => setActiveConversation(conversation)}
                        className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-100 ${activeConversation?._id === conversation._id ? 'bg-green-50' : ''
                          }`}
                      >
                        <div className="flex items-center">
                          <div className="bg-green-100 p-2 rounded-full">
                            <FaUser className="text-green-600" />
                          </div>
                          <div className="ml-3">
                            <p className="font-medium text-gray-800">{otherUser?.username}</p>
                            <p className="text-sm text-gray-500 truncate">
                              {conversation.lastMessage || 'Start a conversation'}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Chat Area */}
            <div className="w-full md:w-2/3 flex flex-col">
              {activeConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="bg-green-100 p-2 rounded-full">
                        <FaUser className="text-green-600" />
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-gray-800">
                          {activeConversation.participants.find(p => p._id !== user._id)?.username}
                        </p>
                        <p className="text-xs text-green-600">
                          {activeConversation.participants.find(p => p._id !== user._id)?.role === 'expert' ? 'Expert' : 'Farmer'}
                        </p>
                      </div>
                    </div>
                    <button className="text-gray-500 hover:text-gray-700">
                      <FaEllipsisV />
                    </button>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                    {messages.length === 0 ? (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">No messages yet. Start the conversation!</p>
                      </div>
                    ) : (
                      messages.map((msg) => (
                        <div
                          key={msg._id}
                          className={`max-w-xs mx-2 my-1 p-3 rounded-lg ${msg.sender._id === user._id
                              ? 'bg-green-500 text-white ml-auto'
                              : 'bg-white text-gray-800 border border-gray-200'
                            }`}
                        >
                          <p>{msg.text}</p>
                          <p className={`text-xs mt-1 text-right ${msg.sender._id === user._id ? 'text-green-100' : 'text-gray-500'
                            }`}>
                            {formatTime(msg.timestamp)}
                          </p>
                        </div>
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200 bg-white">
                    <form onSubmit={handleSendMessage} className="flex">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => {
                          setNewMessage(e.target.value);
                          handleTyping();
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage(e);
                          }
                        }}
                        placeholder="Type your message..."
                        className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                      <button
                        type="submit"
                        className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-r-lg transition-colors"
                      >
                        <FaPaperPlane />
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-50">
                  <div className="text-center p-6">
                    <p className="text-xl text-gray-600 mb-4">Select a conversation to start chatting</p>
                    <p className="text-gray-500">Or find experts in the Experts section</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
