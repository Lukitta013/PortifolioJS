import { useEffect, useState } from 'react';
import api from '../api';

function TechDashboard() {
  const [tecnologias, setTecnologias] = useState([]);
  const [stats, setStats] = useState([]);
  const [categoriaAtiva, setCategoriaAtiva] = useState('todos');

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [techRes, statsRes] = await Promise.all([
          api.get('/api/tecnologias'),
          api.get('/api/tecnologias/stats')
        ]);
        setTecnologias(techRes.data);
        setStats(statsRes.data);
      } catch (error) {
        console.error('Erro ao carregar tecnologias:', error);
      }
    };

    carregarDados();
  }, []);

  const categorias = ['todos', 'frontend', 'backend', 'database', 'mobile', 'ferramenta'];
  
  const tecnologiasFiltradas = categoriaAtiva === 'todos' 
    ? tecnologias 
    : tecnologias.filter(tech => tech.categoria === categoriaAtiva);

  const getNivelTexto = (nivel) => {
    const niveis = ['Iniciante', 'Básico', 'Intermediário', 'Avançado', 'Especialista'];
    return niveis[nivel - 1] || 'Desconhecido';
  };

  const getNivelCor = (nivel) => {
    const cores = [
      'bg-red-100 text-red-800',
      'bg-orange-100 text-orange-800',
      'bg-yellow-100 text-yellow-800',
      'bg-green-100 text-green-800',
      'bg-blue-100 text-blue-800'
    ];
    return cores[nivel - 1] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Tecnologias & Skills</h2>
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {categorias.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoriaAtiva(cat)}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-all duration-200 ${
                categoriaAtiva === cat
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              {cat === 'todos' ? 'Todos' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Stats - CORRIGIDO */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map(stat => (
          <div key={stat.categoria} className="text-center p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
            <div className="text-2xl font-bold text-blue-600">{stat.total}</div>
            <div className="text-sm text-gray-600 capitalize">{stat.categoria}</div>
            <div className="text-xs text-gray-500">
              Nível {Number(stat.media_experiencia || 0).toFixed(1)}
            </div>
          </div>
        ))}
      </div>

      {/* Grid de Tecnologias */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {tecnologiasFiltradas.map(tech => (
          <div
            key={tech.id}
            className="group relative bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 hover:border-blue-200"
          >
            <div className="flex items-center justify-between mb-2">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: tech.cor }}
              >
                {tech.nome.charAt(0)}
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${getNivelCor(tech.nivel_experiencia)}`}>
                {getNivelTexto(tech.nivel_experiencia)}
              </span>
            </div>
            
            <h3 className="font-semibold text-gray-800 mb-1">{tech.nome}</h3>
            <span className="text-xs text-gray-500 capitalize bg-gray-100 px-2 py-1 rounded-full">
              {tech.categoria}
            </span>

            {/* Barra de progresso */}
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all duration-500"
                  style={{ 
                    backgroundColor: tech.cor,
                    width: `${(tech.nivel_experiencia / 5) * 100}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {tecnologiasFiltradas.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Nenhuma tecnologia encontrada para esta categoria.
        </div>
      )}
    </div>
  );
}

export default TechDashboard;