import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import cors from "cors";
import { auth, db } from "./firebaseAdmin";

// Middleware de CORS
const corsHandler = cors({ origin: true });

// ✅ Função HTTP para criar usuário com permissão
export const criarUsuarioComPermissao = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).send("Método não permitido. Use POST.");
    }

    const { nome, email, senha, tipo, isActive } = req.body;

    if (!nome || !email || !senha || !tipo) {
      return res.status(400).send("Dados incompletos para criação do usuário.");
    }

    try {
      const userRecord = await auth.createUser({
        email: email.toLowerCase(),
        password: senha,
        displayName: nome,
        disabled: false,
      });

      await db.collection("usuarios").doc(userRecord.uid).set({
        nome,
        email: email.toLowerCase(),
        tipo,
        isActive: isActive ?? true,
        criadoEm: admin.firestore.FieldValue.serverTimestamp(),
      });

      return res.status(200).send({ sucesso: true, uid: userRecord.uid });
    } catch (error) {
      return res.status(500).send({ erro: error.message });
    }
  });
});

// ✅ Função callable para buscar o tipo do usuário autenticado
export const getTipoUsuarioPorUID = functions.https.onCall(async (data, context) => {
  const uid = context.auth?.uid;

  if (!uid) {
    throw new functions.https.HttpsError("unauthenticated", "Usuário não autenticado.");
  }

  try {
    const doc = await db.collection("usuarios").doc(uid).get();

    if (!doc.exists) {
      throw new functions.https.HttpsError("not-found", "Usuário não encontrado no banco.");
    }

    const dados = doc.data();
    return { tipo: dados?.tipo ?? null };
  } catch (error) {
    throw new functions.https.HttpsError("internal", "Erro ao buscar tipo de usuário.");
  }
});
