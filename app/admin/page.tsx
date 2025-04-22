'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { db, auth } from "../firebases";
import { collection, getDocs } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function LoginPage() {
  const [email, setEmail] = useState<string>('');
  const [senha, setSenha] = useState<string>('');
  const [erro, setErro] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showLogo, setShowLogo] = useState<boolean>(false);
  const [firestoreStatus, setFirestoreStatus] = useState<"pendente" | "ok" | "erro">("pendente");

  const router = useRouter();

  useEffect(() => {
    setShowLogo(true);
  }, []);

  const handleInputChange = (setter: (value: string) => void) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
    };

  const handleButtonHover = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, hover: boolean) => {
    e.currentTarget.style.backgroundColor = hover ? "#e67300" : "#F58220";
  };

  const testarConexaoFirestore = async () => {
    try {
      const usuariosRef = collection(db, "usuarios");
      await getDocs(usuariosRef);
      setFirestoreStatus("ok");
    } catch (error) {
      console.error("Erro na conexão com Firestore:", error);
      setFirestoreStatus("erro");
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErro('');
    setLoading(true);

    try {
      // Login
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), senha.trim());
      const user = userCredential.user;

      // Após login, testar conexão com Firestore
      await testarConexaoFirestore();

      // Buscar no Firestore se é Admin ou Cliente
      const usuariosRef = collection(db, "usuarios");
      const usuariosSnapshot = await getDocs(usuariosRef);

      const userData = usuariosSnapshot.docs
        .map(doc => doc.data() as { email: string, nome: string })
        .find(u => u.email.toLowerCase().trim() === email.toLowerCase().trim());

      if (userData?.nome === "Admin") {
        router.push("/admin");
      } else {
        router.push("/cliente");
      }

    } catch (error: any) {
      console.error("Erro ao fazer login:", error);
      if (error.code === 'auth/user-not-found') {
        setErro("Usuário não encontrado.");
      } else if (error.code === 'auth/wrong-password') {
        setErro("Senha incorreta.");
      } else {
        setErro("Erro ao fazer login. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={estiloMain()}>
      {showLogo && (
        <Image
          src="/logo.png"
          alt="logo MotivaMente"
          width={400}
          height={400}
          style={estiloLogo()}
          priority
        />
      )}

      <div style={estiloCard()}>
        <h1 style={estiloTitulo()}>
          Login no MotivaMente
        </h1>

        {erro && (
          <p style={estiloErro()}>
            {erro}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Usuário"
            value={email}
            onChange={handleInputChange(setEmail)}
            style={inputEstilo()}
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={handleInputChange(setSenha)}
            style={inputEstilo()}
          />
          <button
            type="submit"
            style={botaoEstilo()}
            onMouseOver={(e) => handleButtonHover(e, true)}
            onMouseOut={(e) => handleButtonHover(e, false)}
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        {/* Status de conexão Firestore */}
        <div style={testeConexaoContainer()}>
          <div style={bolinhaStatus(firestoreStatus)} />
          <span style={textoStatus()}>
            {firestoreStatus === "ok" && "Conexão OK!"}
            {firestoreStatus === "erro" && "Erro na Conexão"}
            {firestoreStatus === "pendente" && "Conexão pendente"}
          </span>
        </div>
      </div>
    </main>
  );

  // Estilos
  function estiloMain(): React.CSSProperties {
    return {
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px",
      backgroundColor: "#f7f7f7",
      position: "relative",
      overflow: "hidden"
    };
  }

  function estiloLogo(): React.CSSProperties {
    return {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      opacity: 1,
      pointerEvents: "none",
      zIndex: 0
    };
  }

  function estiloCard(): React.CSSProperties {
    return {
      position: "relative",
      backgroundColor: "rgba(255, 255, 255, 0.92)",
      padding: "40px 30px",
      borderRadius: "12px",
      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
      textAlign: "center",
      maxWidth: "400px",
      width: "100%",
      zIndex: 1
    };
  }

  function estiloTitulo(): React.CSSProperties {
    return {
      fontSize: "clamp(2rem, 5vw, 2.5rem)",
      marginBottom: "20px",
      color: "#333333",
      textShadow: "1px 1px 2px rgba(0, 0, 0, 0.4)"
    };
  }

  function estiloErro(): React.CSSProperties {
    return {
      color: "red",
      fontSize: "0.9rem",
      marginBottom: "10px"
    };
  }

  function inputEstilo(): React.CSSProperties {
    return {
      width: "100%",
      padding: "12px",
      marginBottom: "15px",
      border: "1px solid #ccc",
      borderRadius: "8px",
      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
      fontSize: "1rem"
    };
  }

  function botaoEstilo(): React.CSSProperties {
    return {
      width: "100%",
      padding: "12px",
      backgroundColor: "#F58220",
      border: "none",
      borderRadius: "8px",
      color: "white",
      fontWeight: "600",
      fontSize: "1rem",
      cursor: "pointer",
      transition: "background-color 0.3s ease"
    };
  }

  function testeConexaoContainer(): React.CSSProperties {
    return {
      marginTop: "20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px"
    };
  }

  function bolinhaStatus(status: "pendente" | "ok" | "erro"): React.CSSProperties {
    let color = "gray";
    if (status === "ok") color = "green";
    if (status === "erro") color = "red";

    return {
      width: "14px",
      height: "14px",
      borderRadius: "50%",
      backgroundColor: color,
      transition: "background-color 0.3s ease"
    };
  }

  function textoStatus(): React.CSSProperties {
    return {
      fontSize: "0.9rem",
      fontWeight: "600",
      color: "#333"
    };
  }
}
