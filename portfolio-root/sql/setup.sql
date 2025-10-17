-- setup.sql COMPLETO para Portfolio - VERSÃO CORRIGIDA
-- Banco: portfolio

-- 1) Criar database
DROP DATABASE `portfolio`;

CREATE DATABASE IF NOT EXISTS `portfolio` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `portfolio`;

-- 2) Tabelas COMPLETAS
DROP TABLE IF EXISTS `admin_info`;
CREATE TABLE `admin_info` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `sobre_mim` TEXT NOT NULL,
  `caminho_curriculo` VARCHAR(255) DEFAULT NULL,
  `caminho_foto_perfil` VARCHAR(255) DEFAULT NULL,
  `link_github` VARCHAR(255) DEFAULT NULL,
  `link_linkedin` VARCHAR(255) DEFAULT NULL,
  `email` VARCHAR(255) DEFAULT NULL,
  `telefone` VARCHAR(20) DEFAULT NULL,
  `cidade` VARCHAR(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `projetos`;
CREATE TABLE `projetos` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(120) NOT NULL,
  `descricao` TEXT NOT NULL,
  `descricao_longa` TEXT,
  `destaque` BOOLEAN DEFAULT FALSE,
  `link_github` VARCHAR(255) DEFAULT NULL,
  `link_expo` VARCHAR(255) DEFAULT NULL,
  `link_online` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `tecnologias`;
CREATE TABLE `tecnologias` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(80) NOT NULL,
  `categoria` ENUM('frontend', 'backend', 'mobile', 'database', 'ferramenta') DEFAULT 'frontend',
  `nivel_experiencia` INT DEFAULT 3,
  `cor` VARCHAR(7) DEFAULT '#3B82F6',
  PRIMARY KEY (`id`),
  UNIQUE KEY `nome_unico` (`nome`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `projeto_tecnologias`;
CREATE TABLE `projeto_tecnologias` (
  `projeto_id` INT NOT NULL,
  `tecnologia_id` INT NOT NULL,
  PRIMARY KEY (`projeto_id`, `tecnologia_id`),
  FOREIGN KEY (`projeto_id`) REFERENCES `projetos` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`tecnologia_id`) REFERENCES `tecnologias` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `imagens`;
CREATE TABLE `imagens` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `caminho` VARCHAR(255) NOT NULL,
  `alt_text` VARCHAR(150) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `projeto_imagens`;
CREATE TABLE `projeto_imagens` (
  `projeto_id` INT NOT NULL,
  `imagem_id` INT NOT NULL,
  PRIMARY KEY (`projeto_id`, `imagem_id`),
  FOREIGN KEY (`projeto_id`) REFERENCES `projetos` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`imagem_id`) REFERENCES `imagens` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- NOVA TABELA: disciplinas
DROP TABLE IF EXISTS `disciplinas`;
CREATE TABLE `disciplinas` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(150) NOT NULL,
  `codigo` VARCHAR(20),
  `periodo` INT,
  `carga_horaria` INT,
  `professor` VARCHAR(100),
  `status` ENUM('cursando', 'concluida', 'pendente') DEFAULT 'cursando',
  `nota` DECIMAL(3,1),
  `descricao` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3) Dados iniciais COM SUAS INFORMAÇÕES
INSERT INTO admin_info (sobre_mim, caminho_curriculo, caminho_foto_perfil, link_github, link_linkedin, email, telefone, cidade) 
VALUES 
('Olá, sou o Lucas Inácio de Carvalho — estudante e desenvolvedor apaixonado por tecnologia. Estou constantemente aprendendo e desenvolvendo projetos para expandir minhas habilidades em programação.', 
'/assets/docs/curriculoinacio.pdf', 
'/assets/images/perfil.jpg', 
'https://github.com/Lukitta013', 
'https://www.linkedin.com/in/lucas-in%C3%A1cio-6aa3ba29a/',
'seu.email@exemplo.com', -- ⚠️ ATUALIZE SEU EMAIL
'(11) 99999-9999',       -- ⚠️ ATUALIZE SEU TELEFONE  
'Sua Cidade, Estado');   -- ⚠️ ATUALIZE SUA CIDADE

-- Inserir tecnologias COMPLETAS
INSERT INTO tecnologias (nome, categoria, nivel_experiencia, cor) VALUES
('React', 'frontend', 4, '#61DAFB'),
('Node.js', 'backend', 4, '#339933'),
('MySQL', 'database', 3, '#4479A1'),
('JavaScript', 'frontend', 4, '#F7DF1E'),
('HTML5', 'frontend', 4, '#E34F26'),
('CSS3', 'frontend', 4, '#1572B6'),
('React Native', 'mobile', 3, '#61DAFB'),
('Express.js', 'backend', 3, '#000000'),
('Tailwind CSS', 'frontend', 4, '#06B6D4'),
('Vite', 'ferramenta', 4, '#646CFF');

-- Inserir projetos COMPLETOS (com descricao_longa e destaque)
INSERT INTO projetos (nome, descricao, descricao_longa, destaque, link_github, link_expo, link_online) 
VALUES 
('Portfolio Pessoal', 
'Meu portfolio pessoal desenvolvido com React, Node.js e MySQL para showcase dos meus projetos e habilidades.',
'Um portfolio completo com backend em Node.js, frontend em React e banco de dados MySQL. Desenvolvido para mostrar meus projetos e habilidades de desenvolvimento.',
TRUE, 
'https://github.com/Lukitta013/PortifolioJS', 
NULL, 
'http://localhost:3000'),

('Sistema de Gestão', 
'Sistema completo de gestão desenvolvido com React frontend e Node.js backend.',
'Sistema de gestão empresarial com controle de usuários, relatórios e dashboard administrativo. Desenvolvido com React no frontend e Node.js no backend.',
TRUE,
'https://github.com/Lukitta013/sistema-gestao', 
NULL, 
NULL),

('App Mobile React Native', 
'Aplicativo mobile desenvolvido em React Native para gerenciamento de tarefas.',
'Aplicativo desenvolvido em React Native para gerenciamento de tarefas pessoais. Inclui notificações e interface intuitiva.',
FALSE,
'https://github.com/Lukitta013/app-tasks', 
'https://expo.dev/@lukitta013/tasks-app', 
NULL);

-- Relacionar tecnologias com projetos ATUALIZADO
INSERT INTO projeto_tecnologias (projeto_id, tecnologia_id) 
VALUES 
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 9), (1, 10),
(2, 1), (2, 2), (2, 3), (2, 4), (2, 8),
(3, 1), (3, 4), (3, 7);

