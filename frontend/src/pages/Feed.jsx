import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import Loader from "../components/Loader";
import TopicsCarousel from "../components/TopicsCarousel";
import PeopleCard from "../components/PeopleCard";
import TrendingSideCard from "../components/TrendingSideCard";

const ENDPOINT = "http://localhost:8081/api";
const DEFAULT_AVATAR = "https://ui-avatars.com/api/?name=Sin+Foto&background=random";
const REACTIONS = [
  { icon: "👍", label: "Like" },
  { icon: "❤️", label: "Love" },
  { icon: "😂", label: "Haha" },
  { icon: "😮", label: "Wow" },
  { icon: "😢", label: "Sad" },
  { icon: "😡", label: "Angry" },
];

const getToken = () => localStorage.getItem("token");

// ==== API ====
const fetchUserProfile = async () => {
  const token = getToken();
  if (!token) throw new Error("No token");
  const res = await axios.get(`${ENDPOINT}/auth/me`, {
    headers: { Authorization: "Bearer " + token },
  });
  return res.data;
};
const fetchFeed = async (page = 1, perPage = 10) => {
  const token = getToken();
  const res = await axios.get(`${ENDPOINT}/feed?page=${page}&perPage=${perPage}`, {
    headers: { Authorization: "Bearer " + token },
  });
  return res.data.posts || res.data || []; // <- ADAPTACIÓN
};
const postFeed = async (mensaje, usuario, imagen, estado) => {
  const token = getToken();
  const form = new FormData();
  form.append("username", usuario.username);
  form.append("avatar", usuario.avatar);
  form.append("mensaje", mensaje);
  form.append("estado", estado);
  form.append("tiempo", new Date().toLocaleString("es-SV"));
  if (imagen) form.append("imagen", imagen);
  await axios.post(`${ENDPOINT}/feed`, form, {
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "multipart/form-data",
    },
  });
};
const postComment = async (feedId, comment, user) => {
  const token = getToken();
  await axios.post(
    `${ENDPOINT}/feed/${feedId}/comment`,
    {
      comment,
      username: user.username,
      avatar: user.avatar,
      tiempo: new Date().toLocaleString("es-SV"),
    },
    { headers: { Authorization: "Bearer " + token } }
  );
};
const fetchComments = async (feedId) => {
  const token = getToken();
  const res = await axios.get(`${ENDPOINT}/feed/${feedId}/comments`, {
    headers: { Authorization: "Bearer " + token },
  });
  return res.data;
};
const likePost = async (feedId, type = "like") => {
  const token = getToken();
  await axios.post(
    `${ENDPOINT}/feed/${feedId}/like`,
    { type },
    { headers: { Authorization: "Bearer " + token } }
  );
};
const fetchLikes = async (feedId) => {
  const token = getToken();
  const res = await axios.get(`${ENDPOINT}/feed/${feedId}/likes`, {
    headers: { Authorization: "Bearer " + token },
  });
  return res.data;
};
const favPost = async (feedId) => {
  const token = getToken();
  await axios.post(`${ENDPOINT}/feed/${feedId}/fav`, {}, {
    headers: { Authorization: "Bearer " + token },
  });
};
const fetchFavs = async (feedId) => {
  const token = getToken();
  const res = await axios.get(`${ENDPOINT}/feed/${feedId}/favs`, {
    headers: { Authorization: "Bearer " + token },
  });
  return res.data;
};
const editFeed = async (feedId, mensaje) => {
  const token = getToken();
  await axios.post(`${ENDPOINT}/feed/${feedId}/edit`, { mensaje }, {
    headers: { Authorization: "Bearer " + token },
  });
};
const deleteFeed = async (feedId) => {
  const token = getToken();
  await axios.delete(`${ENDPOINT}/feed/${feedId}`, {
    headers: { Authorization: "Bearer " + token },
  });
};

