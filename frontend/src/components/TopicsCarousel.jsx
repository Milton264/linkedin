import React from "react";
import { motion } from "framer-motion";

const topics = [
  "#JavaScript",
  "#React",
  "#NodeJS",
  "#CSS",
  "#Tailwind",
  "#UX",
  "#Design",
];

const TopicsCarousel = ({ dark }) => {
  return (
    <div className="overflow-x-auto whitespace-nowrap py-3 px-2">
      <div className="flex gap-3">
        {topics.map((t, i) => (
          <motion.div
            key={i}
            className={`shrink-0 px-4 py-2 rounded-full font-semibold ${
              dark ? "bg-violet-700 text-white" : "bg-violet-100 text-violet-700"
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
