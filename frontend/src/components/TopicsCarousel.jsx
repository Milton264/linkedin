import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const ENDPOINT = "http://localhost:8081/api";

const TopicsCarousel = ({ dark }) => {
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    axios.get(`${ENDPOINT}/trends`).then((res) => setTopics(res.data));
  }, []);

  return (
    <div className="overflow-x-auto whitespace-nowrap py-3 px-2">
      <div className="flex gap-3">
        {topics.map((t, i) => (
          <motion.div
            key={i}
            className={`shrink-0 px-4 py-2 rounded-full font-semibold ${
              dark
                ? "bg-gradient-to-r from-violet-700 to-fuchsia-700 text-white"
                : "bg-gradient-to-r from-violet-100 to-fuchsia-100 text-violet-700"
            }`}
            whileHover={{ scale: 1.05 }}
          >
            {t}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TopicsCarousel;
