import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import ProjectCard from '../components/projectcard';
import TechDashboard from '../components/TechDashBoard';

function Home() {
  const [admin, setAdmin] = useState(null);
  const [projetosDestaque, setProjetosDestaque] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [adminRes, projetosRes] = await Promise.all([
          api.get('/api/admin'),
          api.get('/api/projetos?destaque=true')
        ]);
        setAdmin(adminRes.data);
        setProjetosDestaque(projetosRes.data);
      } catch (error) {
        console.error('Erro ao carregar dados da home:', error);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <section className="text-center mb-20">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Olá, eu sou <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Lucas Inácio</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Desenvolvedor Full-Stack apaixonado por criar soluções incríveis e experiências memoráveis.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/projects"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-lg"
          >
            Ver Projetos
          </Link>
          <Link
            to="/about"
            className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium text-lg"
          >
            Sobre Mim
          </Link>
        </div>
      </section>

      {/* Sobre Mim Resumido */}
      <section className="mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Sobre Mim</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              {admin?.sobre_mim || 'Desenvolvedor full-stack com experiência em React, Node.js e MySQL.'}
            </p>
            <div className="mt-6 flex space-x-4">
              <a
                href={admin?.link_github}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium"
              >
                GitHub
              </a>
              <a
                href={admin?.link_linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
              >
                LinkedIn
              </a>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="w-80 h-80 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl overflow-hidden shadow-lg">
              {/* Placeholder para a foto de perfil */}
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                {admin?.caminho_foto_perfil ? (
                  <img 
                    src={admin.caminho_foto_perfil} 
                    alt="Foto de perfil" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  'Foto de Perfil'
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projetos em Destaque */}
      <section className="mb-20">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">Projetos em Destaque</h2>
          <Link
            to="/projects"
            className="text-blue-600 hover:text-blue-700 font-medium text-lg"
          >
            Ver Todos →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projetosDestaque.slice(0, 3).map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
        {projetosDestaque.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nenhum projeto em destaque no momento.</p>
          </div>
        )}
      </section>

      {/* Dashboard de Tecnologias */}
      <section className="mb-20">
        <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Tecnologias & Skills</h2>
        <TechDashboard />
      </section>
    </div>
  );
}

export default Home;