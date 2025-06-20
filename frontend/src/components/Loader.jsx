// src/components/Loader.jsx
import React from "react";

const Loader = () => (
  <div className="fixed inset-0 bg-[#f3f4fb] flex items-center justify-center z-50">
    <div className="w-16 h-16 border-[6px] border-violet-300 border-t-violet-600 rounded-full animate-spin"></div>
  </div>
);

export default Loader;
