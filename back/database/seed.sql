-- Dados de exemplo para popular o banco de dados (Estrutura Multi-Tenant)
-- Execute após criar o schema principal

-- IMPORTANTE: Execute primeiro o schema.sql que já contém proprietários e usuários de exemplo
-- Este arquivo adiciona mais dados para testes mais completos

-- Inserir mais proprietários de exemplo
INSERT INTO proprietarios (id, nome, email, senha, telefone) VALUES
('550e8400-e29b-41d4-a716-446655440003', 'Roberto Silva', 'roberto@fitnessempresa.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxkUJqyqdG1PyAyinpRqU6Y.lQG', '11988887777'),
('550e8400-e29b-41d4-a716-446655440004', 'Fernanda Costa', 'fernanda@strongbusiness.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxkUJqyqdG1PyAyinpRqU6Y.lQG', '11977776666')
ON CONFLICT (id) DO NOTHING;

-- Inserir mais usuários de exemplo
INSERT INTO usuarios (nome, email, senha, telefone) VALUES
('Ana Clara', 'ana@email.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxkUJqyqdG1PyAyinpRqU6Y.lQG', '11966665555'),
('Bruno Santos', 'bruno@email.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxkUJqyqdG1PyAyinpRqU6Y.lQG', '11955554444'),
('Carla Oliveira', 'carla@email.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxkUJqyqdG1PyAyinpRqU6Y.lQG', '11944443333'),
('João Marcelino', 'joao.marcelino@email.com', '$2b$12$iZ8XvF3J3zX5g5U6V7W8YeA8B9C0D1E2F3G4H5I6J7K8L9M0N1O2P3', '11933332222')
ON CONFLICT (email) DO NOTHING;

-- Inserir academias adicionais de exemplo (com proprietário)
INSERT INTO academias (proprietario_id, nome, descricao, endereco, telefone, whatsapp, email, horario_funcionamento, avaliacao, foto_perfil, foto_banner, latitude, longitude, status, visibilidade) VALUES
(
  '550e8400-e29b-41d4-a716-446655440003',
  'Academia PowerFit',
  'Treinos personalizados e equipamentos modernos.',
  'Rua das Flores, 123 - Centro, São Paulo - SP',
  '(11) 98765-4321',
  '5511987654321',
  'contato@powerfit.com.br',
  '{"segunda": "06:00-23:00", "terca": "06:00-23:00", "quarta": "06:00-23:00", "quinta": "06:00-23:00", "sexta": "06:00-23:00", "sabado": "07:00-20:00", "domingo": "08:00-18:00"}',
  4.2,
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
  -23.550520,
  -46.633308,
  'ativa',
  true
),
(
  '550e8400-e29b-41d4-a716-446655440003',
  'Fitness Center',
  'Ambiente aconchegante e profissionais qualificados.',
  'Av. Paulista, 456 - Bela Vista, São Paulo - SP',
  '(11) 91234-5678',
  '5511912345678',
  'info@fitnesscenter.com.br',
  '{"segunda": "06:00-22:00", "terca": "06:00-22:00", "quarta": "06:00-22:00", "quinta": "06:00-22:00", "sexta": "06:00-22:00", "sabado": "06:00-22:00", "domingo": "06:00-22:00"}',
  4.7,
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80',
  -23.561414,
  -46.656219,
  'ativa',
  true
),
(
  '550e8400-e29b-41d4-a716-446655440004',
  'Strong Gym',
  'Academia completa com piscina e aulas de grupo.',
  'Rua da Academia, 789 - Vila Madalena, São Paulo - SP',
  '(11) 95555-1234',
  '5511955551234',
  'contato@stronggym.com.br',
  '{"segunda": "05:30-23:30", "terca": "05:30-23:30", "quarta": "05:30-23:30", "quinta": "05:30-23:30", "sexta": "05:30-23:30", "sabado": "07:00-21:00", "domingo": "07:00-21:00"}',
  4.1,
  'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80',
  -23.544094,
  -46.689371,
  'ativa',
  true
),
(
  '550e8400-e29b-41d4-a716-446655440004',
  'Body Shape',
  'Foco em resultados com personal trainers especializados.',
  'Alameda dos Exercícios, 321 - Jardins, São Paulo - SP',
  '(11) 94444-9876',
  '5511944449876',
  'bodyshape@contato.com.br',
  '{"segunda": "06:00-22:00", "terca": "06:00-22:00", "quarta": "06:00-22:00", "quinta": "06:00-22:00", "sexta": "06:00-22:00", "sabado": "08:00-18:00", "domingo": "fechado"}',
  4.9,
  'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80',
  -23.574729,
  -46.648088,
  'ativa',
  true
)
ON CONFLICT DO NOTHING;

-- Inserir planos para as academias
INSERT INTO planos_academia (academia_id, nome, preco, descricao, duracao_meses)
SELECT 
  a.id,
  dados_plano.nome,
  dados_plano.preco,
  dados_plano.descricao,
  dados_plano.duracao_meses
FROM academias a,
(VALUES 
  ('Plano Básico', 89.90, 'Acesso aos equipamentos básicos', 1),
  ('Plano Premium', 149.90, 'Acesso completo + aulas de grupo', 1),
  ('Plano VIP', 199.90, 'Acesso total + personal trainer', 1)
) AS dados_plano(nome, preco, descricao, duracao_meses)
WHERE a.nome = 'Academia PowerFit';

INSERT INTO planos_academia (academia_id, nome, preco, descricao, duracao_meses)
SELECT 
  a.id,
  dados_plano.nome,
  dados_plano.preco,
  dados_plano.descricao,
  dados_plano.duracao_meses
