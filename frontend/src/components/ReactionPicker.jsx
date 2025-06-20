import React from "react";
import { motion } from "framer-motion";

const REACTIONS = [
  { icon: "👍", label: "Like", type: "like" },
  { icon: "❤️", label: "Love", type: "love" },
  { icon: "😂", label: "Haha", type: "haha" },
  { icon: "😮", label: "Wow", type: "wow" },
  { icon: "😢", label: "Sad", type: "sad" },
  { icon: "😡", label: "Angry", type: "angry" },
];

const ReactionPicker = ({ onSelect }) => (
  <motion.div
    className="absolute left-0 top-9 bg-white rounded-2xl shadow-xl flex gap-2 px-3 py-2 border border-violet-100 z-20"
    initial={{ opacity: 0, y: -8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
  >
    {REACTIONS.map((r) => (
      <button
        key={r.type}
        className="text-2xl hover:scale-125 transition"
        onClick={() => onSelect(r.type)}
      >
        {r.icon}
      </button>
    ))}
  </motion.div>
);

export default ReactionPicker;
