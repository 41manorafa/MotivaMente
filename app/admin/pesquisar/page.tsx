'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function HistoricoEvolucaoPage() {
  const router = useRouter();

  const [pesquisa, setPesquisa] = useState("");
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<any>(null);
  const [mostrarHistorico, setMostrarHistorico] = useState(false);

  const usuariosMock = [
    {
      id: 1,
      nome: "Rafael Menezes",
      pesoInicial: 110,
      pesoAtual: 100,
      ciclosConcluidos: 5,
      progresso: "10kg perdidos",
      historicoPesagem: [
        { data: "2025-01-10", peso: 110 },
        { data: "2025-02-10", peso: 108 },
        { data: "2025-03-10", peso: 106 },
        { data: "2025-04-10", peso: 100 }
      ]
    },
    {
      id: 2,
      nome: "João Silva",
      pesoInicial: 95,
      pesoAtual: 89,
      ciclosConcluidos: 4,
      progresso: "6kg perdidos",
      historicoPesagem: [
        { data: "2025-01-05", peso: 95 },
        { data: "2025-02-05", peso: 93 },
        { data: "2025-03-05", peso: 91 },
        { data: "2025-04-05", peso: 89 }
      ]
    },
    {
      id: 3,
      nome: "Maria Souza",
      pesoInicial: 82,
      pesoAtual: 76,
      ciclosConcluidos: 6,
      progresso: "6kg perdidos",
      historicoPesagem: [
        { data: "2025-01-15", peso: 82 },
        { data: "2025-02-15", peso: 80 },
        { data: "2025-03-15", peso: 78 },
        { data: "2025-04-15", peso: 76 }
      ]
    }
  ];

  const filtrarUsuarios = usuariosMock.filter(usuario =>
    usuario.nome.toLowerCase().includes(pesquisa.toLowerCase())
  );

  const handlePesquisar = () => {
    const usuario = usuariosMock.find(u => u.nome.toLowerCase().includes(pesquisa.toLowerCase()));
    if (usuario) {
      setUsuarioSelecionado(usuario);
      setMostrarHistorico(true);
    } else {
      alert("Usuário não encontrado.");
    }
  };

  const handleSelecionarSugestao = (usuario: any) => {
    setUsuarioSelecionado(usuario);
    setPesquisa(usuario.nome);
    setMostrarHistorico(true);
  };

  const dadosGrafico = usuarioSelecionado?.historicoPesagem?.map((item: any) => ({
    data: formatarData(item.data),
    peso: item.peso
  })) || [];

  function formatarData(dataISO: string) {
    const date = new Date(dataISO);
    const dia = date.getDate().toString().padStart(2, '0');
    const mes = date.toLocaleString('pt-BR', { month: 'short' });
    return `${dia}/${mes}`;
  }

  return (
    <main style={estiloMain}>
      <div style={estiloCard}>
        <h1 style={estiloTitulo}>Histórico e Evolução</h1>

        <div style={{ position: "relative" }}>
          <input
            type="text"
            placeholder="🔎 Pesquisar usuário..."
            value={pesquisa}
            onChange={(e) => {
              setPesquisa(e.target.value);
              setMostrarHistorico(false);
              setUsuarioSelecionado(null);
            }}
            style={estiloInput}
          />
          {pesquisa.length > 0 && filtrarUsuarios.length > 0 && !mostrarHistorico && (
            <div style={estiloSugestoes}>
              {filtrarUsuarios.map(usuario => (
                <div
                  key={usuario.id}
                  style={estiloSugestaoItem}
                  onClick={() => handleSelecionarSugestao(usuario)}
                >
                  {usuario.nome}
                </div>
              ))}
            </div>
          )}
        </div>

        <button style={estiloBotaoLaranja} onClick={handlePesquisar}>Pesquisar</button>
        <button style={estiloBotaoCinza} onClick={() => router.push("/admin")}>Voltar</button>

        {mostrarHistorico && usuarioSelecionado && (
          <div style={estiloHistorico}>
            <p><strong>Nome:</strong> {usuarioSelecionado.nome}</p>
            <p><strong>Peso Inicial:</strong> {usuarioSelecionado.pesoInicial}kg</p>
            <p><strong>Peso Atual:</strong> {usuarioSelecionado.pesoAtual}kg</p>
            <p><strong>Ciclos Concluídos:</strong> {usuarioSelecionado.ciclosConcluidos}</p>
            <p><strong>Progresso:</strong> {usuarioSelecionado.progresso}</p>

            <h3 style={{ marginTop: "20px", marginBottom: "10px", color: "#F58220" }}>Evolução do Peso 📈</h3>

            <LineChart width={300} height={200} data={dadosGrafico}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="data" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="peso" stroke="#F58220" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
            </LineChart>
          </div>
        )}
      </div>
    </main>
  );
}

// ------------------- ESTILOS -------------------

const estiloMain: React.CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px",
  backgroundColor: "#f7f7f7"
};

const estiloCard: React.CSSProperties = {
  backgroundColor: "white",
  padding: "30px 20px",
  borderRadius: "16px",
  boxShadow: "0px 6px 18px rgba(0,0,0,0.1)",
  width: "100%",
  maxWidth: "400px",
  textAlign: "center",
  overflow: "hidden"
};

const estiloTitulo: React.CSSProperties = {
  fontSize: "1.8rem",
  fontWeight: "bold",
  color: "#333",
  marginBottom: "20px"
};

const estiloInput: React.CSSProperties = {
  width: "100%",
  padding: "12px",
  marginBottom: "10px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "1rem"
};

const estiloBotaoLaranja: React.CSSProperties = {
  backgroundColor: "#F58220",
  color: "white",
  padding: "10px 20px",
  marginTop: "10px",
  marginBottom: "10px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "1rem",
  width: "100%"
};

const estiloBotaoCinza: React.CSSProperties = {
  backgroundColor: "#ccc",
  color: "white",
  padding: "10px 20px",
  marginBottom: "10px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "1rem",
  width: "100%"
};

const estiloHistorico: React.CSSProperties = {
  marginTop: "20px",
  textAlign: "left"
};

const estiloSugestoes: React.CSSProperties = {
  position: "absolute",
  top: "100%",
  left: 0,
  right: 0,
  backgroundColor: "white",
  border: "1px solid #ccc",
  borderRadius: "8px",
  marginTop: "4px",
  boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
  zIndex: 10,
  maxHeight: "200px",
  overflowY: "auto"
};

const estiloSugestaoItem: React.CSSProperties = {
  padding: "8px 12px",
  cursor: "pointer",
  borderBottom: "1px solid #eee"
};
