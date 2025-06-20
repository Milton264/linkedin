import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const DEFAULT_AVATAR = "https://ui-avatars.com/api/?name=Sin+Foto&background=random";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    username: "",
    role: "",
    email: "",
    password: "",
    avatar: null,
  });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleFile = (e) => {
    setForm({ ...form, avatar: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr(""); setLoading(true);
    try {
      const data = new FormData();
      data.append("name", form.name);
      data.append("username", form.username);
      data.append("role", form.role);
      data.append("email", form.email);
      data.append("password", form.password);
      if (form.avatar) data.append("avatar", form.avatar);

      await axios.post("http://localhost:8081/api/auth/register", data);
      navigate("/login");
    } catch (e) {
      setErr(e.response?.data?.msg || "Error en registro");
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f3f4fb]">
      <form
        onSubmit={handleSubmit}
        className="bg-white/80 w-[370px] p-8 rounded-2xl shadow-lg flex flex-col items-center gap-4"
        encType="multipart/form-data"
      >
        <img
          src={
            form.avatar
              ? URL.createObjectURL(form.avatar)
              : DEFAULT_AVATAR
          }
          className="w-20 h-20 rounded-full border-4 border-violet-300 object-cover"
          alt="avatar"
        />
        <h2 className="text-xl font-bold text-violet-700 mb-1">
          Crea tu cuenta
        </h2>

        <input
          name="name"
          type="text"
          required
          placeholder="Nombre completo"
          value={form.name}
          onChange={handleInput}
          className="w-full rounded-md px-3 py-2 border outline-none focus:ring-2 focus:ring-violet-300 mb-1"
        />
        <input
          name="username"
          type="text"
          required
          placeholder="Usuario único"
          value={form.username}
          onChange={handleInput}
          className="w-full rounded-md px-3 py-2 border outline-none focus:ring-2 focus:ring-violet-300 mb-1"
        />
        <input
          name="role"
          type="text"
          placeholder="Puesto / Rol (opcional)"
          value={form.role}
          onChange={handleInput}
          className="w-full rounded-md px-3 py-2 border outline-none focus:ring-2 focus:ring-violet-300 mb-1"
        />
        <label className="w-full mb-1 text-sm text-gray-500">
          Foto de perfil:
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="block mt-1 w-full text-sm"
          />
        </label>
        <input
          name="email"
          type="email"
          required
          placeholder="Correo electrónico"
          value={form.email}
          onChange={handleInput}
          className="w-full rounded-md px-3 py-2 border outline-none focus:ring-2 focus:ring-violet-300 mb-1"
        />
        <div className="relative w-full">
          <input
            name="password"
            type={show ? "text" : "password"}
            required
            placeholder="Contraseña"
            value={form.password}
            onChange={handleInput}
            className="w-full rounded-md px-3 py-2 border outline-none focus:ring-2 focus:ring-violet-300"
          />
          <button
            type="button"
            className="absolute right-2 top-2 text-gray-500"
            onClick={() => setShow(!show)}
            tabIndex={-1}
          >
            {show ? "🙈" : "👁️"}
          </button>
        </div>

        <button
          type="submit"
          className="w-full mt-2 py-2 rounded-md bg-violet-500 hover:bg-violet-600 text-white font-semibold transition disabled:bg-violet-200"
          disabled={loading}
        >
          {loading ? "Registrando..." : "Registrarme"}
        </button>
        {err && <div className="text-red-500 text-sm">{err}</div>}

        <div className="mt-2 text-center">
          <Link
            to="/login"
            className="text-violet-600 hover:underline text-sm"
          >
            ¿Ya tienes cuenta? Inicia sesión
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
