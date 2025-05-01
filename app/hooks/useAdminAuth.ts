// app/hooks/useAdminAuth.ts
'use client';

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/firebases"; // ✅ usa o mesmo db já exportado
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export function useAdminAuth() {
  const [autenticado, setAutenticado] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (usuario) => {
      if (!usuario) {
        router.push("/login");
        return;
      }

      try {
        const docRef = doc(db, "usuarios", usuario.uid);
        const docSnap = await getDoc(docRef);
        const tipo = docSnap.data()?.tipo;

        if (tipo === "admin") {
          setAutenticado(true);
        } else {
          router.push("/login");
        }
      } catch (erro) {
        console.error("Erro ao verificar tipo de usuário:", erro);
        router.push("/login");
      } finally {
        setCarregando(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  return { autenticado, carregando };
}
