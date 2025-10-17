// frontend/src/pages/projetos.jsx
import React, { useEffect, useState } from 'react';
import api from '../api';
import ProjectCard from '../components/projectcard';
import { Link } from 'react-router-dom';

export default function Projetos() {
  const [projetos, setProjetos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let mounted = true;
    api.get('/api/projetos')
      .then(res => { if (mounted) setProjetos(res.data); })
      .catch(error => { console.error(error); setErr('Erro ao carregar projetos'); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  if (loading) return <div className="p-8 text-center">Carregando projetos...</div>;
  if (err) return <div className="p-8 text-center text-red-500">{err}</div>;

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Projetos</h1>
        <Link to="/dashboard" className="px-3 py-1 bg-indigo-600 text-white rounded">Admin</Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projetos.map(proj => (
          <Link to={`/projetos/${proj.id}`} key={proj.id}>
            <ProjectCard projeto={proj} />
          </Link>
        ))}
      </div>
    </div>
  );
}
