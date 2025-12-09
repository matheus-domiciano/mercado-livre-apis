import express from "express";
import api from "./api.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post('/generate/affiliate-link', async (req, res) => {
    
    if(!req.body) res.status(400).json({'error': 'No body found'});
    const { prods } = req.body;
    const apiResponse = await api(prods);

    return res.status(200).json(apiResponse);
})

app.listen( PORT, () => {
    console.log(`Api rodando na porta ${PORT}`);
})