FROM academias a,
(VALUES 
  ('Mensal', 99.90, 'Plano mensal com acesso completo', 1),
  ('Trimestral', 259.90, 'Plano trimestral com desconto', 3),
  ('Anual', 899.90, 'Plano anual com máximo desconto', 12)
) AS dados_plano(nome, preco, descricao, duracao_meses)
WHERE a.nome = 'Fitness Center';

INSERT INTO planos_academia (academia_id, nome, preco, descricao, duracao_meses)
SELECT 
  a.id,
  dados_plano.nome,
  dados_plano.preco,
  dados_plano.descricao,
  dados_plano.duracao_meses
FROM academias a,
(VALUES 
  ('Basic', 129.90, 'Acesso aos equipamentos e piscina', 1),
  ('Standard', 179.90, 'Acesso completo + aulas', 1),
  ('Premium', 299.90, 'Tudo incluso + personal trainer', 1)
) AS dados_plano(nome, preco, descricao, duracao_meses)
WHERE a.nome = 'Strong Gym';

INSERT INTO planos_academia (academia_id, nome, preco, descricao, duracao_meses)
SELECT 
  a.id,
  dados_plano.nome,
  dados_plano.preco,
  dados_plano.descricao,
  dados_plano.duracao_meses
FROM academias a,
(VALUES 
  ('Personal 2x/semana', 249.90, '2 sessões de personal por semana', 1),
  ('Personal 3x/semana', 349.90, '3 sessões de personal por semana', 1),
  ('Personal VIP', 499.90, 'Personal exclusivo todos os dias', 1)
) AS dados_plano(nome, preco, descricao, duracao_meses)
WHERE a.nome = 'Body Shape';

-- Inserir imagens da galeria para as academias
INSERT INTO galeria_academia (academia_id, url_imagem, descricao)
SELECT 
  a.id,
  dados_galeria.url_imagem,
  dados_galeria.descricao
FROM academias a,
(VALUES 
  ('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80', 'Área de musculação'),
  ('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=400&q=80', 'Área cardio'),
  ('https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=400&q=80', 'Estúdio de aulas'),
  ('https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=400&q=80', 'Área de funcional'),
  ('https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=400&q=80', 'Vestiários'),
  ('https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=400&q=80', 'Recepção')
) AS dados_galeria(url_imagem, descricao);

-- Inserir alguns agendamentos de exemplo
INSERT INTO agendamentos (usuario_id, academia_id, titulo, observacoes, horario_inicio, horario_fim, status)
SELECT 
  u.id,
  a.id,
  'Treino de força',
  'Treino focado em membros superiores',
  NOW() + INTERVAL '1 day',
  NOW() + INTERVAL '1 day' + INTERVAL '1 hour',
  'confirmado'
FROM usuarios u, academias a 
WHERE u.email = 'joao@email.com' AND a.nome = 'Academia PowerFit'
LIMIT 1;

INSERT INTO agendamentos (usuario_id, academia_id, titulo, observacoes, horario_inicio, horario_fim, status)
SELECT 
  u.id,
  a.id,
  'Aula de spinning',
  'Aula em grupo - trazer toalha',
  NOW() + INTERVAL '2 days',
  NOW() + INTERVAL '2 days' + INTERVAL '45 minutes',
  'confirmado'
FROM usuarios u, academias a 
WHERE u.email = 'maria@email.com' AND a.nome = 'Fitness Center'
LIMIT 1;

-- Agendamentos do João Marcelino
INSERT INTO agendamentos (usuario_id, academia_id, titulo, observacoes, horario_inicio, horario_fim, status)
SELECT 
  u.id,
  a.id,
  'Treino personalizado',
  'Primeira avaliação física e treino adaptado',
  NOW() + INTERVAL '3 days',
  NOW() + INTERVAL '3 days' + INTERVAL '1 hour 30 minutes',
  'confirmado'
FROM usuarios u, academias a 
WHERE u.email = 'joao.marcelino@email.com' AND a.nome = 'Body Shape'
LIMIT 1;

INSERT INTO agendamentos (usuario_id, academia_id, titulo, observacoes, horario_inicio, horario_fim, status)
SELECT 
  u.id,
  a.id,
  'Aula de crossfit',
  'Treino funcional em grupo',
  NOW() + INTERVAL '5 days',
  NOW() + INTERVAL '5 days' + INTERVAL '1 hour',
  'confirmado'
FROM usuarios u, academias a 
WHERE u.email = 'joao.marcelino@email.com' AND a.nome = 'Academia PowerFit'
LIMIT 1;

-- Inserir alguns favoritos de exemplo
INSERT INTO favoritos_usuario (usuario_id, academia_id)
SELECT u.id, a.id
FROM usuarios u, academias a 
WHERE u.email = 'joao@email.com' AND a.nome IN ('Academia PowerFit', 'Strong Gym')
ON CONFLICT (usuario_id, academia_id) DO NOTHING;

INSERT INTO favoritos_usuario (usuario_id, academia_id)
SELECT u.id, a.id
FROM usuarios u, academias a 
WHERE u.email = 'maria@email.com' AND a.nome IN ('Fitness Center', 'Body Shape')
ON CONFLICT (usuario_id, academia_id) DO NOTHING;

-- Favoritos do João Marcelino
INSERT INTO favoritos_usuario (usuario_id, academia_id)
SELECT u.id, a.id
FROM usuarios u, academias a 
WHERE u.email = 'joao.marcelino@email.com' AND a.nome IN ('Academia PowerFit', 'Fitness Center', 'Body Shape')
ON CONFLICT (usuario_id, academia_id) DO NOTHING;

-- Seed concluído com sucesso!
-- Dados adicionais inseridos na estrutura multi-tenant