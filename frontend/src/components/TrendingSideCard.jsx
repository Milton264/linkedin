import React from "react";
import { motion } from "framer-motion";

const trends = ["#AI", "#WebDev", "#Startups", "#OpenSource"];

const TrendingSideCard = ({ dark }) => (
  <motion.div
    className={`p-4 rounded-2xl shadow-md ${dark ? "bg-[#231a37]" : "bg-white"}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <h3 className={`font-bold mb-3 ${dark ? "text-white" : "text-violet-700"}`}>Tendencias</h3>
    <ul className="flex flex-col gap-2">
      {trends.map((t, i) => (
        <li key={i} className={`text-sm ${dark ? "text-violet-100" : "text-violet-700"}`}>{t}</li>
      ))}
    </ul>
  </motion.div>
);

export default TrendingSideCard;
