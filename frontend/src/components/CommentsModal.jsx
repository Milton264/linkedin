import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "./Loader";

const DEFAULT_AVATAR = "https://ui-avatars.com/api/?name=Sin+Foto&background=random";

const CommentsModal = ({ feedId, onClose, fetchComments, postComment, usuario, dark, notify }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchComments(feedId)
      .then(setComments)
      .finally(() => setLoading(false));
  }, [feedId, fetchComments]);

  const handleComment = async () => {
    if (!comment.trim()) return;
    setSending(true);
    try {
      await postComment(feedId, comment, usuario);
      notify("¡Comentario publicado!");
      setComment("");
      const c = await fetchComments(feedId);
      setComments(c);
    } catch {
      notify("Error al comentar", false);
    } finally {
      setSending(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className={`max-w-lg w-full rounded-3xl shadow-xl p-7 relative ${dark ? "bg-[#1a1430] text-white" : "bg-white"}`}
          initial={{ scale: 0.9, y: 80 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 80 }}
        >
          <button
            className="absolute top-3 right-4 text-violet-400 hover:text-violet-800 font-bold text-lg"
            onClick={onClose}
          >✕</button>
          <h3 className="font-bold text-xl mb-3">Comentarios</h3>
          {loading ? (
            <Loader />
          ) : (
            <div className="max-h-72 overflow-y-auto flex flex-col gap-3">
              {comments.length === 0 && (
                <div className="text-gray-400 text-sm">Sin comentarios aún.</div>
              )}
              {comments.map((com, i) => (
                <div key={com.id || i} className="flex items-start gap-2">
                  <img
                    src={com.avatar ? `http://localhost:8081${com.avatar}` : DEFAULT_AVATAR}
                    className="w-9 h-9 rounded-full border-2 border-violet-200 object-cover"
                    alt="avatar-com"
                  />
                  <div>
                    <div className="font-bold text-violet-700 text-xs">{com.username}</div>
                    <div className="text-xs">{com.comment}</div>
                    <div className="text-[10px] text-gray-400">{com.tiempo}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-3 flex gap-2">
            <input
              type="text"
              className={`flex-1 px-4 py-2 rounded-xl border ${dark ? "bg-[#251f39] text-white border-violet-800" : "bg-white border-violet-200"} outline-none shadow`}
              placeholder="Escribe un comentario..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={sending}
              maxLength={200}
              onKeyDown={(e) => e.key === "Enter" && handleComment()}
            />
            <button
              className="px-3 py-1 rounded-xl bg-violet-500 text-white font-semibold shadow hover:bg-violet-700"
              disabled={sending}
              onClick={handleComment}
            >
              {sending ? "..." : "Enviar"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CommentsModal;
