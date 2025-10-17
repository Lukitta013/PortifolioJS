// backend/server.js
require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.SERVER_PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Conexão MySQL
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

connection.connect((err) => {
  if (err) {
    console.error('❌ ERRO MySQL:', err);
    return;
  }
  console.log('✅ MySQL conectado!');
});

// 🔥 ROTAS DO PORTFÓLIO

// 1. Rota de teste
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend funcionando!', timestamp: new Date() });
});

// 2. Buscar informações do admin
app.get('/api/admin', (req, res) => {
  const query = 'SELECT * FROM admin_info LIMIT 1';
  
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Erro ao buscar admin:', error);
      return res.status(500).json({ error: 'Erro no servidor' });
    }
    res.json(results[0] || {});
  });
});

// 3. Buscar todos os projetos
app.get('/api/projetos', (req, res) => {
  const { destaque } = req.query;
  let query = `
    SELECT p.*, GROUP_CONCAT(t.nome) as tecnologias
    FROM projetos p
    LEFT JOIN projeto_tecnologias pt ON p.id = pt.projeto_id
    LEFT JOIN tecnologias t ON pt.tecnologia_id = t.id
  `;
  
  if (destaque === 'true') {
    query += ' WHERE p.destaque = TRUE';
  }
  
  query += ' GROUP BY p.id ORDER BY p.created_at DESC';
  
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Erro ao buscar projetos:', error);
      return res.status(500).json({ error: 'Erro no servidor' });
    }
    console.log(`📦 Enviando ${results.length} projetos para o frontend`);
    res.json(results);
  });
});

// 4. Buscar um projeto específico
app.get('/api/projetos/:id', (req, res) => {
  const projectId = req.params.id;
  
  const query = `
    SELECT p.*, GROUP_CONCAT(t.nome) as tecnologias,
           GROUP_CONCAT(CONCAT(i.caminho, '|||', i.alt_text)) as imagens
    FROM projetos p
    LEFT JOIN projeto_tecnologias pt ON p.id = pt.projeto_id
    LEFT JOIN tecnologias t ON pt.tecnologia_id = t.id
    LEFT JOIN projeto_imagens pi ON p.id = pi.projeto_id
    LEFT JOIN imagens i ON pi.imagem_id = i.id
    WHERE p.id = ?
    GROUP BY p.id
  `;
  
  connection.query(query, [projectId], (error, results) => {
    if (error) {
      console.error('Erro ao buscar projeto:', error);
      return res.status(500).json({ error: 'Erro no servidor' });
    }
    
    if (results.length > 0 && results[0].imagens) {
      // Processar imagens
      results[0].imagens = results[0].imagens.split(',').map(img => {
        const [caminho, alt_text] = img.split('|||');
        return { caminho, alt_text };
      });
    }
    
    res.json(results[0] || null);
  });
});

// 5. Buscar tecnologias
app.get('/api/tecnologias', (req, res) => {
  const { categoria } = req.query;
  let query = 'SELECT * FROM tecnologias';
  
  if (categoria) {
    query += ' WHERE categoria = ?';
  }
  
  query += ' ORDER BY nome';
  
  connection.query(query, categoria ? [categoria] : [], (error, results) => {
    if (error) {
      console.error('Erro ao buscar tecnologias:', error);
      return res.status(500).json({ error: 'Erro no servidor' });
    }
    res.json(results);
  });
});

// 6. Buscar estatísticas das tecnologias
app.get('/api/tecnologias/stats', (req, res) => {
  const query = `
    SELECT 
      categoria,
      COUNT(*) as total,
      AVG(nivel_experiencia) as media_experiencia
    FROM tecnologias 
    GROUP BY categoria
    ORDER BY total DESC
  `;
  
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Erro ao buscar stats:', error);
      return res.status(500).json({ error: 'Erro no servidor' });
    }
    res.json(results);
  });
});

// 7. Buscar disciplinas
app.get('/api/disciplinas', (req, res) => {
  const { status } = req.query;
  let query = 'SELECT * FROM disciplinas';
  
  if (status) {
    query += ' WHERE status = ?';
  }
  
  query += ' ORDER BY periodo, nome';
  
  connection.query(query, status ? [status] : [], (error, results) => {
    if (error) {
      console.error('Erro ao buscar disciplinas:', error);
      return res.status(500).json({ error: 'Erro no servidor' });
    }
    res.json(results);
  });
});

// 8. Buscar estatísticas das disciplinas
app.get('/api/disciplinas/stats', (req, res) => {
  const query = `
    SELECT 
      status,
      COUNT(*) as total,
      AVG(nota) as media_notas,
      SUM(carga_horaria) as total_horas
    FROM disciplinas 
    WHERE status = 'concluida'
    GROUP BY status
  `;
  
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Erro ao buscar stats disciplinas:', error);
      return res.status(500).json({ error: 'Erro no servidor' });
    }
    res.json(results[0] || {});
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend rodando: http://localhost:${PORT}`);
  console.log(`📊 Database: ${process.env.DB_NAME}`);
  console.log(`🔗 Rotas disponíveis:`);
  console.log(`   GET /api/test`);
  console.log(`   GET /api/admin`);
  console.log(`   GET /api/projetos`);
  console.log(`   GET /api/projetos/:id`);
  console.log(`   GET /api/tecnologias`);
  console.log(`   GET /api/tecnologias/stats`);
  console.log(`   GET /api/disciplinas`);
  console.log(`   GET /api/disciplinas/stats`);
});