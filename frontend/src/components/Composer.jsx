import React, { useRef, useState } from "react";
import { motion } from "framer-motion";

const DEFAULT_AVATAR = "https://ui-avatars.com/api/?name=Sin+Foto&background=random";

const Composer = ({ usuario, dark, estado, setEstado, mensaje, setMensaje, publicar, publicando, imagen, setImagen }) => {
  const [previewImg, setPreviewImg] = useState("");
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImagen(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setPreviewImg(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <section className="max-w-xl mx-auto mt-8 mb-3 p-4 bg-white/90 rounded-2xl shadow-md flex items-start gap-3 relative">
      <img
        src={usuario.avatar ? `http://localhost:8081${usuario.avatar}` : DEFAULT_AVATAR}
        className="w-12 h-12 rounded-full border-2 border-violet-200 object-cover"
        alt="avatar"
      />
      <div className="flex-1">
        <div className="flex gap-2 items-center mb-2">
          <select
            className="px-2 py-1 rounded-xl bg-violet-50 text-violet-700 font-semibold text-xs"
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
          >
            <option value="📝">📝 Post</option>
            <option value="🎨">🎨 Diseño</option>
            <option value="❓">❓ Pregunta</option>
            <option value="🔥">🔥 Logro</option>
          </select>
          <span className="ml-auto text-xs text-gray-400">{mensaje.length}/350</span>
        </div>
        <textarea
          ref={inputRef}
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          placeholder="¿Qué quieres compartir hoy?"
          className={`w-full px-4 py-2 rounded-xl border outline-none transition shadow-md ${dark ? "bg-[#24243c] text-white border-violet-700" : "bg-white border-violet-200"} focus:ring-2 focus:ring-violet-300 resize-none`}
          rows={2}
          maxLength={350}
          disabled={publicando}
        />
        {previewImg && (
          <div className="flex items-center mt-2">
            <img src={previewImg} className="max-h-32 rounded-xl border border-violet-200 shadow" alt="preview" />
            <button className="ml-2 text-red-500 font-bold" onClick={() => { setPreviewImg(""); setImagen(null); }}>✕</button>
          </div>
        )}
        <div className="flex items-center gap-2 mt-2">
          <label className="text-xs text-violet-700 cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={publicando}
            />
            📎 Adjuntar imagen
          </label>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="px-4 py-1 bg-violet-500 text-white rounded-xl font-semibold shadow hover:bg-violet-700 transition"
            disabled={publicando}
            onClick={publicar}
          >
            {publicando ? "Publicando..." : "Publicar"}
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default Composer;
