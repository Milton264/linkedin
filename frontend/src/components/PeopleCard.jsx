import React from "react";
import { motion } from "framer-motion";

const DEFAULT_AVATAR = "https://ui-avatars.com/api/?name=Sin+Foto&background=random";

const suggestions = [
  { name: "Ana Gómez" },
  { name: "Luis Pérez" },
  { name: "María Sánchez" },
];

const PeopleCard = ({ dark }) => {
  return (
    <motion.div
      className={`p-4 rounded-2xl shadow-md ${dark ? "bg-[#231a37]" : "bg-white"}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3 className={`font-bold mb-3 ${dark ? "text-white" : "text-violet-700"}`}>Personas que quizá conozcas</h3>
      <div className="flex flex-col gap-3">
        {suggestions.map((p, i) => (
          <div key={i} className="flex items-center gap-2">
            <img src={p.avatar || DEFAULT_AVATAR} className="w-8 h-8 rounded-full" alt="avatar" />
            <span className={`text-sm font-semibold ${dark ? "text-violet-100" : "text-violet-700"}`}>{p.name}</span>
            <button className="ml-auto text-xs bg-violet-500 hover:bg-violet-700 text-white rounded-full px-2 py-1">Conectar</button>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default PeopleCard;
