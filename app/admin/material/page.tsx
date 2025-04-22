'use client';

export default function MaterialDidaticoPage() {
  return (
    <main style={estiloMain}>
      <div style={estiloCard}>
        <h1 style={estiloTitulo}>Gerenciar Material Didático</h1>
        <p style={estiloTexto}>
          Aqui você poderá cadastrar, editar ou excluir materiais didáticos disponíveis para os usuários.
        </p>
      </div>
    </main>
  );
}

// --------- Estilos ----------
const estiloMain: React.CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#f7f7f7",
  padding: "20px"
};

const estiloCard: React.CSSProperties = {
  backgroundColor: "white",
  padding: "30px",
  borderRadius: "12px",
  boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
  textAlign: "center",
  width: "90%",
  maxWidth: "500px"
};

const estiloTitulo: React.CSSProperties = {
  fontSize: "2rem",
  fontWeight: "bold",
  color: "#333",
  marginBottom: "10px"
};

const estiloTexto: React.CSSProperties = {
  fontSize: "1rem",
  color: "#666"
};
