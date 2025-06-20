import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../components/Loader"; // loader visual animado
import { motion, AnimatePresence } from "framer-motion";

const ENDPOINT = "http://localhost:8081/api";
const DEFAULT_AVATAR = "https://ui-avatars.com/api/?name=Sin+Foto&background=random";

const getToken = () => localStorage.getItem("token");

const fetchUserProfile = async () => {
  const token = getToken();
  if (!token) throw new Error("No token");
  const res = await axios.get(`${ENDPOINT}/auth/me`, {
    headers: { Authorization: "Bearer " + token },
  });
  return res.data;
};

const fetchData = async (url, token = false) => {
  try {
    const headers = token
      ? { Authorization: "Bearer " + getToken() }
      : undefined;
    const res = await axios.get(`${ENDPOINT}${url}`, { headers });
    return res.data;
  } catch {
    return [];
  }
};

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const Home = () => {
  // Modo dark/light
  const [dark, setDark] = useState(
    () => localStorage.getItem("theme") === "dark"
  );
  useEffect(() => {
    document.body.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  // Estados para datos reales
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState(null);
  const [projects, setProjects] = useState([]);
  const [retos, setRetos] = useState([]);
  const [ranking, setRanking] = useState([]);
  const [mentorias, setMentorias] = useState([]);
  const [feed, setFeed] = useState([]);
  const [actividad, setActividad] = useState([]);
  const [mensajes, setMensajes] = useState([]);
  const [trending, setTrending] = useState([]);
  const [suggested, setSuggested] = useState([]);
  const [progress, setProgress] = useState(0);
  const [xp, setXP] = useState(0);
  const [proyectosReal, setProyectosReal] = useState(0);
  const [retosReal, setRetosReal] = useState(0);
  const [mentoriasReal, setMentoriasReal] = useState(0);

  // Loader inicial
  useEffect(() => {
    let cancel = false;
    setLoading(true);
    (async () => {
      try {
        const user = await fetchUserProfile();
        if (cancel) return;
        setUsuario(user);

        // Paraleliza las cargas de todo
        const [
          projects,
          retos,
          ranking,
          mentorias,
          feed,
          actividad,
          mensajes,
          trendingData,
          suggestedData,
        ] = await Promise.all([
          fetchData("/projects"),
          fetchData("/retos"),
          fetchData("/ranking"),
          fetchData("/mentorias"),
          fetchData("/feed"),
          fetchData("/actividad"),
          fetchData("/messages"),
          fetchData("/trending"),
          fetchData("/suggested"),
        ]);
        if (cancel) return;
        setProjects(projects);
        setRetos(retos);
        setRanking(ranking);
        setMentorias(mentorias);
        setFeed(feed);
        setActividad(actividad);
        setMensajes(mensajes);
        setTrending(trendingData);
        setSuggested(suggestedData);

        // Estadísticas usuario (puedes personalizar)
        setProyectosReal(projects.length);
        setRetosReal(retos.length);
        setMentoriasReal(mentorias.length);
        setXP(user.xp || 0);
        setProgress(Math.min(Math.round(((user.xp || 0) / 1000) * 100), 100));
      } catch (e) {
        setTimeout(() => {
          window.location.href = "/login";
        }, 1000);
      } finally {
        await delay(600); // para loader visual
        setLoading(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, []);

  if (loading || !usuario)
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#181a24]">
        <Loader text="Cargando panel de devs..." />
      </div>
    );

  // Navegación inferior
  const navLinks = [
    { name: "Inicio", icon: "🏠", path: "/inicio" },
    { name: "Feed", icon: "📰", path: "/feed" },
    { name: "Portafolio", icon: "💼", path: "/portafolio" },
    { name: "Mensajes", icon: "💬", path: "/mensajes" },
    { name: "Mentorías", icon: "🎓", path: "/mentorias" },
    { name: "Retos", icon: "🏆", path: "/retos" },
    { name: "Perfil", icon: "👤", path: "/perfil" },
  ];

  // Cards animadas y helpers visuales
  const Section = ({ children, ...props }) => (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
      {...props}
    >
      {children}
    </motion.section>
  );

  // Panel de sugerencias devs
  const devsSugeridos = suggested.slice(0, 4);

  // Ranking con medallas
  const getMedal = (i) =>
    i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "";

  // Progreso semanal fake
  const progresoSemanal = [400, 600, 800, 200, 500, 750, 1000];
  const dias = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

  return (
    <div
      className={
        dark ? "bg-[#181a24] min-h-screen transition-all" : "bg-[#f3f4fb] min-h-screen transition-all"
      }
    >
      {/* ——— HEADER ——— */}
      <header
        className={`w-full py-6 px-4 flex flex-col md:flex-row items-center gap-4 bg-gradient-to-r ${
          dark
            ? "from-violet-800 via-violet-700 to-violet-500"
            : "from-violet-100 via-white to-violet-50"
        } rounded-b-3xl shadow`}
      >
        <div className="flex-1 flex items-center gap-4">
          <img
            src={
              usuario.avatar
                ? `http://localhost:8081${usuario.avatar}`
                : DEFAULT_AVATAR
            }
            alt={usuario.name}
            className="w-16 h-16 rounded-full border-4 border-violet-300 object-cover shadow-lg"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className={`font-bold text-2xl ${dark ? "text-white" : "text-violet-700"}`}>
                Hola, {usuario.name || usuario.username} 👋
              </h1>
              <span className="text-xs px-2 py-1 rounded-xl bg-violet-100 text-violet-800 font-semibold ml-1">
                Nivel {usuario.nivel || 1}
              </span>
            </div>
            <p className={`text-sm mt-1 ${dark ? "text-violet-100" : "text-gray-500"}`}>
              ¡Bienvenido de nuevo!
              <br />
              <span className="text-[13px]">{usuario.role && usuario.role !== "null" ? usuario.role : "Dev"}</span>
            </p>
          </div>
        </div>
        {/* Toggle dark/light */}
        <button
          onClick={() => setDark((d) => !d)}
          className={`ml-auto w-10 h-10 rounded-full flex items-center justify-center ${
            dark ? "bg-white" : "bg-violet-200"
          } transition-all shadow hover:scale-110`}
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
        <button
          className="ml-4 text-red-500 hover:underline font-semibold"
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
        >
          Salir
        </button>
      </header>

      {/* ——— BUSCADOR ——— */}
      <div className="w-full flex justify-center mt-4">
        <input
          type="text"
          placeholder="Buscar personas, usuario, devs..."
          className={`w-[500px] max-w-full px-4 py-2 rounded-2xl border outline-none transition shadow-md ${
            dark ? "bg-[#24243c] text-white border-violet-700" : "bg-white border-violet-200"
          } focus:ring-2 focus:ring-violet-300`}
        />
      </div>

      {/* PERFIL MINI & ACCESOS */}
      <Section className="flex flex-col md:flex-row gap-5 max-w-6xl mx-auto py-8">
        {/* Perfil mini */}
        <div className={`bg-white/90 rounded-2xl shadow-md p-4 flex-1 ${dark ? "bg-[#23243a]" : ""}`}>
          <div className="flex items-center gap-4">
            <img
              src={
                usuario.avatar
                  ? `http://localhost:8081${usuario.avatar}`
                  : DEFAULT_AVATAR
              }
              className="w-12 h-12 rounded-full border-2 border-violet-200"
              alt="avatar-mini"
            />
            <div>
              <div className={`font-bold text-lg ${dark ? "text-white" : "text-violet-700"}`}>
                {usuario.username}
              </div>
              <div className="text-gray-500 text-sm">@{usuario.username}</div>
            </div>
          </div>
        </div>
        {/* Accesos rápidos */}
        <div className={`bg-white/90 rounded-2xl shadow-md p-4 flex-1 ${dark ? "bg-[#23243a]" : ""}`}>
          <div className="font-bold text-violet-700 mb-2">Accesos rápidos</div>
          <div className="grid grid-cols-3 gap-4 mt-2">
            {[
              { icon: "📰", name: "Feed", path: "/feed" },
              { icon: "💼", name: "Portafolio", path: "/portafolio" },
              { icon: "🏆", name: "Retos", path: "/retos" },
              { icon: "🎓", name: "Mentorías", path: "/mentorias" },
              { icon: "📆", name: "Eventos", path: "/eventos" },
              { icon: "👤", name: "Perfil", path: "/perfil" },
            ].map((item) => (
              <a
                href={item.path}
                className="flex flex-col items-center justify-center py-2 hover:scale-105 transition"
                key={item.name}
              >
                <span className="text-2xl mb-1">{item.icon}</span>
                <span className={`text-xs ${dark ? "text-white" : ""}`}>{item.name}</span>
              </a>
            ))}
          </div>
        </div>
      </Section>

      {/* TRENDING TOPICS */}
      <Section className="max-w-6xl mx-auto mt-2 mb-6">
        <div className="flex items-center mb-2">
          <h3 className={`text-lg font-bold ${dark ? "text-white" : "text-violet-700"}`}>Tendencias</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {trending.map((t, i) => (
            <span key={i} className="bg-violet-100 text-violet-800 px-3 py-1 rounded-xl text-sm">
              #{t.tag}
              <span className="ml-1 text-gray-500">{t.count}</span>
            </span>
          ))}
        </div>
      </Section>

      {/* PROGRESO, HISTORIAS, MISIÓN DIARIA */}
      <Section className="max-w-6xl mx-auto mt-2 grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Progreso semanal */}
        <div className={`bg-white/90 rounded-2xl shadow-md p-6 ${dark ? "bg-[#23243a]" : ""}`}>
          <div className="flex justify-between items-center">
            <div className="font-bold text-violet-700 text-lg mb-2">Progreso semanal</div>
            <span className="text-xs text-gray-400">XP</span>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <div className="w-full h-4 bg-violet-100 rounded-xl overflow-hidden">
              <motion.div
                className="h-4 bg-violet-500 rounded-xl transition-all"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1.3, type: "spring" }}
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-sm font-bold text-violet-700">{xp} / 1000</span>
          </div>
          <div className="flex mt-3 gap-4 justify-between">
            <div className="flex flex-col items-center">
              <span className="font-semibold text-lg text-green-500">{retosReal}</span>
              <span className="text-xs text-gray-400">Retos</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-semibold text-lg text-violet-500">{mentoriasReal}</span>
              <span className="text-xs text-gray-400">Mentorías</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-semibold text-lg text-blue-500">{proyectosReal}</span>
              <span className="text-xs text-gray-400">Proyectos</span>
            </div>
          </div>
        </div>
        {/* Historias comunidad */}
        <div className={`bg-white/90 rounded-2xl shadow-md p-6 ${dark ? "bg-[#23243a]" : ""}`}>
          <div className="font-bold text-violet-700 text-lg mb-2">Historias comunidad</div>
          <div className="flex gap-2 overflow-x-auto">
            {ranking.slice(0, 5).map((dev, i) => (
              <div key={i} className="flex flex-col items-center w-20 shrink-0">
                <div className="w-14 h-14 rounded-full border-4 border-violet-300 overflow-hidden shadow-md mb-1">
                  <img
                    src={dev.avatar || DEFAULT_AVATAR}
                    alt="historia"
                    className="object-cover w-full h-full"
                  />
                </div>
                <span className="text-xs truncate w-full text-center text-gray-500">{dev.username}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 text-xs text-gray-400 text-center">
            Comparte tu historia con la comunidad
          </div>
        </div>
        {/* Misión diaria */}
        <div className={`bg-white/90 rounded-2xl shadow-md p-6 flex flex-col justify-between ${dark ? "bg-[#23243a]" : ""}`}>
          <div>
            <div className="font-bold text-violet-700 text-lg mb-2">Misión diaria</div>
            <div className="text-md font-semibold mb-1">👑 Termina 1 reto nuevo</div>
            <div className="text-xs text-gray-400 mb-2">Completa tu misión y gana XP extra hoy</div>
            <button className="mt-2 px-3 py-1 bg-violet-500 hover:bg-violet-700 text-white rounded-xl text-xs shadow transition">
              Ver retos
            </button>
          </div>
          <div className="mt-8 text-xs italic text-violet-500 text-center">
            “El mejor momento para empezar fue ayer. El segundo mejor es hoy.”
          </div>
        </div>
      </Section>

      {/* PROYECTOS POPULARES */}
      <Section className="max-w-6xl mx-auto mt-6 mb-3">
        <div className="flex justify-between items-center mb-2">
          <h3 className={`text-lg font-bold ${dark ? "text-white" : "text-violet-700"}`}>Proyectos populares</h3>
          <a href="/portafolio" className="text-xs text-violet-500 hover:underline">Ver todos</a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {projects.map((p, i) => (
            <motion.div
              key={p.id || i}
              whileHover={{ scale: 1.05 }}
              className="bg-white/90 p-4 rounded-xl shadow-md hover:shadow-lg transition flex flex-col justify-between gap-2 border border-violet-100"
            >
              <div className="flex gap-2 items-center mb-2">
                <img src={p.image || `https://placehold.co/40x40/eee/violet?text=P${i+1}`} className="rounded-lg w-10 h-10" alt="" />
                <div>
                  <div className="font-bold text-violet-700 text-sm">{p.name}</div>
                  <div className="text-xs text-gray-500">{p.technologies}</div>
                </div>
              </div>
              <div className="text-xs text-gray-600 flex-1">{p.description}</div>
              <div className="mt-2 flex gap-2 items-center">
                <span className="bg-violet-200 px-2 py-1 rounded-xl text-xs text-violet-800 font-semibold">+{p.stars || 0} estrellas</span>
                <a href="#" className="text-xs text-violet-500 hover:underline ml-auto">Ver</a>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* LOGROS Y CONEXIONES */}
      <Section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className={`bg-white/90 rounded-2xl shadow-md p-6 flex flex-col ${dark ? "bg-[#23243a]" : ""}`}>
          <div className="font-bold text-violet-700 text-lg mb-2">Logros desbloqueados</div>
          <div className="flex gap-4 flex-wrap">
            {["🚀", "🏅", "🔥", "🦾", "💡"].map((em, i) => (
              <div key={i} className="flex flex-col items-center px-3 py-2">
                <div className="text-3xl">{em}</div>
                <span className="text-xs text-gray-500 mt-1">Logro {i + 1}</span>
              </div>
            ))}
          </div>
          <div className="text-xs mt-4 text-gray-400">Sigue aprendiendo para desbloquear más insignias.</div>
        </div>
        <div className={`bg-white/90 rounded-2xl shadow-md p-6 flex flex-col ${dark ? "bg-[#23243a]" : ""}`}>
          <div className="font-bold text-violet-700 text-lg mb-2">Conecta con devs</div>
          <div className="flex gap-2 flex-wrap">
            {devsSugeridos.map((dev, i) => (
              <div key={i} className="flex items-center gap-2 bg-violet-100 rounded-xl px-3 py-2 shadow-sm hover:shadow-md">
                <img src={dev.avatar || DEFAULT_AVATAR} className="w-8 h-8 rounded-full" alt="" />
                <span className="text-sm text-violet-800 font-semibold">{dev.username}</span>
                <button className="ml-2 px-2 py-1 text-xs bg-violet-500 text-white rounded-md hover:bg-violet-700">
                  Conectar
                </button>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* FEED comunidad */}
      <Section className="max-w-3xl mx-auto mb-8">
        <div className="flex justify-between items-center mb-2">
          <h3 className={`text-lg font-bold ${dark ? "text-white" : "text-violet-700"}`}>Feed comunidad</h3>
          <a href="/feed" className="text-xs text-violet-500 hover:underline">Ver más</a>
        </div>
        <div className="flex flex-col gap-4">
          {feed.map((f, i) => (
            <div key={i} className="bg-white/90 rounded-2xl shadow-md p-4 flex gap-4 items-start border border-violet-50">
              <img src={f.avatar || DEFAULT_AVATAR} className="w-10 h-10 rounded-full" alt="" />
              <div>
                <div className="font-bold text-violet-700">
                  {f.username} <span className="text-xs text-gray-400 ml-2">{f.tiempo}</span>
                </div>
                <div className="text-sm text-gray-700">{f.mensaje}</div>
                <div className="flex gap-3 mt-2 text-xs">
                  <button className="px-2 py-1 rounded-lg bg-violet-100 text-violet-800 font-semibold hover:bg-violet-200">Like</button>
                  <button className="px-2 py-1 rounded-lg bg-violet-100 text-violet-800 font-semibold hover:bg-violet-200">Comentar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Mentorías y Ranking */}
      <Section className="max-w-6xl mx-auto mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mentorías activas */}
        <div className={`bg-white/90 rounded-2xl shadow-md p-6 ${dark ? "bg-[#23243a]" : ""}`}>
          <div className="font-bold text-violet-700 text-lg mb-3">Mentorías activas</div>
          <div className="flex flex-col gap-4">
            {mentorias.map((m, i) => (
              <div key={i} className="flex gap-3 items-center bg-violet-100/60 rounded-xl p-3 shadow hover:scale-[1.02] transition">
                <img src={m.avatar || DEFAULT_AVATAR} className="w-12 h-12 rounded-full border-2 border-violet-300" alt="" />
                <div>
                  <div className="font-bold text-violet-800 text-sm">{m.titulo}</div>
                  <div className="text-xs text-gray-600">Por <span className="font-semibold">{m.mentor}</span></div>
                  <div className="mt-1 text-[11px] text-gray-500">{m.horario}</div>
                </div>
                <button className="ml-auto px-2 py-1 bg-violet-500 text-white rounded-md text-xs hover:bg-violet-700">
                  Unirse
                </button>
              </div>
            ))}
          </div>
          <a href="/mentorias" className="block text-xs text-violet-500 hover:underline mt-4">
            Ver todas las mentorías
          </a>
        </div>
        {/* Ranking */}
        <div className={`bg-white/90 rounded-2xl shadow-md p-6 ${dark ? "bg-[#23243a]" : ""}`}>
          <div className="flex justify-between items-center">
            <div className="font-bold text-violet-700 text-lg">Ranking top devs</div>
            <a href="/ranking" className="text-xs text-violet-500 hover:underline">Ver más</a>
          </div>
          <div className="mt-3 flex flex-col gap-2">
            {ranking.slice(0, 5).map((dev, i) => (
              <div key={i} className="flex items-center gap-3 bg-violet-50 rounded-xl px-3 py-2">
                <div className="font-bold text-violet-700 text-lg">{getMedal(i) || i + 1}</div>
                <img src={dev.avatar || DEFAULT_AVATAR} className="w-9 h-9 rounded-full border-2 border-violet-200" alt="" />
                <span className="font-semibold text-violet-700">{dev.username}</span>
                <span className="ml-auto text-sm font-bold text-green-500">+{dev.xp} XP</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* RETOS RECOMENDADOS */}
      <Section className="max-w-6xl mx-auto mb-8">
        <div className="flex justify-between items-center mb-2">
          <h3 className={`text-lg font-bold ${dark ? "text-white" : "text-violet-700"}`}>Retos recomendados</h3>
          <a href="/retos" className="text-xs text-violet-500 hover:underline">Ver todos</a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {retos.map((r, i) => (
            <motion.div
              key={r.id || i}
              whileHover={{ scale: 1.04 }}
              className="bg-white/90 p-5 rounded-xl shadow-md hover:shadow-lg border border-violet-100 flex flex-col"
            >
              <div className="font-bold text-violet-700 text-base mb-1">{r.title}</div>
              <div className="text-xs text-gray-600 mb-3">{r.description}</div>
              <div className="flex items-center gap-2 mt-auto">
                <span className="bg-violet-100 px-2 py-1 rounded-xl text-xs text-violet-800 font-semibold">{r.dificultad}</span>
                <span className="text-xs text-green-500 font-bold ml-auto">{r.xp} XP</span>
              </div>
              <button className="mt-3 px-3 py-1 rounded-xl bg-violet-500 hover:bg-violet-700 text-white text-xs font-semibold transition shadow">
                Ver reto
              </button>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ACTIVIDAD RECIENTE */}
      <Section className="max-w-4xl mx-auto mb-8">
        <div className="flex justify-between items-center mb-2">
          <h3 className={`text-lg font-bold ${dark ? "text-white" : "text-violet-700"}`}>Actividad reciente</h3>
          <a href="/feed" className="text-xs text-violet-500 hover:underline">Ver todo</a>
        </div>
        <div className="flex flex-col gap-3">
          {actividad.map((a, i) => (
            <div key={i} className="flex items-center gap-3 bg-white/90 rounded-xl px-4 py-2 shadow border border-violet-50">
              <img src={a.avatar || DEFAULT_AVATAR} className="w-8 h-8 rounded-full" alt="" />
              <div>
                <div className="font-semibold text-violet-700 text-sm">{a.username}</div>
                <div className="text-xs text-gray-600">{a.actividad}</div>
              </div>
              <div className="ml-auto text-xs text-gray-400">{a.tiempo}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* MENSAJES RÁPIDOS */}
      <Section className="max-w-6xl mx-auto mb-16">
        <div className="flex justify-between items-center mb-2">
          <h3 className={`text-lg font-bold ${dark ? "text-white" : "text-violet-700"}`}>Mensajes rápidos</h3>
          <a href="/mensajes" className="text-xs text-violet-500 hover:underline">Ver todos</a>
        </div>
        <div className="flex gap-4 overflow-x-auto">
          {mensajes.map((m, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.08 }}
              className="flex flex-col items-center bg-white/90 rounded-2xl px-5 py-3 shadow-md hover:scale-105 transition"
            >
              <img src={m.avatar || DEFAULT_AVATAR} className="w-10 h-10 rounded-full mb-2" alt="" />
              <span className="text-sm font-bold text-violet-700">{m.username}</span>
              <span className={`text-xs mt-1 ${m.online ? "text-green-500" : "text-gray-400"}`}>{m.online ? "En línea" : "Desconectado"}</span>
              <button className="mt-2 px-3 py-1 bg-violet-500 hover:bg-violet-700 text-white rounded-xl text-xs shadow transition">
                Chatear
              </button>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* GRAFICO DE PROGRESO */}
      <Section className="max-w-4xl mx-auto mb-20">
        <div className="bg-white/90 rounded-2xl shadow-md p-6">
          <div className="flex justify-between items-center mb-2">
            <div className="font-bold text-violet-700 text-lg">Gráfica de progreso semanal</div>
            <span className="text-xs text-gray-400">XP / Días</span>
          </div>
          <div className="flex items-end gap-4 h-32 mt-4">
            {progresoSemanal.map((val, i) => (
              <div key={i} className="flex flex-col items-center h-full">
                <div
                  className="w-8 rounded-xl"
                  style={{
                    height: `${val / 10}px`,
                    background: "linear-gradient(180deg, #a78bfa, #6c5ce7 90%)",
                  }}
                ></div>
                <span className="text-xs text-gray-500 mt-2">{dias[i]}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* NAV INFERIOR */}
      <nav className={`fixed bottom-0 left-0 w-full z-40 shadow-lg ${dark ? "bg-[#23243a] border-t border-violet-900" : "bg-white"}`}>
        <div className="flex items-center justify-between max-w-4xl mx-auto px-2 py-1">
          {navLinks.map((l) => (
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

export default Home;
