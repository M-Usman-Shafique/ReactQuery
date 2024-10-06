import axios from "axios";
import React from "react";
import { useQuery } from "react-query";
import { Link, useNavigate, useParams } from "react-router-dom";

const fetchPosts = async (id) => {
  try {
    const { data } = await axios.get(
      `https://gorest.co.in/public/v1/posts/?page=${id}`
    );
    return data;
  } catch (error) {
    throw Error("Unable to fetch posts");
  }
};

function Home() {
  const { id } = useParams();
  const navigate = useNavigate();
  const pageId = parseInt(id);

  const { data, isLoading } = useQuery(
    ["posts", pageId],
    () => fetchPosts(pageId),
    {
      keepPreviousData: true,
      onError: (error) => {
        console.log(error.message);
      },
    }
  );

  const handlePrevClick = () => {
    if (data.meta.pagination.links.previous) {
      navigate(`/${pageId - 1}`);
    }
  };

  const handleNextClick = () => {
    if (data.meta.pagination.links.next) {
      navigate(`/${pageId + 1}`);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={handlePrevClick}
          disabled={!data?.meta.pagination.links.previous}
          className={`px-4 py-2 rounded-lg ${
            data?.meta.pagination.links.previous
              ? "bg-gray-800 hover:bg-gray-700"
              : "bg-gray-600 cursor-not-allowed"
          }`}
        >
          Prev
        </button>
        <h3 className="text-xl">Page: {pageId}</h3>
        <button
          onClick={handleNextClick}
          disabled={!data?.meta.pagination.links.next}
          className={`px-4 py-2 rounded-lg ${
            data?.meta.pagination.links.next
              ? "bg-gray-800 hover:bg-gray-700"
              : "bg-gray-600 cursor-not-allowed"
          }`}
        >
          Next
        </button>
      </div>

      {isLoading ? (
        <div className="text-center text-lg">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.data.map((post) => (
            <Link
              to={`/post/${post.id}`}
              key={post.id}
              className="block bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition"
            >
              <h1 className="text-2xl font-semibold mb-2">{post.title}</h1>
              <p className="text-gray-400">{post.body}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
