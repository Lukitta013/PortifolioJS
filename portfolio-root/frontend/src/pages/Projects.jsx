// components/Projects.jsx
import { useEffect, useState } from 'react';
import api from '../api';

function Projects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    api.get('/api/projetos')
      .then(response => setProjects(response.data))
      .catch(error => console.error('Erro:', error));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Meus Projetos</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map(project => (
          <div key={project.id} className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-2">{project.nome}</h2>
            <p className="text-gray-600 mb-3">{project.descriçao}</p>
            
            <div className="mb-3">
              <span className="text-sm font-medium">Tecnologias:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {project.tecnologias.split(',').map(tech => (
                  <span key={tech} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    {tech.trim()}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              {project.link_github && (
                <a href={project.link_github} target="_blank" rel="noopener noreferrer" 
                   className="bg-gray-800 text-white px-3 py-1 rounded text-sm hover:bg-gray-700">
                  GitHub
                </a>
              )}
              {project.link_online && (
                <a href={project.link_online} target="_blank" rel="noopener noreferrer"
                   className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-500">
                  Ver Online
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Projects;