-- Inserir disciplinas
INSERT INTO disciplinas (nome, codigo, periodo, carga_horaria, professor, status, nota, descricao) VALUES
('Algoritmos e Estruturas de Dados', 'CC001', 2, 60, 'Dr. Silva', 'concluida', 8.5, 'Estudo de algoritmos fundamentais e estruturas de dados.'),
('Banco de Dados', 'CC002', 3, 80, 'Prof. Santos', 'concluida', 9.0, 'Conceitos de modelagem de dados, SQL e administração de bancos.'),
('Programação Web', 'CC003', 4, 80, 'Dra. Oliveira', 'cursando', NULL, 'Desenvolvimento de aplicações web com frameworks modernos.');

-- Inserir imagens
INSERT INTO imagens (caminho, alt_text) VALUES 
('/assets/images/projetos/portfolio-1.png', 'Tela inicial do portfolio'),
('/assets/images/projetos/portfolio-2.png', 'Seção de projetos do portfolio'),
('/assets/images/projetos/sistema-1.png', 'Dashboard do sistema de gestão'),
('/assets/images/projetos/app-1.png', 'Tela inicial do app mobile'),
('/assets/images/projetos/app-2.png', 'Lista de tarefas do app');

INSERT INTO projeto_imagens (projeto_id, imagem_id) VALUES 
(1, 1), (1, 2),
(2, 3),
(3, 4), (3, 5);

UPDATE admin_info SET caminho_foto_perfil = 'https://github.com/Lukitta013.png' WHERE id = 1;

-- Mensagem de confirmação
SELECT 'Banco de dados portfolio configurado com sucesso!' as Status;