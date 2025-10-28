const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Função para calcular distância entre dois pontos (Haversine)
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Raio da Terra em km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Controller para buscar academias próximas
const getAcademiasProximas = async (req, res) => {
  const { latitude, longitude, raio } = req.query;
  console.log('Latitude recebida:', latitude);
  console.log('Longitude recebida:', longitude);
  console.log('Raio recebido:', raio);
  if (!latitude || !longitude || !raio) {
    return res.status(400).json({ error: 'Latitude, longitude e raio são obrigatórios.' });
  }

  try {
    // Busca todas as academias no Supabase
    const { data: academias, error } = await supabase
      .from("academias")
      .select("*");
    if (error) throw error;

    // Filtra as academias pelo raio
    const proximas = (academias || []).filter(academia => {
      const dist = getDistance(
        parseFloat(latitude),
        parseFloat(longitude),
        parseFloat(academia.latitude),
        parseFloat(academia.longitude)
      );
      console.log(`Academia: ${academia.nome} | Lat: ${academia.latitude} | Lon: ${academia.longitude} | Distância: ${dist} km`);
      return dist <= parseFloat(raio);
    });

    console.log('Academias próximas encontradas:', proximas.map(a => a.nome));
    return res.json(proximas);
  } catch (err) {
    console.error('Erro ao buscar academias:', err);
    return res.status(500).json({ error: 'Erro ao buscar academias.', details: err.message });
  }
};

module.exports = { getAcademiasProximas };
