'use client';

import { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/firebases"; // Caminho corrigido!
import { collection, doc, setDoc } from "firebase/firestore";

export default function GerenciarUsuarioPage() {
  const router = useRouter();
  const [nome, setNome] = useState<string>('');
  const [erro, setErro] = useState<string>('');
  const [hoverSalvar, setHoverSalvar] = useState<boolean>(false);
  const [hoverCinza, setHoverCinza] = useState<string>(''); // Controle individual dos botões cinza

  const handleSalvar = async () => {
    if (!nome.trim()) {
      setErro("Por favor, preencha o nome do usuário.");
      return;
    }

    try {
      const usuariosCollection = collection(db, "usuarios");
      await setDoc(doc(usuariosCollection), {
        nome: nome.trim(),
      });
      alert(`Usuário salvo com sucesso!`);
      router.push("/admin");
    } catch (error) {
      console.error("Erro ao salvar no Firebase:", error);
      if (error instanceof Error) {
        alert(`Erro ao salvar no Firebase: ${error.message}`);
      } else {
        alert(`Erro inesperado.`);
      }
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNome(e.target.value);
    if (erro) setErro(""); // Limpa o erro ao digitar
  };

  const handleLimpar = () => {
    setNome("");
    setErro("");
  };

  return (
    <main style={estiloMain}>
      <div style={estiloCard}>
        <h1 style={estiloTitulo}>Gerenciar Usuário</h1>

        <input
          type="text"
          placeholder="Nome do Usuário"
          value={nome}
          onChange={handleInputChange}
          style={estiloInput}
        />

        {erro && (
          <p style={{ color: "red", marginBottom: "10px" }}>{erro}</p>
        )}

        <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "15px" }}>
          <button
            style={hoverSalvar ? estiloBotaoLaranjaHover : estiloBotaoLaranja}
            onMouseOver={() => setHoverSalvar(true)}
            onMouseOut={() => setHoverSalvar(false)}
            onClick={handleSalvar}
          >
            Salvar
          </button>

          <button
            style={hoverCinza === 'limpar' ? estiloBotaoCinzaHover : estiloBotaoCinza}
            onMouseOver={() => setHoverCinza('limpar')}
            onMouseOut={() => setHoverCinza('')}
            onClick={handleLimpar}
          >
            Limpar
          </button>

          <button
            style={hoverCinza === 'voltar' ? estiloBotaoCinzaHover : estiloBotaoCinza}
            onMouseOver={() => setHoverCinza('voltar')}
            onMouseOut={() => setHoverCinza('')}
            onClick={() => router.push("/admin")}
          >
            Voltar
          </button>
        </div>
      </div>
    </main>
  );
}

// Estilos
const estiloMain: React.CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px",
  backgroundColor: "#f7f7f7",
};

const estiloCard: React.CSSProperties = {
  backgroundColor: "white",
  padding: "30px 20px",
  borderRadius: "16px",
  boxShadow: "0px 6px 18px rgba(0,0,0,0.1)",
  width: "100%",
  maxWidth: "400px",
  textAlign: "center",
  overflow: "hidden",
};

const estiloTitulo: React.CSSProperties = {
  fontSize: "1.8rem",
  fontWeight: "bold",
  color: "#333",
  marginBottom: "20px",
};

const estiloInput: React.CSSProperties = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "1rem",
};

const estiloBotaoLaranja: React.CSSProperties = {
  backgroundColor: "#F58220",
  color: "white",
  padding: "10px 20px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "1rem",
  transition: "background-color 0.3s ease",
};

const estiloBotaoLaranjaHover: React.CSSProperties = {
  ...estiloBotaoLaranja,
  backgroundColor: "#e67300",
};

const estiloBotaoCinza: React.CSSProperties = {
  backgroundColor: "#ccc",
  color: "white",
  padding: "10px 20px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "1rem",
  transition: "background-color 0.3s ease",
};

const estiloBotaoCinzaHover: React.CSSProperties = {
  ...estiloBotaoCinza,
  backgroundColor: "#999",
};
