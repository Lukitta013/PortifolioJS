// frontend/src/pages/projectdetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';

export default function ProjectDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/api/projetos/${id}`)
      .then(res => setData(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-8">Carregando...</div>;
  if (!data) return <div className="p-8">Projeto não encontrado</div>;

  const { projeto, tecnologias, imagens } = data;
  return (
    <div className="container mx-auto py-8">
      <Link to="/projetos" className="text-sm text-indigo-600 mb-4 inline-block">← Voltar</Link>
      <h1 className="text-3xl font-bold mb-2">{projeto.nome}</h1>
      <p className="text-gray-700 mb-4">{projeto.descricao}</p>

      <div className="mb-6">
        <h3 className="font-semibold mb-2">Tecnologias</h3>
        <div className="flex gap-2 flex-wrap">
          {tecnologias.map(t => <span key={t.id} className="px-2 py-1 bg-gray-100 rounded text-sm">{t.nome}</span>)}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Imagens</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {imagens.map(img => (
            <img key={img.id} src={img.caminho} alt={img.alt_text || projeto.nome} className="rounded shadow" />
          ))}
        </div>
      </div>
    </div>
  );
}
