// src/components/TestApi.jsx
import { useEffect, useState } from 'react';
import api from '../api';

function TestApi() {
  const [projetos, setProjetos] = useState([]);
  const [admin, setAdmin] = useState(null);
  const [tecnologias, setTecnologias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const testAllEndpoints = async () => {
      try {
        setLoading(true);
        
        // Testar todas as rotas
        const [projetosRes, adminRes, techRes] = await Promise.all([
          api.get('/api/projetos'),
          api.get('/api/admin'),
          api.get('/api/tecnologias')
        ]);

        setProjetos(projetosRes.data);
        setAdmin(adminRes.data);
        setTecnologias(techRes.data);
        setError(null);
      } catch (err) {
        console.error('Erro completo:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    testAllEndpoints();
  }, []);

  if (loading) return <div className="p-4">🔍 Testando conexão com backend...</div>;
  if (error) return <div className="p-4 text-red-500">❌ Erro: {error}</div>;

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold">🔧 Debug - Conexão Backend</h2>
      
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-green-100 p-4 rounded">
          <h3 className="font-bold">📁 Projetos</h3>
          <p>Encontrados: {projetos.length}</p>
        </div>
        
        <div className="bg-blue-100 p-4 rounded">
          <h3 className="font-bold">👤 Admin Info</h3>
          <p>{admin ? '✅ Carregado' : '❌ Não encontrado'}</p>
        </div>
        
        <div className="bg-purple-100 p-4 rounded">
          <h3 className="font-bold">⚙️ Tecnologias</h3>
          <p>Encontradas: {tecnologias.length}</p>
        </div>
      </div>

      {/* Mostrar projetos */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Projetos no Banco:</h3>
        {projetos.length === 0 ? (
          <p className="text-yellow-600">⚠️ Nenhum projeto encontrado no banco</p>
        ) : (
          <div className="space-y-2">
            {projetos.map(proj => (
              <div key={proj.id} className="border p-3 rounded">
                <h4 className="font-semibold">{proj.nome}</h4>
                <p className="text-sm text-gray-600">{proj.descricao}</p>
                <p className="text-xs">Tecnologias: {proj.tecnologias || 'Nenhuma'}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TestApi;