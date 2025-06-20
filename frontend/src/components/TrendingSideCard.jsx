import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const ENDPOINT = "http://localhost:8081/api";
const TrendingSideCard = ({ dark }) => {
  const [trends, setTrends] = useState([]);

  const formatNumber = (n) =>
    n.toLocaleString('es-ES', { minimumFractionDigits: 0 });

  useEffect(() => {
    axios.get(`${ENDPOINT}/trends`).then((res) => setTrends(res.data));
  }, []);

  return (
    <motion.div
      className={`p-4 rounded-2xl shadow-md ${dark ? "bg-gradient-to-br from-[#31254b] to-[#1f1933]" : "bg-gradient-to-br from-white to-violet-50"}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3 className={`font-bold mb-3 ${dark ? "text-white" : "text-violet-700"}`}>Tendencias</h3>
      <ul className="flex flex-col gap-2">
        {trends.map((t, i) => (
          <li
            key={i}
            className={`text-sm flex justify-between ${dark ? "text-violet-100" : "text-violet-700"}`}
          >
            <span>{t.name}</span>
            <span className="opacity-70 text-xs">{formatNumber(t.count)}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

export default TrendingSideCard;