const Feed = () => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feed, setFeed] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [dark, setDark] = useState(false);

  // Composer
  const [mensaje, setMensaje] = useState("");
  const [estado, setEstado] = useState("📝");
  const [publicando, setPublicando] = useState(false);
  const [imagen, setImagen] = useState(null);
  const [previewImg, setPreviewImg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [notify, setNotify] = useState("");
  const inputRef = useRef(null);

  // Scroll
  const feedRef = useRef(null);

  // --- Modal y paneles ---
  const [openComments, setOpenComments] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editMensaje, setEditMensaje] = useState("");

  // Estados feed para filtros
  const [feedState, setFeedState] = useState("all"); // "all", "fav", "mine"

  useEffect(() => {
    setLoading(true);
    fetchUserProfile()
      .then(setUsuario)
      .catch(() => (window.location.href = "/login"));

    fetchFeed(1)
      .then(data => {
        setFeed(Array.isArray(data) ? data : data.posts || []);
        setHasMore((Array.isArray(data) ? data : data.posts || []).length >= 10);
      })
      .finally(() => setLoading(false));
  }, []);

  // Scroll infinito
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop
        >= document.documentElement.offsetHeight - 350 &&
        hasMore &&
        !isFetchingMore
      ) {
        loadMoreFeed();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });

  const loadMoreFeed = async () => {
    setIsFetchingMore(true);
    const nextPage = page + 1;
    const data = await fetchFeed(nextPage);
    setFeed(prev => [...prev, ...(Array.isArray(data) ? data : data.posts || [])]);
    setPage(nextPage);
    setHasMore((Array.isArray(data) ? data : data.posts || []).length >= 10);
    setIsFetchingMore(false);
  };

  // Notificaciones
  const showNotify = (msg, ok = true) => {
    setNotify({ msg, ok });
    setTimeout(() => setNotify(""), 1800);
  };

  // Publicar mensaje
  const handlePublicar = async () => {
    if (!mensaje.trim()) {
      setErrorMsg("No puedes publicar vacío.");
      inputRef.current.focus();
      return;
    }
    setPublicando(true);
    setErrorMsg("");
    try {
      await postFeed(mensaje, usuario, imagen, estado);
      setMensaje("");
      setImagen(null);
      setPreviewImg("");
      showNotify("¡Publicado!");
      setPage(1);
      const data = await fetchFeed(1);
      setFeed(Array.isArray(data) ? data : data.posts || []);
      setHasMore((Array.isArray(data) ? data : data.posts || []).length >= 10);
    } catch (e) {
      setErrorMsg("Error al publicar.");
      showNotify("Error al publicar.", false);
    } finally {
      setPublicando(false);
    }
  };

  // Edición
  const startEdit = (item) => {
    setEditId(item.id);
    setEditMensaje(item.mensaje);
  };
  const handleEditSave = async () => {
    await editFeed(editId, editMensaje);
    showNotify("¡Editado!");
    setEditId(null);
    setEditMensaje("");
    const data = await fetchFeed(1);
    setFeed(Array.isArray(data) ? data : data.posts || []);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar publicación?")) return;
    await deleteFeed(id);
    showNotify("Eliminado.");
    const data = await fetchFeed(1);
    setFeed(Array.isArray(data) ? data : data.posts || []);
  };

  // Filtrado por estado/fav/mis publicaciones
  const filteredFeed = (feed || []).filter(item => {
    if (feedState === "all") return true;
    if (feedState === "mine") return item.username === usuario.username;
    if (feedState === "fav") return (item.favs || []).includes(usuario.username);
    if (feedState.startsWith("estado:")) return item.estado === feedState.replace("estado:", "");
    return true;
  });

  if (loading || !usuario) return <Loader />;

  // ---- UI ----
  return (
    <div className={dark ? "bg-[#181a24] min-h-screen" : "bg-[#f3f4fb] min-h-screen"}>

      {/* NOTIFICACIÓN */}
      <AnimatePresence>
        {notify && (
          <motion.div
            className={`fixed top-3 left-1/2 z-[80] -translate-x-1/2 px-8 py-3 rounded-2xl shadow-lg text-base font-bold ${
              notify.ok ? "bg-green-500 text-white" : "bg-red-500 text-white"
            }`}
            initial={{ opacity: 0, y: -32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -32 }}
          >
            {notify.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER */}
      <header className={`sticky top-0 z-50 w-full py-5 px-4 flex items-center gap-4 bg-gradient-to-r ${dark ? "from-violet-800 via-violet-700 to-violet-500" : "from-violet-100 via-white to-violet-50"} shadow`}>
        <h1 className={`font-bold text-2xl flex-1 ${dark ? "text-white" : "text-violet-700"}`}>📰 Feed comunidad</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setDark((d) => !d)}
            className={`w-9 h-9 rounded-full flex items-center justify-center ${dark ? "bg-white" : "bg-violet-200"} transition-all shadow hover:scale-110`}
            title="Modo claro/oscuro"
          >
            {dark ? (
              <svg className="w-6 h-6 text-violet-800" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-violet-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2m0 18v2m8.66-13.66l-1.41 1.41M4.93 19.07l-1.41 1.41M21 12h-2M5 12H3m2.93-7.07l1.41 1.41M19.07 19.07l1.41 1.41" />
              </svg>
            )}
          </button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            className={`w-9 h-9 rounded-full flex items-center justify-center ${dark ? "bg-violet-600 text-white" : "bg-violet-200 text-violet-700"} transition-all shadow hover:scale-110`}
            title="Notificaciones"
          >
            🔔
          </motion.button>
          <img
            src={usuario.avatar ? `http://localhost:8081${usuario.avatar}` : DEFAULT_AVATAR}
            className="w-9 h-9 rounded-full border-2 border-white object-cover"
            alt="avatar"
          />
          <button
            className="ml-2 text-red-500 hover:underline font-semibold"
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
          >
            Salir
          </button>
        </div>
      </header>

      {/* TOPICS */}
      <TopicsCarousel dark={dark} />

      <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-6 px-2">
        <div className="flex-1">

      {/* FILTROS */}
      <section className="max-w-2xl mx-auto mt-4 flex gap-2 justify-center items-center">
        <button className={`px-3 py-1 rounded-full ${feedState === "all" ? "bg-violet-600 text-white" : "bg-violet-100 text-violet-700"} font-semibold`} onClick={() => setFeedState("all")}>Todo</button>
        <button className={`px-3 py-1 rounded-full ${feedState === "mine" ? "bg-violet-600 text-white" : "bg-violet-100 text-violet-700"} font-semibold`} onClick={() => setFeedState("mine")}>Mis publicaciones</button>
        <button className={`px-3 py-1 rounded-full ${feedState === "fav" ? "bg-violet-600 text-white" : "bg-violet-100 text-violet-700"} font-semibold`} onClick={() => setFeedState("fav")}>Favoritos</button>
        <select className="ml-2 px-2 py-1 rounded-full border-violet-200" value={feedState.startsWith("estado:") ? feedState : ""} onChange={e => setFeedState(e.target.value)}>
          <option value="">Filtrar por estado</option>
          <option value="estado:📝">📝 Post</option>
          <option value="estado:🎨">🎨 Diseño</option>
          <option value="estado:❓">❓ Pregunta</option>
          <option value="estado:🔥">🔥 Logro</option>
        </select>
      </section>

      {/* COMPOSER */}
      <section className="max-w-xl mx-auto mt-8 mb-3 p-4 bg-white/90 rounded-2xl shadow-md flex items-start gap-3 relative">
        <img
          src={usuario.avatar ? `http://localhost:8081${usuario.avatar}` : DEFAULT_AVATAR}
          className="w-12 h-12 rounded-full border-2 border-violet-200 object-cover"
          alt="avatar"
        />
        <div className="flex-1">
          <div className="flex gap-2 items-center mb-2">
            <select className="px-2 py-1 rounded-xl bg-violet-50 text-violet-700 font-semibold text-xs" value={estado} onChange={e => setEstado(e.target.value)}>
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
            onChange={e => setMensaje(e.target.value)}
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
                onChange={e => {
                  setImagen(e.target.files[0]);
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = e2 => setPreviewImg(e2.target.result);
                    reader.readAsDataURL(file);
                  }
                }}
                disabled={publicando}
              />
              📎 Adjuntar imagen
            </label>
            <button
              className="px-4 py-1 bg-violet-500 text-white rounded-xl font-semibold shadow hover:bg-violet-700 transition"
              disabled={publicando}
              onClick={handlePublicar}
            >
              {publicando ? "Publicando..." : "Publicar"}
            </button>
            {errorMsg && <span className="text-red-500 text-xs">{errorMsg}</span>}
          </div>
        </div>
      </section>

      {/* FEED */}
      <section ref={feedRef} className="max-w-2xl mx-auto">
        <AnimatePresence>
          {filteredFeed.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              className="text-center py-12 text-gray-400 font-semibold"
            >
              No hay publicaciones aún. ¡Sé el primero en compartir algo!
            </motion.div>
          )}
          {filteredFeed.map((item, i) => (
            <FeedItem
              key={item.id || i}
              item={item}
              dark={dark}
              usuario={usuario}
              onComment={() => setOpenComments(item.id)}
              onNotify={showNotify}
              onEdit={() => startEdit(item)}
              onDelete={() => handleDelete(item.id)}
              isEditing={editId === item.id}
              editMensaje={editMensaje}
              setEditMensaje={setEditMensaje}
              handleEditSave={handleEditSave}
              onFav={() => favPost(item.id)}
              onRefresh={async () => {
                const data = await fetchFeed(1);
                setFeed(Array.isArray(data) ? data : data.posts || []);
              }}
            />
          ))}
        </AnimatePresence>
        {isFetchingMore && (
          <div className="flex justify-center py-4">
            <Loader />
          </div>
        )}
        {!hasMore && (
          <div className="text-center text-gray-400 text-xs py-5">No hay más publicaciones.</div>
        )}
      </section>
        </div>
        <aside className="w-full lg:w-64 flex flex-col gap-4 mt-6 lg:mt-0">
          <PeopleCard dark={dark} />
          <TrendingSideCard dark={dark} />
        </aside>
      </div>

      {/* MODAL DE COMENTARIOS */}
      <AnimatePresence>
        {openComments && (
          <CommentModal
            feedId={openComments}
            onClose={() => setOpenComments(null)}
            usuario={usuario}
            dark={dark}
            onNotify={showNotify}
          />
        )}
      </AnimatePresence>

      {/* Barra de navegación inferior */}
      <nav className={`fixed bottom-0 left-0 w-full z-40 shadow-lg ${dark ? "bg-[#23243a] border-t border-violet-900" : "bg-white"}`}>
        <div className="flex items-center justify-between max-w-2xl mx-auto px-2 py-1">
          {[
            { name: "Inicio", icon: "🏠", path: "/inicio" },
            { name: "Feed", icon: "📰", path: "/feed" },
            { name: "Portafolio", icon: "💼", path: "/portafolio" },
            { name: "Mensajes", icon: "💬", path: "/mensajes" },
            { name: "Perfil", icon: "👤", path: "/perfil" },
          ].map(l => (
            <a
              href={l.path}
              className="flex flex-col items-center justify-center flex-1 py-2 hover:bg-violet-50 transition rounded-xl"
              key={l.name}
            >
              <span className="text-xl">{l.icon}</span>
              <span className={`text-xs ${dark ? "text-white" : "text-violet-700"}`}>{l.name}</span>
            </a>
          ))}
        </div>
      </nav>
    </div>
  );
};

