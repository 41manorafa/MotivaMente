'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px",
      backgroundColor: "#f7f7f7"
    }}>
      <div style={{
        position: "relative",
        backgroundColor: "rgba(255, 255, 255, 0.85)",
        padding: "40px 30px",
        borderRadius: "12px",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
        maxWidth: "400px",
        width: "100%",
        backgroundImage: "url('/fundo-card.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}>
        <img 
          src="/Logo.png" 
          alt="Logo MotivaMente" 
          style={{ 
            width: "350px",
            marginBottom: "30px",
            maxWidth: "90%",
            display: "block",
            marginLeft: "auto",
            marginRight: "auto"
          }}
        />
        <h1 style={{
          fontSize: "clamp(2rem, 5vw, 2.5rem)",
          marginBottom: "20px",
          color: "#333333",
          textShadow: "1px 1px 2px rgba(0, 0, 0, 0.4)"
        }}>
          Bem-vindo ao MotivaMente!
        </h1>
        <p style={{
          fontSize: "clamp(1rem, 4vw, 1.2rem)",
          marginBottom: "30px",
          color: "#333333",
          textShadow: "1px 1px 2px rgba(0, 0, 0, 0.4)"
        }}>
          Sua jornada de transformação pessoal começa agora.
        </p>

        <Link href="/login" style={{ textDecoration: 'none' }}>
          <button
            style={{
              padding: "15px 30px",
              fontSize: "1rem",
              backgroundColor: "#F58220",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              width: "100%",
              maxWidth: "250px",
              marginTop: "20px",
              transition: "background-color 0.3s ease"
            }}
            onMouseOver={e => (e.currentTarget.style.backgroundColor = "#e67300")}
            onMouseOut={e => (e.currentTarget.style.backgroundColor = "#F58220")}
          >
            Começar Agora
          </button>
        </Link>

      </div>
    </main>
  );
}
