import axios from "axios";
import React from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

const fetchPost = async (id) => {
  try {
    const { data } = await axios.get(
      `https://gorest.co.in/public/v1/posts/${id}`
    );
    return data;
  } catch (error) {
    throw Error("Unable to fetch post");
  }
};

function Post() {
  const { id } = useParams();

  const { data, isLoading } = useQuery(["post", id], () => fetchPost(id), {
    onError: (error) => {
      console.log(error.message);
    },
  });

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {isLoading ? (
        <div className="text-center text-lg">Loading...</div>
      ) : (
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">{data.data.title}</h1>
          <p className="text-gray-400 text-lg">{data.data.body}</p>
        </div>
      )}
    </div>
  );
}

export default Post;
