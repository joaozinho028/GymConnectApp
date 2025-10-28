require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Rotas
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

const academiaRoutes = require("./routes/academia");
app.use("/academias", academiaRoutes);

app.get("/", (req, res) => {
  res.send("API está rodando.");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
