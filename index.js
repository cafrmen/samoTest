import express from 'express';
import bodyParser from 'body-parser';
import { pipeline } from '@xenova/transformers';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

let classifier;

(async () => {
  console.log("🔄 Cargando modelo de emociones...");
  classifier = await pipeline('text-classification', 'Xenova/bert-base-multilingual-uncased-sentiment');
  console.log("✅ Modelo cargado.");
})();

app.post('/analyze', async (req, res) => {
  const text = req.body.text;
  if (!classifier) return res.status(503).send("Modelo cargando...");
  const result = await classifier(text, { topk: 3 });
  res.json(result);
});

app.listen(port, () => {
  console.log(`🚀 Servidor en http://localhost:${port}`);
});
