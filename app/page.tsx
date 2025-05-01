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
          src="/logo.png" 
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

        <div style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          marginTop: "20px",
          gap: "10px"
        }}>
          <Link href="/login">
            <img src="/login.png" alt="Login" style={{ width: "80px", cursor: "pointer" }} />
          </Link>
          <Link href="/loja">
            <img src="/loja.png" alt="Loja" style={{ width: "80px", cursor: "pointer" }} />
          </Link>
          <a
            href="https://api.whatsapp.com/send/?phone=5531982243411&text=Olá%2C+gostaria+de+saber+mais+sobre+o+Motivamente&type=phone_number&app_absent=0"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/contato.png" alt="Contato" style={{ width: "80px", cursor: "pointer" }} />
          </a>
        </div>
      </div>
    </main>
  );
}
