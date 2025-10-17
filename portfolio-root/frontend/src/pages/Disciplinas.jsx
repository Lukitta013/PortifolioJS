import { useEffect, useState } from 'react';
import api from '../api';

function Disciplinas() {
  const [disciplinas, setDisciplinas] = useState([]);
  const [stats, setStats] = useState({});
  const [filtro, setFiltro] = useState('todos');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [discRes, statsRes] = await Promise.all([
          api.get('/api/disciplinas'),
          api.get('/api/disciplinas/stats')
        ]);
        setDisciplinas(discRes.data);
        setStats(statsRes.data);
      } catch (error) {
        console.error('Erro ao carregar disciplinas:', error);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, []);

  const disciplinasFiltradas = filtro === 'todos' 
    ? disciplinas 
    : disciplinas.filter(disc => disc.status === filtro);

  const getStatusColor = (status) => {
    switch (status) {
      case 'concluida': return 'bg-green-100 text-green-800';
      case 'cursando': return 'bg-blue-100 text-blue-800';
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'concluida': return 'Concluída';
      case 'cursando': return 'Cursando';
      case 'pendente': return 'Pendente';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Disciplinas Acadêmicas</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Um panorama das disciplinas que estou cursando na faculdade de Ciência da Computação.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">{stats.total || 0}</div>
          <div className="text-gray-600">Disciplinas Concluídas</div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {stats.media_notas ? stats.media_notas.toFixed(1) : '0.0'}
          </div>
          <div className="text-gray-600">Média Geral</div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">{stats.total_horas || 0}</div>
          <div className="text-gray-600">Horas Cursadas</div>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 rounded-lg p-1 flex space-x-1">
          {['todos', 'concluida', 'cursando', 'pendente'].map(status => (
            <button
              key={status}
              onClick={() => setFiltro(status)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                filtro === status
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              {status === 'todos' ? 'Todos' : getStatusText(status)}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Disciplinas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {disciplinasFiltradas.map(disciplina => (
          <div
            key={disciplina.id}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-200"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{disciplina.nome}</h3>
                <p className="text-gray-600 text-sm">
                  {disciplina.codigo} • {disciplina.carga_horaria}h • {disciplina.periodo}º Período
                </p>
              </div>
              <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getStatusColor(disciplina.status)}`}>
                {getStatusText(disciplina.status)}
              </span>
            </div>

            <p className="text-gray-700 mb-4">{disciplina.descricao}</p>

            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                <strong>Professor:</strong> {disciplina.professor}
              </div>
              {disciplina.nota && (
                <div className="text-lg font-bold text-blue-600">
                  Nota: {disciplina.nota}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {disciplinasFiltradas.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Nenhuma disciplina encontrada.</p>
        </div>
      )}
    </div>
  );
}

export default Disciplinas;