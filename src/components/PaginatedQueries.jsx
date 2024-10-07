import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { useState } from "react";

const fetchFruits = async (pageId) => {
  const response = await  axios.get(`http://localhost:4000/fruits/?_per_page=12&_page=${pageId}`);
  return response.data;
};

const PaginatedQueries = () => {
  const [page, setPage] = useState(1);

  const { data: fruits, isLoading, isError, error } = useQuery({
    queryKey: ["fruits", page],
    queryFn: () => fetchFruits(page),
    placeholderData: keepPreviousData,
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <h1>{error.message}</h1>;
  }

  return (
    <div className="container">
      {fruits?.data.map((item) => (
        <div key={item.id} className="fruit-label">
          {item.name}
        </div>
      ))}
      <button
        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        disabled={!fruits.prev}
      >
        Prev Page
      </button>
      <button
        onClick={() => setPage((prev) => prev + 1)}
        disabled={!fruits.next}
      >
        Next Page
      </button>
    </div>
  );
};

export default PaginatedQueries;
