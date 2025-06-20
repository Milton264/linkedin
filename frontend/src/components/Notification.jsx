import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const Notification = ({ notify }) => (
  <AnimatePresence>
    {notify && (
      <motion.div
        className={`fixed top-3 left-1/2 z-[80] -translate-x-1/2 px-8 py-3 rounded-2xl shadow-lg text-base font-bold ${notify.ok ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
        initial={{ opacity: 0, y: -32 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -32 }}
      >
        {notify.msg}
      </motion.div>
    )}
  </AnimatePresence>
);

export default Notification;