function FeedItem({
  item,
  dark,
  usuario,
  onComment,
  onNotify,
  onEdit,
  onDelete,
  isEditing,
  editMensaje,
  setEditMensaje,
  handleEditSave,
  onFav,
  onRefresh,
}) {
  const [likes, setLikes] = useState(item.likes || 0);
  const [liked, setLiked] = useState(false);
  const [favs, setFavs] = useState(item.favs || []);
  const [isFav, setIsFav] = useState(false);
  const [loadingLikes, setLoadingLikes] = useState(false);
  const [reactions, setReactions] = useState({});
  const [showReactions, setShowReactions] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    fetchLikes(item.id).then(l => setLikes(l.count || l.length || 0));
    fetchFavs(item.id).then(f => setFavs(f.list || []));
    // Si el backend te da el estado: setIsFav(favs.includes(usuario.username));
    // Opcional: determina si el usuario ya dio like/fav (requiere backend)
  }, [item.id]);

  const handleLike = async (type = "like") => {
    setLoadingLikes(true);
    try {
      await likePost(item.id, type);
      setLiked(true);
      setShowReactions(false);
      onNotify(`¡${REACTIONS.find(r => r.label.toLowerCase() === type).icon} Reacción enviada!`);
      onRefresh();
    } catch {
      onNotify("Error al reaccionar", false);
    } finally {
      setLoadingLikes(false);
    }
  };

  const handleFav = async () => {
    await onFav();
    setIsFav(true);
    onNotify("Agregado a favoritos!");
    onRefresh();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97, y: 16 }}
      transition={{ duration: 0.17 }}
      className={`bg-white/90 rounded-2xl shadow-md p-4 flex gap-4 items-start mb-5 border border-violet-50 relative hover:shadow-lg transition`}
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
        {/* Mini perfil */}
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
          <span className={`font-bold text-violet-700 text-md ${dark ? "text-violet-300" : ""}`}>
            {item.username}
          </span>
          <span className="ml-2 text-xs text-gray-400">{item.tiempo}</span>
          <span className="ml-2 text-xs">{item.estado}</span>
          {item.username === usuario.username && (
            <div className="ml-auto flex gap-2">
              <button className="text-xs text-violet-500 hover:underline" onClick={onEdit}>Editar</button>
              <button className="text-xs text-red-400 hover:underline" onClick={onDelete}>Eliminar</button>
            </div>
          )}
        </div>
        {/* Editar mensaje */}
        {isEditing ? (
          <div className="flex gap-2 mt-1 mb-2">
            <textarea
              value={editMensaje}
              onChange={e => setEditMensaje(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl border border-violet-200"
              rows={2}
            />
            <button className="px-2 py-1 bg-green-500 text-white rounded-xl" onClick={handleEditSave}>Guardar</button>
            <button className="px-2 py-1 bg-gray-400 text-white rounded-xl" onClick={() => { setEditMensaje(""); }}>Cancelar</button>
          </div>
        ) : (
          <div className={`text-sm mt-1 mb-2 ${dark ? "text-violet-100" : "text-gray-700"}`}>
            {item.mensaje}
          </div>
        )}
        {item.imagen && (
          <img
            src={`http://localhost:8081${item.imagen}`}
            alt="media"
            className="mt-2 mb-1 max-w-xs rounded-lg shadow-lg"
          />
        )}
        <div className="flex gap-3 mt-2 text-xs">
          <div className="relative">
            <button
              className={`px-2 py-1 rounded-lg font-semibold hover:bg-violet-200 transition ${
                liked ? "bg-violet-500 text-white" : "bg-violet-100 text-violet-800"
              }`}
              onClick={() => setShowReactions(s => !s)}
              disabled={loadingLikes || liked}
              onMouseLeave={() => setShowReactions(false)}
            >
              {liked ? "Liked" : "Reaccionar"} {likes > 0 && `· ${likes}`}
            </button>
            {/* Reacciones */}
            {showReactions && (
              <motion.div className="absolute left-0 top-9 bg-white rounded-2xl shadow-xl flex gap-2 px-3 py-2 border border-violet-100"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                {REACTIONS.map(r => (
                  <button key={r.label} onClick={() => handleLike(r.label.toLowerCase())} className="text-2xl hover:scale-125 transition">
                    {r.icon}
                  </button>
                ))}
              </motion.div>
            )}
          </div>
          <button
            className="px-2 py-1 rounded-lg bg-violet-100 text-violet-800 font-semibold hover:bg-violet-200"
            onClick={onComment}
          >
            Comentar
          </button>
          <button
            className={`px-2 py-1 rounded-lg font-semibold hover:bg-yellow-100 transition ${
              isFav ? "bg-yellow-400 text-white" : "bg-yellow-100 text-yellow-800"
            }`}
            onClick={handleFav}
          >
            {isFav ? "Favorito" : "⭐ Fav"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function CommentModal({ feedId, onClose, usuario, dark, onNotify }) {
  const [comments, setComments] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [comment, setComment] = useState("");
  const [publicando, setPublicando] = useState(false);

  useEffect(() => {
    setCargando(true);
    fetchComments(feedId)
      .then(setComments)
      .finally(() => setCargando(false));
  }, [feedId]);

  const handleComment = async () => {
    if (!comment.trim()) return;
    setPublicando(true);
    try {
      await postComment(feedId, comment, usuario);
      setComment("");
      onNotify("¡Comentario publicado!");
      const c = await fetchComments(feedId);
      setComments(c);
    } catch {
      onNotify("Error al comentar", false);
    } finally {
      setPublicando(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className={`max-w-lg w-full bg-white rounded-3xl shadow-xl p-7 relative ${dark ? "bg-[#1a1430] text-white" : ""}`}
        initial={{ scale: 0.9, y: 80 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 80 }}
      >
        <button
          className="absolute top-3 right-4 text-violet-400 hover:text-violet-800 font-bold text-lg"
          onClick={onClose}
        >✕</button>
        <h3 className="font-bold text-xl mb-3">Comentarios</h3>
        {cargando ? (
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
            onChange={e => setComment(e.target.value)}
            disabled={publicando}
            maxLength={200}
            onKeyDown={e => e.key === "Enter" && handleComment()}
          />
          <button
            className="px-3 py-1 rounded-xl bg-violet-500 text-white font-semibold shadow hover:bg-violet-700"
            disabled={publicando}
            onClick={handleComment}
          >
            {publicando ? "..." : "Enviar"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Feed;