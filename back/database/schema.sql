-- Schema SQL para o Supabase
-- Execute estes comandos no SQL Editor do Supabase

-- Tabela de proprietários das academias (para o Dashboard SaaS)
CREATE TABLE IF NOT EXISTS proprietarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  nome VARCHAR(255) NOT NULL,
  telefone VARCHAR(20),
  foto_perfil TEXT,
  plano_assinatura VARCHAR(50) DEFAULT 'basico', -- basico, premium, enterprise
  status_pagamento VARCHAR(20) DEFAULT 'ativo', -- ativo, suspenso, cancelado
  data_vencimento DATE,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ultimo_login TIMESTAMP WITH TIME ZONE
);

-- Tabela de usuários do app (clientes finais)
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  nome VARCHAR(255) NOT NULL,
  telefone VARCHAR(20),
  foto_perfil TEXT,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ultimo_login TIMESTAMP WITH TIME ZONE
);

-- Tabela de academias (gerenciadas pelo Dashboard SaaS)
CREATE TABLE IF NOT EXISTS academias (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  proprietario_id UUID REFERENCES proprietarios(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  endereco TEXT NOT NULL,
  telefone VARCHAR(20),
  whatsapp VARCHAR(20),
  email VARCHAR(255),
  horario_funcionamento TEXT,
  avaliacao DECIMAL(2,1) DEFAULT 0.0,
  foto_perfil TEXT,
  foto_banner TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  status VARCHAR(20) DEFAULT 'ativa', -- ativa, suspensa, inativa
  visibilidade BOOLEAN DEFAULT true, -- se aparece no app mobile
  configuracoes JSONB, -- configurações específicas da academia
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de planos das academias
CREATE TABLE IF NOT EXISTS planos_academia (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  academia_id UUID REFERENCES academias(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  preco DECIMAL(10,2) NOT NULL,
  descricao TEXT,
  duracao_meses INTEGER DEFAULT 1,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de galeria das academias
CREATE TABLE IF NOT EXISTS galeria_academia (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  academia_id UUID REFERENCES academias(id) ON DELETE CASCADE,
  url_imagem TEXT NOT NULL,
  descricao TEXT,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de favoritos dos usuários
CREATE TABLE IF NOT EXISTS favoritos_usuario (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  academia_id UUID REFERENCES academias(id) ON DELETE CASCADE,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(usuario_id, academia_id)
);

-- Tabela de agendamentos
CREATE TABLE IF NOT EXISTS agendamentos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  academia_id UUID REFERENCES academias(id) ON DELETE CASCADE,
  titulo VARCHAR(255) NOT NULL,
  observacoes TEXT,
  horario_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
  horario_fim TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(20) DEFAULT 'confirmado', -- confirmado, cancelado, concluido
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de sessões de API (para integração entre sistemas)
CREATE TABLE IF NOT EXISTS sessoes_api (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  proprietario_id UUID REFERENCES proprietarios(id) ON DELETE CASCADE,
  academia_id UUID REFERENCES academias(id) ON DELETE CASCADE,
  token_acesso TEXT NOT NULL,
  escopo VARCHAR(100) NOT NULL, -- read, write, admin
  data_expiracao TIMESTAMP WITH TIME ZONE NOT NULL,
  ultimo_uso TIMESTAMP WITH TIME ZONE,
  ip_origem INET,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de auditoria (para rastrear mudanças do Dashboard)
CREATE TABLE IF NOT EXISTS auditoria (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  proprietario_id UUID REFERENCES proprietarios(id),
  academia_id UUID REFERENCES academias(id),
  acao VARCHAR(100) NOT NULL, -- create, update, delete
  tabela VARCHAR(100) NOT NULL,
  dados_anteriores JSONB,
  dados_novos JSONB,
  ip_origem INET,
  user_agent TEXT,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_academias_proprietario ON academias(proprietario_id);
CREATE INDEX IF NOT EXISTS idx_academias_status ON academias(status, visibilidade);
CREATE INDEX IF NOT EXISTS idx_academias_localizacao ON academias(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_academias_avaliacao ON academias(avaliacao);
CREATE INDEX IF NOT EXISTS idx_agendamentos_usuario_horario ON agendamentos(usuario_id, horario_inicio);
CREATE INDEX IF NOT EXISTS idx_agendamentos_academia_horario ON agendamentos(academia_id, horario_inicio);
CREATE INDEX IF NOT EXISTS idx_favoritos_usuario ON favoritos_usuario(usuario_id);
CREATE INDEX IF NOT EXISTS idx_sessoes_api_token ON sessoes_api(token_acesso);
CREATE INDEX IF NOT EXISTS idx_auditoria_academia ON auditoria(academia_id, criado_em);

-- Políticas de segurança RLS (Row Level Security)
ALTER TABLE academias ENABLE ROW LEVEL SECURITY;
ALTER TABLE planos_academia ENABLE ROW LEVEL SECURITY;
ALTER TABLE galeria_academia ENABLE ROW LEVEL SECURITY;
ALTER TABLE agendamentos ENABLE ROW LEVEL SECURITY;

-- Política: Proprietários só veem suas próprias academias
CREATE POLICY "proprietarios_veem_suas_academias" ON academias
  FOR ALL USING (proprietario_id = auth.uid());

-- Política: App mobile vê apenas academias ativas e visíveis
CREATE POLICY "app_ve_academias_ativas" ON academias
  FOR SELECT USING (status = 'ativa' AND visibilidade = true);

-- Política: Planos seguem as mesmas regras das academias
CREATE POLICY "planos_seguem_academias" ON planos_academia
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM academias 
      WHERE id = planos_academia.academia_id 
      AND (proprietario_id = auth.uid() OR (status = 'ativa' AND visibilidade = true))
    )
  );

-- Política: Galeria segue as mesmas regras das academias
CREATE POLICY "galeria_segue_academias" ON galeria_academia
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM academias 
      WHERE id = galeria_academia.academia_id 
      AND (proprietario_id = auth.uid() OR (status = 'ativa' AND visibilidade = true))
    )
  );

-- Política: Usuários veem apenas seus próprios agendamentos
CREATE POLICY "usuarios_veem_seus_agendamentos" ON agendamentos
  FOR ALL USING (usuario_id = auth.uid());

-- Política: Proprietários veem agendamentos de suas academias
CREATE POLICY "proprietarios_veem_agendamentos_suas_academias" ON agendamentos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM academias 
      WHERE id = agendamentos.academia_id 
      AND proprietario_id = auth.uid()
    )
  );

-- Função para buscar academias próximas (usando PostGIS se disponível)
CREATE OR REPLACE FUNCTION buscar_academias_proximas(lat DECIMAL, lng DECIMAL, raio_km DECIMAL DEFAULT 10)
RETURNS TABLE (
  id UUID,
  nome VARCHAR,
  descricao TEXT,
  endereco TEXT,
  telefone VARCHAR,
  whatsapp VARCHAR,
  email VARCHAR,
  horario_funcionamento TEXT,
  avaliacao DECIMAL,
  foto_perfil TEXT,
  foto_banner TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  distancia_km DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.id,
    a.nome,
    a.descricao,
    a.endereco,
    a.telefone,
    a.whatsapp,
    a.email,
    a.horario_funcionamento,
    a.avaliacao,
    a.foto_perfil,
    a.foto_banner,
    a.latitude,
    a.longitude,
    -- Fórmula de Haversine para calcular distância
    (6371 * acos(cos(radians(lat)) * cos(radians(a.latitude)) * cos(radians(a.longitude) - radians(lng)) + sin(radians(lat)) * sin(radians(a.latitude)))) as distancia_km
  FROM academias a
  WHERE a.latitude IS NOT NULL 
    AND a.longitude IS NOT NULL
    AND (6371 * acos(cos(radians(lat)) * cos(radians(a.latitude)) * cos(radians(a.longitude) - radians(lng)) + sin(radians(lat)) * sin(radians(a.latitude)))) <= raio_km
  ORDER BY distancia_km;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar atualizado_em automaticamente
CREATE OR REPLACE FUNCTION atualizar_campo_atualizado_em()
RETURNS TRIGGER AS $$
BEGIN
    NEW.atualizado_em = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger nas tabelas relevantes
CREATE TRIGGER atualizar_proprietarios_atualizado_em BEFORE UPDATE ON proprietarios
    FOR EACH ROW EXECUTE FUNCTION atualizar_campo_atualizado_em();

CREATE TRIGGER atualizar_usuarios_atualizado_em BEFORE UPDATE ON usuarios
    FOR EACH ROW EXECUTE FUNCTION atualizar_campo_atualizado_em();

CREATE TRIGGER atualizar_academias_atualizado_em BEFORE UPDATE ON academias
    FOR EACH ROW EXECUTE FUNCTION atualizar_campo_atualizado_em();

CREATE TRIGGER atualizar_agendamentos_atualizado_em BEFORE UPDATE ON agendamentos
    FOR EACH ROW EXECUTE FUNCTION atualizar_campo_atualizado_em();

-- Triggers para auditoria automática
CREATE OR REPLACE FUNCTION registrar_auditoria()
RETURNS TRIGGER AS $$
DECLARE
    academia_id_valor UUID;
    proprietario_id_valor UUID;
BEGIN
    -- Determinar academia_id baseado na tabela
    IF TG_TABLE_NAME = 'academias' THEN
        academia_id_valor := COALESCE(NEW.id, OLD.id);
        proprietario_id_valor := COALESCE(NEW.proprietario_id, OLD.proprietario_id);
    ELSIF TG_TABLE_NAME = 'planos_academia' THEN
        academia_id_valor := COALESCE(NEW.academia_id, OLD.academia_id);
        -- Buscar proprietario_id da academia
        SELECT a.proprietario_id INTO proprietario_id_valor 
        FROM academias a 
        WHERE a.id = academia_id_valor;
    ELSIF TG_TABLE_NAME = 'galeria_academia' THEN
        academia_id_valor := COALESCE(NEW.academia_id, OLD.academia_id);
        -- Buscar proprietario_id da academia
        SELECT a.proprietario_id INTO proprietario_id_valor 
        FROM academias a 
        WHERE a.id = academia_id_valor;
    ELSE
        -- Para outras tabelas, não registrar na auditoria ou usar NULL
        academia_id_valor := NULL;
        proprietario_id_valor := NULL;
    END IF;

    INSERT INTO auditoria (
        academia_id,
        proprietario_id,
        acao,
        tabela,
        dados_anteriores,
        dados_novos
    ) VALUES (
        academia_id_valor,
        proprietario_id_valor,
        TG_OP,
        TG_TABLE_NAME,
        CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
        CASE WHEN TG_OP != 'DELETE' THEN to_jsonb(NEW) ELSE NULL END
    );
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger de auditoria
CREATE TRIGGER trigger_auditoria_academias
    AFTER INSERT OR UPDATE OR DELETE ON academias
    FOR EACH ROW EXECUTE FUNCTION registrar_auditoria();

CREATE TRIGGER trigger_auditoria_planos
    AFTER INSERT OR UPDATE OR DELETE ON planos_academia
    FOR EACH ROW EXECUTE FUNCTION registrar_auditoria();

CREATE TRIGGER trigger_auditoria_galeria
    AFTER INSERT OR UPDATE OR DELETE ON galeria_academia
    FOR EACH ROW EXECUTE FUNCTION registrar_auditoria();

-- Dados de exemplo para desenvolvimento e teste

-- Proprietários de exemplo (IDs fixos para facilitar testes)
INSERT INTO proprietarios (id, nome, email, senha, telefone) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Carlos Proprietário', 'carlos@gymowner.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxkUJqyqdG1PyAyinpRqU6Y.lQG', '11999888777'),
('550e8400-e29b-41d4-a716-446655440002', 'Ana Empresária', 'ana@fitnessbiz.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxkUJqyqdG1PyAyinpRqU6Y.lQG', '11888777666')
ON CONFLICT (id) DO NOTHING;

-- Usuários de exemplo
INSERT INTO usuarios (nome, email, senha, telefone) VALUES
('João Silva', 'joao@email.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxkUJqyqdG1PyAyinpRqU6Y.lQG', '11987654321'),
('Maria Santos', 'maria@email.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxkUJqyqdG1PyAyinpRqU6Y.lQG', '11876543210'),
('Pedro Costa', 'pedro@email.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxkUJqyqdG1PyAyinpRqU6Y.lQG', '11765432109')
ON CONFLICT (email) DO NOTHING;

-- Academias de exemplo
INSERT INTO academias (
    proprietario_id,
    nome,
    descricao,
    endereco,
    telefone,
    email,
    latitude,
    longitude,
    horario_funcionamento,
    avaliacao,
    foto_perfil,
    status,
    visibilidade
) VALUES
(
    '550e8400-e29b-41d4-a716-446655440001',
    'Academia FitLife',
    'Academia completa com equipamentos modernos e professores qualificados',
    'Rua das Flores, 123, São Paulo, SP',
    '11987654321',
    'contato@fitlife.com',
    -23.550520,
    -46.633308,
    '{"segunda": "06:00-22:00", "terca": "06:00-22:00", "quarta": "06:00-22:00", "quinta": "06:00-22:00", "sexta": "06:00-22:00", "sabado": "08:00-20:00", "domingo": "08:00-18:00"}',
    4.5,
    'https://example.com/fitlife.jpg',
    'ativa',
    true
),
(
    '550e8400-e29b-41d4-a716-446655440002',
    'Power Gym',
    'Foco em musculação e treinos de alta intensidade',
    'Av. Paulista, 456, São Paulo, SP',
    '11876543210',
    'info@powergym.com',
    -23.561684,
    -46.655981,
    '{"segunda": "05:00-23:00", "terca": "05:00-23:00", "quarta": "05:00-23:00", "quinta": "05:00-23:00", "sexta": "05:00-23:00", "sabado": "07:00-21:00", "domingo": "fechado"}',
    4.8,
    'https://example.com/powergym.jpg',
    'ativa',
    true
)
ON CONFLICT DO NOTHING;

-- Planos de exemplo
INSERT INTO planos_academia (academia_id, nome, descricao, preco, duracao_meses) 
SELECT 
    a.id,
    'Plano Mensal',
    'Acesso completo por 30 dias',
    89.90,
    1
FROM academias a
WHERE a.nome = 'Academia FitLife'
ON CONFLICT DO NOTHING;

INSERT INTO planos_academia (academia_id, nome, descricao, preco, duracao_meses) 
SELECT 
    a.id,
    'Plano Mensal',
    'Acesso completo por 30 dias',
    120.00,
    1
FROM academias a
WHERE a.nome = 'Power Gym'
ON CONFLICT DO NOTHING;

INSERT INTO planos_academia (academia_id, nome, descricao, preco, duracao_meses) 
SELECT 
    a.id,
    'Plano Trimestral',
    'Acesso completo por 90 dias com desconto',
    220.00,
    3
FROM academias a
WHERE a.nome IN ('Academia FitLife', 'Power Gym')
ON CONFLICT DO NOTHING;

-- Comentários das tabelas principais
COMMENT ON TABLE proprietarios IS 'Proprietários das academias - Dashboard SaaS';
COMMENT ON TABLE usuarios IS 'Usuários do aplicativo móvel';
COMMENT ON TABLE academias IS 'Academias com isolamento multi-tenant';
COMMENT ON TABLE agendamentos IS 'Reservas dos usuários nas academias';
COMMENT ON TABLE auditoria IS 'Log de auditoria para rastreamento de mudanças';

-- Schema concluído com sucesso!
-- Execute este script no SQL Editor do Supabase para criar toda a estrutura.