import React, { useState, useEffect } from "react";
import axios from "axios";

export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('http://localhost:9000/worldnews');

        const newsData = response.data.results;
        setNews(newsData.slice(0, 9));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching news:", error);
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold text-center text-green-700 mb-8">Latest World News</h1>

      {loading ? (
        <p className="text-center text-lg">Loading news...</p>
      ) : news.length === 0 ? (
        <p className="text-center text-lg">No news articles available</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {news.map((article) => (
            <div key={article.id} className="bg-white shadow-lg rounded-xl p-4 border border-gray-200">
              {article.image && (
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-40 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/400x200?text=No+Image';
                  }}
                />
              )}
              <h2 className="text-lg font-semibold mt-3">
                {article.title?.replace('[Upgrade subscription plan]', '')}
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                {article.author?.name || 'Unknown Author'}
              </p>
              <p className="text-gray-500 text-sm mt-2">
                {new Date(article.published_at).toLocaleDateString()}
              </p>
              <p className="text-gray-700 text-sm mt-2 line-clamp-2">
                {article.description?.replace('[Upgrade subscription plan]', '')}
              </p>
              <a
                href={article.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 mt-2 block text-sm font-medium hover:underline"
              >
                Read More →
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
