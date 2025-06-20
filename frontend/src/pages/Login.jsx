import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

// URL de avatar default si el usuario no sube foto
const DEFAULT_AVATAR = "https://ui-avatars.com/api/?name=Sin+Foto&background=random";

const Login = () => {
  // Estados de los inputs y el estado general
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  // Función para enviar el formulario
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr('');
    try {
      // Llama al backend
      const res = await axios.post('http://localhost:8081/api/auth/login', { email, password });
      // Guarda token y usuario en localStorage
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      // Redirige a /inicio
      navigate('/inicio');
    } catch (err) {
      setErr(err.response?.data?.msg || 'Error');
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f3f4fb]">
      <form className="bg-white/80 w-[350px] p-8 rounded-2xl shadow-lg flex flex-col items-center gap-4"
        onSubmit={handleLogin}
      >
        <img
          src={DEFAULT_AVATAR}
          className="w-20 h-20 rounded-full border-4 border-violet-300 object-cover"
          alt="avatar"
        />
        <h2 className="text-xl font-bold text-violet-700">Iniciar Sesión</h2>
        <div className="w-full">
          <input
            type="email"
            required
            placeholder="Correo electrónico"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full rounded-md px-3 py-2 border outline-none focus:ring-2 focus:ring-violet-300 mb-2"
          />
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              required
              placeholder="Contraseña"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full rounded-md px-3 py-2 border outline-none focus:ring-2 focus:ring-violet-300"
            />
            <button
              type="button"
              className="absolute right-2 top-2 text-gray-500"
              onClick={() => setShow(!show)}
              tabIndex={-1}
            >
              {show ? '🙈' : '👁️'}
            </button>
          </div>
        </div>
        <button
          type="submit"
          className="w-full mt-4 py-2 rounded-md bg-violet-500 hover:bg-violet-600 text-white font-semibold transition disabled:bg-violet-200"
          disabled={loading}
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
        {err && <div className="text-red-500 text-sm">{err}</div>}
        <div className="mt-2 text-center">
          <Link to="/register" className="text-violet-600 hover:underline text-sm">
            ¿No tienes cuenta? Regístrate aquí
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
