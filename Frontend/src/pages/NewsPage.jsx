import React,{ useState, useEffect } from "react";

const API_URL = "https://newsapi.org/v2/everything?q=farming OR agriculture&apiKey=YOUR_NEWSAPI_KEY";

export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        setNews(data.articles.slice(0, 9)); 
        setLoading(false);
      })
      .catch((err) => console.error("Error fetching news:", err));
  }, []);

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold text-center text-green-700 mb-8">Latest Farming News</h1>
      
      {loading ? (
        <p className="text-center text-lg">Loading news...</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {news.map((article, index) => (
            <div key={index} className="bg-white shadow-lg rounded-xl p-4 border border-gray-200">
              <img src={article.urlToImage} alt={article.title} className="w-full h-40 object-cover rounded-lg" />
              <h2 className="text-lg font-semibold mt-3">{article.title}</h2>
              <p className="text-gray-600 text-sm mt-1">{article.source.name}</p>
              <a
                href={article.url}
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
