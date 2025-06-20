import { useEffect } from "react";

const useInfiniteScroll = ({ loadMore, hasMore }) => {
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 350 &&
        hasMore
      ) {
        loadMore();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loadMore]);
};

export default useInfiniteScroll;
