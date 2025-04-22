// lib/multer.ts
import multer from "multer";

// Configuração do Multer para salvar os arquivos temporariamente na pasta "uploads"
const storage = multer.memoryStorage(); // Usamos `memoryStorage` para armazenar os arquivos em memória

const upload = multer({ storage: storage });

export default upload;
