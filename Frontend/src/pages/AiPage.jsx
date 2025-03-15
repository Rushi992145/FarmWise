import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaImage, FaPaperPlane, FaRobot } from 'react-icons/fa';

const AiPage = () => {
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: "Hello! I'm your AI farming assistant. How can I help you today? You can ask me about crop diseases, soil health, or upload an image for analysis."
    }
  ]);
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (input.trim() || selectedImage) {
      setMessages([
        ...messages,
        {
          type: 'user',
          content: input,
          image: selectedImage
        }
      ]);
      setInput('');
      setSelectedImage(null);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="bg-green-600 p-4 text-white flex items-center">
            <FaRobot className="text-2xl mr-2" />
            <h1 className="text-xl font-semibold">AI Farming Assistant</h1>
          </div>

          <div className="h-[60vh] overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] rounded-2xl p-4 ${message.type === 'user'
                    ? 'bg-green-600 text-white rounded-br-none'
                    : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  }`}>
                  {message.image && (
                    <img
                      src={message.image}
                      alt="Uploaded"
                      className="max-w-xs rounded-lg mb-2"
                    />
                  )}
                  <p>{message.content}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {selectedImage && (
            <div className="p-2 border-t">
              <div className="relative inline-block">
                <img
                  src={selectedImage}
                  alt="Preview"
                  className="h-20 rounded-lg"
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          <form
            onSubmit={handleSendMessage}
            className="border-t p-4 bg-white"
          >
            <div className="flex items-center space-x-4">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200"
                >
                  <FaImage className="text-xl" />
                </motion.div>
              </label>

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about farming, soil health, or upload an image..."
                className="flex-1 rounded-xl border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="submit"
                className="p-2 rounded-full bg-green-600 text-white hover:bg-green-700"
              >
                <FaPaperPlane className="text-xl" />
              </motion.button>
            </div>
          </form>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 pb-10"
        >
          {[
            {
              title: "Image Analysis",
              description: "Upload photos of your crops for disease detection and health analysis"
            },
            {
              title: "Expert Knowledge",
              description: "Get AI-powered answers based on agricultural expertise"
            },
            {
              title: "24/7 Assistance",
              description: "Get help anytime with your farming queries"
            }
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-xl shadow-md"
            >
              <h3 className="font-semibold text-gray-800">{feature.title}</h3>
              <p className="text-gray-600 text-sm mt-1">{feature.description}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default AiPage;