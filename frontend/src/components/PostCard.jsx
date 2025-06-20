import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactionPicker from "./ReactionPicker";
import CommentsModal from "./CommentsModal";

const DEFAULT_AVATAR = "https://ui-avatars.com/api/?name=Sin+Foto&background=random";

const PostCard = ({ item, usuario, dark, onEdit, onDelete, onLike, onFav, fetchComments, postComment, fetchLikes }) => {
  const [showProfile, setShowProfile] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [likes, setLikes] = useState(item.likes || 0);
  const [liked, setLiked] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [loadingLikes, setLoadingLikes] = useState(false);

  const loadLikes = async () => {
    setLoadingLikes(true);
    try {
      const l = await fetchLikes(item.id);
      setLikes(l.length);
      setLiked(l.find((li) => li.username === usuario.username));
    } catch {}
    setLoadingLikes(false);
  };

  const handleLike = async (type) => {
    setLiked(true);
    setShowReactions(false);
    await onLike(item.id, type);
    loadLikes();
  };

  const handleFav = async () => {
    await onFav(item.id);
    setIsFav(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97, y: 16 }}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.17 }}
      className="bg-white/90 rounded-2xl shadow-md p-4 flex gap-4 items-start mb-5 border border-violet-50 relative hover:shadow-lg transition"
      onMouseLeave={() => setShowProfile(false)}
    >
      <div
        className="relative"
        onMouseEnter={() => setShowProfile(true)}
        onMouseLeave={() => setShowProfile(false)}
      >
        <img
          src={item.avatar ? `http://localhost:8081${item.avatar}` : DEFAULT_AVATAR}
          className="w-10 h-10 rounded-full border-2 border-violet-200 object-cover cursor-pointer"
          alt="avatar-feed"
        />
        {showProfile && (
          <motion.div
            className={`absolute z-30 left-12 top-0 bg-white rounded-2xl shadow-2xl px-5 py-4 w-60 border border-violet-100 ${dark ? "bg-[#231a37] text-white" : ""}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="font-bold text-lg">{item.username}</div>
            <div className="text-xs text-gray-500 mb-1">{item.estado || "Miembro"}</div>
            <div className="text-xs text-gray-500">{item.tiempo}</div>
            <div className="text-xs text-violet-400 mt-2">Publicaciones: {item.publicCount || "?"}</div>
          </motion.div>
        )}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className={`font-bold text-violet-700 text-md ${dark ? "text-violet-300" : ""}`}>{item.username}</span>
          <span className="ml-2 text-xs text-gray-400">{item.tiempo}</span>
          <span className="ml-2 text-xs">{item.estado}</span>
          {item.username === usuario.username && (
            <div className="ml-auto flex gap-2">
              <button className="text-xs text-violet-500 hover:underline" onClick={() => onEdit(item)}>Editar</button>
              <button className="text-xs text-red-400 hover:underline" onClick={() => onDelete(item.id)}>Eliminar</button>
            </div>
          )}
        </div>
        <div className={`text-sm mt-1 mb-2 ${dark ? "text-violet-100" : "text-gray-700"}`}>{item.mensaje}</div>
        {item.imagen && <img src={`http://localhost:8081${item.imagen}`} alt="media" className="mt-2 mb-1 max-w-xs rounded-lg shadow-lg" />}
        <div className="flex gap-3 mt-2 text-xs">
          <div className="relative">
            <button
              className={`px-2 py-1 rounded-lg font-semibold hover:bg-violet-200 transition ${liked ? "bg-violet-500 text-white" : "bg-violet-100 text-violet-800"}`}
              onClick={() => setShowReactions((s) => !s)}
              disabled={loadingLikes || liked}
              onMouseEnter={loadLikes}
            >
              {liked ? "Liked" : "Reaccionar"} {likes > 0 && `· ${likes}`}
            </button>
            {showReactions && <ReactionPicker onSelect={handleLike} />}
          </div>
          <button className="px-2 py-1 rounded-lg bg-violet-100 text-violet-800 font-semibold hover:bg-violet-200" onClick={() => setShowComments(true)}>
            Comentar
          </button>
          <button
            className={`px-2 py-1 rounded-lg font-semibold hover:bg-yellow-100 transition ${isFav ? "bg-yellow-400 text-white" : "bg-yellow-100 text-yellow-800"}`}
            onClick={handleFav}
          >
            {isFav ? "Favorito" : "⭐ Fav"}
          </button>
        </div>
      </div>
      {showComments && (
        <CommentsModal
          feedId={item.id}
          onClose={() => setShowComments(false)}
          fetchComments={fetchComments}
          postComment={postComment}
          usuario={usuario}
          dark={dark}
          notify={() => {}}
        />
      )}
    </motion.div>
  );
};

export default PostCard;
