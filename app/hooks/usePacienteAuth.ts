// app/hooks/usePacienteAuth.ts
'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/firebases";

export function usePacienteAuth() {
  const [autenticado, setAutenticado] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (usuario) => {
      if (!usuario) {
        console.warn("[usePacienteAuth] Nenhum usuário logado. Redirecionando...");
        setCarregando(false);
        router.push("/login");
        return;
      }

      try {
        const docRef = doc(db, "usuarios", usuario.uid);
        console.log("[usePacienteAuth] UID do usuário:", usuario.uid);
        console.log("[usePacienteAuth] Tentando obter documento...");
        const docSnap = await getDoc(docRef);
        console.log("[usePacienteAuth] Documento obtido:", docSnap);
        console.log("[usePacienteAuth] Documento existe:", docSnap.exists());

        if (!docSnap.exists()) {
          console.error("[usePacienteAuth] Documento do usuário não encontrado no Firestore.");
          router.push("/login");
          return;
        }

        const tipo = docSnap.data()?.tipo;
        console.log("[usePacienteAuth] Tipo do usuário:", tipo);

        if (tipo === "paciente") {
          setAutenticado(true);
        } else {
          console.warn(`[usePacienteAuth] Usuário logado não é paciente (tipo: ${tipo}).`);
          router.push("/login");
        }

      } catch (erro) {
        console.error("[usePacienteAuth] Erro ao buscar tipo de usuário:", erro);
        router.push("/login");
      } finally {
        setCarregando(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  return { autenticado, carregando };
}