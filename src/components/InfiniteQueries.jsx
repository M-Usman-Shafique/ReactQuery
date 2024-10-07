import { useInfiniteQuery } from '@tanstack/react-query'
import axios from 'axios'
import React, { useEffect } from 'react'
import { useInView } from "react-intersection-observer";

const fetchFruits = async ({ pageParam }) => {
    const response = await axios.get(`http://localhost:4000/fruits/?_per_page=6&_page=${pageParam}`);
    return response.data;
}

const InfiniteQueries = () => {

    const { data: fruits, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ["fruits"],
        queryFn: fetchFruits,
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            // Using the 'next' field from the API response to determine the next page
            return lastPage.next ? lastPage.next : undefined;
          },
    })

    const { ref, inView } = useInView();

    useEffect(() => {
        if (inView) {
            fetchNextPage();
        }
    }, [fetchNextPage, inView])

    if (isLoading) {
        return <h2>Page is Loading...</h2>
    }

    if (isError) {
        return <h1>{error.message}</h1>
    }

    return (
        <div className='container'>
            {fruits?.pages?.map(page => {
                return page?.data.map(fruit => {
                    return <div className='fruit-item' key={fruit.id}>
                        {fruit.name}
                    </div>
                })
            })}
            {/* <button disabled={!hasNextPage} onClick={fetchNextPage}>Load more</button> */}
            <div ref={ref}>{isFetchingNextPage && "Loading..."}</div>
        </div>
    )
}

export default InfiniteQueries