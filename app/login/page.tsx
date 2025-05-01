'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { auth, db } from "@/firebases";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import firebase from 'firebase/app'; // ✅ Importe firebase para acessar a versão

console.log("Firebase version:", firebase.SDK_VERSION); // ✅ Log da versão do Firebase

export default function LoginPage() {
  const [email, setEmail] = useState<string>('');
  const [senha, setSenha] = useState<string>('');
  const [erro, setErro] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showLogo, setShowLogo] = useState<boolean>(false);

  console.log("auth object:", auth); // ✅ Log do objeto auth
  console.log("db object:", db);     // ✅ Log do objeto db

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErro('');
    setLoading(true);

    const usuario = email.trim();
    const senhaDigitada = senha.trim();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, usuario, senhaDigitada);
      const user = userCredential.user;

      console.log("Usuário (após login):", user); // ✅ Log completo do objeto user
      console.log("UID do usuário (após login):", user?.uid); // ✅ Log do UID

      console.log("db object:", db); // ✅ Verifique se 'db' ainda é um objeto válido

      const docRef = doc(db, "usuarios", user.uid);
      console.log("Referência do documento:", docRef.path);
      console.log("Tentando obter documento..."); // ✅ Log antes da chamada getDoc
      const docSnap = await getDoc(docRef);
      console.log("Documento obtido:", docSnap); // ✅ Log do resultado de getDoc

      if (!docSnap.exists()) {
        throw new Error("Usuário não encontrado no banco de dados.");
      }

      const dados = docSnap.data();
      const tipo = dados?.tipo?.toLowerCase();

      console.log("Tipo de usuário:", tipo);

      if (tipo === "admin") {
        router.push("/admin");
      } else if (tipo === "paciente") {
        router.push("/cliente");
      } else {
        throw new Error("Tipo de usuário não reconhecido.");
      }

    } catch (error: any) {
      console.error("Erro ao fazer login:", error);
      if (error.code === 'auth/user-not-found') {
        setErro("Usuário não encontrado.");
      } else if (error.code === 'auth/wrong-password') {
        setErro("Senha incorreta.");
      } else {
        setErro(error.message || "Erro na autenticação. Tente novamente.");
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
          alt="Logo MotivaMente"
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
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
            <div style={{ height: "100%" }}>
              <img
                src="/usuario_logo.png"
                alt="Usuário"
                style={{ width: "60px", height: "60px", objectFit: "cover", marginRight: "10px" }}
              />
            </div>
            <input
              type="text"
              placeholder="Usuário"
              value={email}
              onChange={handleInputChange(setEmail)}
              style={{ ...inputEstilo(), flex: 1, height: "60px" }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', marginBottom: "15px" }}>
            <div style={{ height: "100%" }}>
              <img
                src="/cadeado.png"
                alt="Senha"
                style={{ width: "60px", height: "60px", objectFit: "cover", marginRight: "10px" }}
              />
            </div>
            <input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={handleInputChange(setSenha)}
              style={{ ...inputEstilo(), flex: 1, height: "60px" }}
            />
          </div>

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
      </div>
    </main>
  );

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
      transition: "background-color 0.3s ease, box-shadow 0.3s ease",
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.15)"
    };
  }
}