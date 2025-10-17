// backend/controllers/projetosController.js
const pool = require('../db');

async function listarProjetos(req, res) {
  try {
    const [projetos] = await pool.query('SELECT * FROM projetos ORDER BY created_at DESC');
    const data = await Promise.all(projetos.map(async p => {
      const [techs] = await pool.query(
        `SELECT t.id, t.nome FROM tecnologias t
         JOIN projeto_tecnologias pt ON pt.tecnologia_id = t.id
         WHERE pt.projeto_id = ?`, [p.id]
      );
      const [imgs] = await pool.query(
        `SELECT i.id, i.caminho, i.alt_text FROM imagens i
         JOIN projeto_imagens pi ON pi.imagem_id = i.id
         WHERE pi.projeto_id = ?`, [p.id]
      );
      return { ...p, tecnologias: techs, imagens: imgs };
    }));
    res.json(data);
  } catch (err) {
    console.error('listarProjetos error:', err);
    res.status(500).json({ error: 'Erro ao buscar projetos' });
  }
}

async function obterProjeto(req, res) {
  const id = Number(req.params.id);
  try {
    const [[projeto]] = await pool.query('SELECT * FROM projetos WHERE id = ?', [id]);
    if (!projeto) return res.status(404).json({ error: 'Projeto não encontrado' });

    const [techs] = await pool.query(
      `SELECT t.id, t.nome FROM tecnologias t
       JOIN projeto_tecnologias pt ON pt.tecnologia_id = t.id
       WHERE pt.projeto_id = ?`, [id]
    );
    const [imgs] = await pool.query(
      `SELECT i.id, i.caminho, i.alt_text FROM imagens i
       JOIN projeto_imagens pi ON pi.imagem_id = i.id
       WHERE pi.projeto_id = ?`, [id]
    );

    res.json({ projeto, tecnologias: techs, imagens: imgs });
  } catch (err) {
    console.error('obterProjeto error:', err);
    res.status(500).json({ error: 'Erro ao buscar projeto' });
  }
}

async function criarProjeto(req, res) {
  const { nome, descricao, link_github, link_expo, link_online, tecnologias = [], imagens = [] } = req.body;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [result] = await conn.query(
      'INSERT INTO projetos (nome, descricao, link_github, link_expo, link_online) VALUES (?, ?, ?, ?, ?)',
      [nome, descricao, link_github || null, link_expo || null, link_online || null]
    );
    const projetoId = result.insertId;

    // tecnologias: inserir se não existir e relacionar
    for (const techName of tecnologias) {
      const [rows] = await conn.query('SELECT id FROM tecnologias WHERE nome = ?', [techName]);
      let techId;
      if (rows.length > 0) techId = rows[0].id;
      else {
        const [r2] = await conn.query('INSERT INTO tecnologias (nome) VALUES (?)', [techName]);
        techId = r2.insertId;
      }
      await conn.query('INSERT IGNORE INTO projeto_tecnologias (projeto_id, tecnologia_id) VALUES (?, ?)', [projetoId, techId]);
    }

    // imagens: inserir e relacionar
    for (const img of imagens) {
      const [rimg] = await conn.query('INSERT INTO imagens (caminho, alt_text) VALUES (?, ?)', [img.caminho, img.alt_text || null]);
      const imgId = rimg.insertId;
      await conn.query('INSERT INTO projeto_imagens (projeto_id, imagem_id) VALUES (?, ?)', [projetoId, imgId]);
    }

    await conn.commit();
    res.status(201).json({ id: projetoId });
  } catch (err) {
    await conn.rollback();
    console.error('criarProjeto error:', err);
    res.status(500).json({ error: 'Erro ao criar projeto' });
  } finally {
    conn.release();
  }
}

async function atualizarProjeto(req, res) {
  const id = Number(req.params.id);
  const { nome, descricao, link_github, link_expo, link_online } = req.body;
  try {
    await pool.query(
      'UPDATE projetos SET nome = ?, descricao = ?, link_github = ?, link_expo = ?, link_online = ? WHERE id = ?',
      [nome, descricao, link_github || null, link_expo || null, link_online || null, id]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error('atualizarProjeto error:', err);
    res.status(500).json({ error: 'Erro ao atualizar' });
  }
}

async function deletarProjeto(req, res) {
  const id = Number(req.params.id);
  try {
    const [result] = await pool.query('DELETE FROM projetos WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Projeto não encontrado' });
    res.json({ ok: true });
  } catch (err) {
    console.error('deletarProjeto error:', err);
    res.status(500).json({ error: 'Erro ao deletar' });
  }
}

module.exports = { listarProjetos, obterProjeto, criarProjeto, atualizarProjeto, deletarProjeto };
