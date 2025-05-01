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
        console.warn("Nenhum usuário logado. Redirecionando...");
        setCarregando(false);
        router.push("/login");
        return;
      }

      try {
        const docRef = doc(db, "usuarios", usuario.uid);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          console.error("Documento do usuário não encontrado no Firestore.");
          router.push("/login");
          return;
        }

        const tipo = docSnap.data()?.tipo;

        if (tipo === "paciente") {
          setAutenticado(true);
        } else {
          console.warn(`Usuário logado não é paciente (tipo: ${tipo}).`);
          router.push("/login");
        }

      } catch (erro) {
        console.error("Erro ao buscar tipo de usuário:", erro);
        router.push("/login");
      } finally {
        setCarregando(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  return { autenticado, carregando };
}
