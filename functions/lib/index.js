"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.criarUsuarioComPermissao = void 0;
const functions = __importStar(require("firebase-functions"));
const cors_1 = __importDefault(require("cors")); // ✅ Corrigido: importação default correta
const firebaseAdmin_1 = require("./firebaseAdmin"); // ✅ Caminho local correto
const admin = __importStar(require("firebase-admin"));
const corsHandler = (0, cors_1.default)({ origin: true });
exports.criarUsuarioComPermissao = functions.https.onRequest((req, res) => {
    corsHandler(req, res, async () => {
        if (req.method !== "POST") {
            return res.status(405).send("Método não permitido. Use POST.");
        }
        const { nome, email, senha, tipo, isActive } = req.body;
        if (!nome || !email || !senha || !tipo) {
            return res.status(400).send("Dados incompletos para criação do usuário.");
        }
        try {
            // Log de entrada
            console.log("Iniciando criação de usuário:", { nome, email, tipo, isActive });
            // Cria o usuário no Firebase Authentication
            const userRecord = await firebaseAdmin_1.auth.createUser({
                email: email.toLowerCase(),
                password: senha,
                displayName: nome,
                disabled: false,
            });
            console.log("Usuário criado com UID:", userRecord.uid);
            // Salva os dados no Firestore
            await firebaseAdmin_1.db.collection("usuarios").doc(userRecord.uid).set({
                nome,
                email: email.toLowerCase(),
                tipo,
                isActive: isActive ?? true,
                criadoEm: admin.firestore.FieldValue.serverTimestamp(),
            });
            console.log("Dados salvos no Firestore com sucesso.");
            return res.status(200).send({ sucesso: true, uid: userRecord.uid });
        }
        catch (error) {
            console.error("Erro ao criar usuário:", error);
            return res.status(500).send({ erro: error.message });
        }
    });
});
