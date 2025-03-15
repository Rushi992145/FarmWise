import React,{ useState } from "react";
import { FaThumbsUp, FaUser, FaSearch } from "react-icons/fa";

const posts = [
  {
    id: 1,
    title: "How AI is Changing Organic Farming",
    content: "AI-powered systems are revolutionizing agriculture by optimizing crop growth...",
    author: "John Doe",
    date: "March 15, 2025",
    likes: 120,
  },
  {
    id: 2,
    title: "Sustainable Farming Techniques",
    content: "Organic farming relies on natural fertilizers and crop rotation to improve soil health...",
    author: "Sarah Green",
    date: "March 14, 2025",
    likes: 95,
  },
  {
    id: 3,
    title: "The Future of Agriculture with Robotics",
    content: "With advancements in robotics, farming is becoming more efficient and eco-friendly...",
    author: "Michael Brown",
    date: "March 13, 2025",
    likes: 80,
  },
];

const Blog = () => {
  const [selectedPost, setSelectedPost] = useState(posts[0]);
  const [search, setSearch] = useState("");

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6 flex flex-col md:flex-row gap-6 pt-32">
      
      <aside className="w-full md:w-1/4 bg-gray-100 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <ul className="space-y-2">
          <li className="cursor-pointer text-gray-700 hover:text-green-500">Trending</li>
          <li className="cursor-pointer text-gray-700 hover:text-green-500">Most Liked</li>
          <li className="cursor-pointer text-gray-700 hover:text-green-500">Recent Posts</li>
        </ul>
      </aside>

      <main className="w-full md:w-2/4">
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search for blogs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 pl-10 border border-gray-300 rounded-lg"
          />
          <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
        </div>

        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="p-4 bg-white rounded-lg shadow hover:shadow-lg cursor-pointer"
              onClick={() => setSelectedPost(post)}
            >
              <h3 className="text-xl font-semibold">{post.title}</h3>
              <p className="text-gray-600 text-sm">{post.date} • {post.likes} Likes</p>
              <p className="text-gray-700 mt-2">{post.content.substring(0, 100)}...</p>
            </div>
          ))}
        </div>
      </main>

      <aside className="w-full md:w-1/4 bg-gray-100 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">{selectedPost.title}</h2>
        <p className="text-gray-600 text-sm">{selectedPost.date} • {selectedPost.likes} Likes</p>
        <p className="mt-2 text-gray-700">{selectedPost.content}</p>

        <div className="mt-6 p-4 bg-white rounded-lg shadow">
          <div className="flex items-center space-x-3">
            <FaUser className="text-gray-600 text-2xl" />
            <div>
              <h3 className="text-md font-semibold">{selectedPost.author}</h3>
              <p className="text-gray-500 text-sm">Organic Farming Expert</p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Blog;
