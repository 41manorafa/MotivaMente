'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GerenciarUsuarioPage() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [tipo, setTipo] = useState('Administrador');
  const [isActive, setIsActive] = useState(true);
  const [hover, setHover] = useState<string | null>(null);
  const [cadastroSucesso, setCadastroSucesso] = useState<string | null>(null);
  const [cadastroErro, setCadastroErro] = useState<string | null>(null);
  const [loadingCadastro, setLoadingCadastro] = useState(false);

  const handleCadastrarUsuario = async () => {
    setCadastroErro(null);
    setCadastroSucesso(null);
    setLoadingCadastro(true);

    try {
      if (!nome.trim() || !email.trim() || !senha.trim()) {
        throw new Error("Todos os campos são obrigatórios.");
      }

      const response = await fetch("https://us-central1-motivamente-9517a.cloudfunctions.net/criarUsuarioComPermissao", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: nome.trim(),
          email: email.trim().toLowerCase(),
          senha: senha.trim(),
          tipo: tipo === 'Administrador' ? 'admin' : 'paciente',
          isActive,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro na requisição");
      }

      setCadastroSucesso("Usuário cadastrado com sucesso!");
      setNome('');
      setEmail('');
      setSenha('');
      setTipo('Administrador');
      setIsActive(true);
      setShowModal(false);
    } catch (error: any) {
      console.error("Erro ao cadastrar:", error);
      setCadastroErro("Erro ao cadastrar. Verifique os dados.");
    } finally {
      setLoadingCadastro(false);
    }
  };

  return (
    <main style={estiloMain}>
      <div style={estiloCard}>
        <h1 style={estiloTitulo}>Gerenciar Usuário</h1>

        <div style={estiloBotoes}>
          <button
            style={hover === 'cadastrar' ? estiloBotaoLaranjaHover : estiloBotaoLaranja}
            onMouseEnter={() => setHover('cadastrar')}
            onMouseLeave={() => setHover(null)}
            onClick={() => setShowModal(true)}
          >
            Cadastrar Novo Usuário
          </button>

          <button
            style={hover === 'editar' ? estiloBotaoLaranjaHover : estiloBotaoLaranja}
            onMouseEnter={() => setHover('editar')}
            onMouseLeave={() => setHover(null)}
          >
            Editar Usuário
          </button>

          <button
            style={hover === 'voltar' ? estiloBotaoCinzaHover : estiloBotaoCinza}
            onMouseEnter={() => setHover('voltar')}
            onMouseLeave={() => setHover(null)}
            onClick={() => router.push("/admin")}
          >
            Voltar
          </button>
        </div>
      </div>

      {showModal && (
        <div style={estiloModalOverlay}>
          <div style={estiloModal}>
            <h2 style={estiloTitulo}>Cadastrar Novo Usuário</h2>
            <input
              type="text"
              placeholder="Digite o nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              style={estiloInput}
            />
            <input
              type="email"
              placeholder="Digite o email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={estiloInput}
            />
            <input
              type="password"
              placeholder="Digite a senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              style={estiloInput}
            />
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              style={estiloInput}
            >
              <option value="Administrador">Administrador</option>
              <option value="Paciente">Paciente</option>
            </select>
            <label style={estiloCheckboxLabel}>
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                style={{ marginRight: 8 }}
              />
              Ativo
            </label>

            {cadastroSucesso && <p style={{ color: 'green' }}>{cadastroSucesso}</p>}
            {cadastroErro && <p style={{ color: 'red' }}>{cadastroErro}</p>}

            <div style={estiloBotoesModal}>
              <button style={estiloBotaoVerde} onClick={handleCadastrarUsuario} disabled={loadingCadastro}>
                {loadingCadastro ? 'Cadastrando...' : 'OK'}
              </button>
              <button style={estiloBotaoCinza} onClick={() => setShowModal(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

// Estilos mantidos inalterados

// Estilos (inalterados)
const estiloMain: React.CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: 20,
  backgroundColor: "#f7f7f7",
};

const estiloCard: React.CSSProperties = {
  backgroundColor: "white",
  padding: "30px 20px",
  borderRadius: 16,
  boxShadow: "0px 6px 18px rgba(0,0,0,0.1)",
  width: "100%",
  maxWidth: 400,
  textAlign: "center",
};

const estiloTitulo: React.CSSProperties = {
  fontSize: "1.8rem",
  fontWeight: "bold",
  color: "#333",
  marginBottom: 20,
  textShadow: "1px 1px 2px rgba(0,0,0,0.4)",
};

const estiloBotoes: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 15,
  marginTop: 20,
};

const estiloBotaoLaranja: React.CSSProperties = {
  backgroundColor: "#F58220",
  color: "white",
  padding: "12px 20px",
  borderRadius: 8,
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
  padding: "12px 20px",
  borderRadius: 8,
  border: "none",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "1rem",
};

const estiloBotaoCinzaHover: React.CSSProperties = {
  ...estiloBotaoCinza,
  backgroundColor: "#999",
};

const estiloBotaoVerde: React.CSSProperties = {
  backgroundColor: "#4CAF50",
  color: "white",
  padding: "12px 20px",
  borderRadius: 8,
  border: "none",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "1rem",
};

const estiloBotoesModal: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  gap: 10,
  marginTop: 20,
};

const estiloInput: React.CSSProperties = {
  width: "100%",
  padding: 10,
  marginBottom: 10,
  borderRadius: 8,
  border: "1px solid #ccc",
  fontSize: "1rem",
};

const estiloCheckboxLabel: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  fontSize: "1rem",
  color: "#333",
};

const estiloModalOverlay: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 50,
};

const estiloModal: React.CSSProperties = {
  backgroundColor: "white",
  padding: "30px 20px",
  borderRadius: 12,
  width: "90%",
  maxWidth: 400,
  boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
  textAlign: "center",
};

