import { useState, useEffect } from "react";
import { copy, linkIcon, loader, tick } from "../assets";
import { useLazyGetSummaryQuery } from "../services/article";

export default function Demo() {
  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();

  const [article, setArticle] = useState({ url: "", summary: "" });

  const [allArticles, setAllArticles] = useState([]);
  const [copied, setCopied] = useState("");

  useEffect(() => {
    const articles = JSON.parse(localStorage.getItem("articles"));
    if (articles) {
      setAllArticles(articles);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data } = await getSummary({ articleUrl: article.url });
    if (data?.summary) {
      const newArticle = { ...article, summary: data.summary };

      const updateArticles = [...allArticles, newArticle];
      setAllArticles(updateArticles);

      // setAllArticles((prevArticles) => [...prevArticles, newArticle]);

      localStorage.setItem("articles", JSON.stringify(updateArticles));

      setArticle(newArticle);
    }
  };

  const handleCopy = (copyUrl) => {
    setCopied(copyUrl);
    navigator.clipboard.writeText(copyUrl);
    setTimeout(() => setCopied(""), 1000);
  };

  return (
    <section className="mt-16 w-full max-w-xl">
      <div className="flex flex-col w-full gap-2">
        <form
          className="relative flex justify-center items-center"
          onSubmit={handleSubmit}
        >
          <img
            src={linkIcon}
            alt="Link Icon"
            className="absolute left-0 my-2 ml-3 w-5"
          />
          <input
            className="url_input peer"
            type="url"
            placeholder="Enter URL"
            value={article.url}
            onChange={(e) => {
              setArticle((prev) => ({ ...prev, url: e.target.value }));
            }}
            required
          />
          <button
            type="submit"
            className="submit_btn peer-focus:border-gray-700 peer-focus:text-gray-700"
          >
            <div>↵</div>
          </button>
        </form>
        {/* Browsed URL History */}
        <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
          {allArticles?.map((article, i) => (
            <div
              key={`link-${i}`}
              onClick={() => setArticle(article)}
              className="link_card"
            >
              <div className="copy_btn" onClick={() => handleCopy(article.url)}>
                <img
                  src={copied === article.url ? tick : copy}
                  alt="copy_icon"
                  className="w-[40%] h-[40%] object-contain"
                />
              </div>
              <p className="flex-1 font-satoshi text-blue-700 font-medium text-sm truncate">
                {article.url}
              </p>
            </div>
          ))}
        </div>
      </div>
      {/* Display Results */}
      <div className="my-10 flex justify-center items-center">
        {isFetching ? (
          <img src={loader} alt="loader" className="w-20 h-20 object-contain" />
        ) : error ? (
          <p className="font-inter font-bold text-black text-center">
            Couldn&apos;t get the result for the url provided.Check if the url
            is correct or has content that could be summarized
          </p>
        ) : (
          article.summary && (
            <div className="flex flex-col gap-3">
              <h2 className="font-satoshi text-gray-600 font-bold text-xl">
                Article <span className="blue_gradient">Summary</span>
              </h2>
              <div className="summary_box">
                <p className="font-inter font-medium text-sm text-gray-700">
                  {article.summary}
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
}
