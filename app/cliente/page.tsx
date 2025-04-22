'use client';

import { useState } from 'react';
import { useRouter } from "next/navigation";  // <= Agora está certo aqui!
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function ClientePage() {
  const router = useRouter();  // <= Correção feita aqui!

  const [diasSemReclamar, setDiasSemReclamar] = useState(0);
  const [mostrarPopup, setMostrarPopup] = useState(false);
  const [mostrarHistorico, setMostrarHistorico] = useState(false);
  const [mostrarMaterial, setMostrarMaterial] = useState(false);
  const [mostrarDesafio, setMostrarDesafio] = useState(true);
  const [novoPeso, setNovoPeso] = useState('');
  const [dataPesagem, setDataPesagem] = useState('');
  const [historicoPesagens, setHistoricoPesagens] = useState([
    { peso: '108', data: '2025-01-10' },
    { peso: '106', data: '2025-02-10' },
    { peso: '104', data: '2025-03-10' },
    { peso: '102', data: '2025-04-10' },
  ]);

  const nomeUsuario = 'Rafael';

  const reiniciarContador = () => setDiasSemReclamar(0);

  const registrarPeso = () => {
    if (novoPeso && dataPesagem) {
      setHistoricoPesagens([...historicoPesagens, { peso: novoPeso, data: dataPesagem }]);
    }
    setMostrarPopup(false);
    setNovoPeso('');
    setDataPesagem('');
  };

  return (
    <main style={estiloMain}>
      <div style={estiloCard}>
        {/* Botão de Logout */}
        <div style={estiloLogoutContainer}>
          <img
            src="/desligar.png"
            alt="Logout"
            style={{ width: "30px", height: "30px", cursor: "pointer" }}
            onClick={() => router.push('/login')}
          />
        </div>

        {/* Imagem de Fundo */}
        <img src="/fundo_cliente.png" alt="Fundo Cliente" style={estiloImagemFundo} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={estiloTitulo}>Bem-vindo, {nomeUsuario}!</h1>

          <div style={estiloPesoArea}>
            <img src="/Balança.png" alt="Balança" style={estiloBalança} />
            <div style={estiloPesoCard}>
              <p style={estiloTextoPeso}>Peso Inicial: 110kg</p>
              <p style={estiloTextoPeso}>Pesagem Atual: 100kg</p>
              <p style={estiloTextoPeso}>Peso Perdido: <span style={{ color: '#F58220' }}>10.0kg</span></p>
            </div>
          </div>

          <div style={estiloParabens}>
            Parabéns! Você já está emagrecendo há 35 dias 🎉 e concluiu 5/18 ciclos 👊
          </div>

          {/* Botões */}
          <button style={estiloBotao} onClick={() => setMostrarPopup(true)}>📝 Registrar Novo Peso</button>
          <button style={estiloBotao} onClick={() => setMostrarHistorico(true)}>📅 Histórico de Peso</button>
          <button style={estiloBotao} onClick={() => setMostrarMaterial(true)}>📚 Material Didático</button>

          {/* Checkbox Desafio */}
          <div style={{ marginTop: 10, marginBottom: 10 }}>
            <label style={{ fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', color: '#000' }}>
              <input type="checkbox" checked={mostrarDesafio} onChange={() => setMostrarDesafio(!mostrarDesafio)} style={{ marginRight: 8 }} />
              Mostrar Desafio 21 dias Sem Reclamar?
            </label>
          </div>

          {/* Desafio */}
          {mostrarDesafio && (
            <div style={estiloDesafioArea}>
              <button style={estiloBotaoDesafio}>{diasSemReclamar} dias sem reclamar</button>
              <span onClick={reiniciarContador} style={{ cursor: 'pointer', fontSize: '1.8rem' }} title="Clique para reiniciar o contador">🔄</span>
              <img src="/Desafio.png" alt="Desafio 21 Dias" style={{ width: '85px', height: '85px' }} />
            </div>
          )}

          {/* Popups */}
          {mostrarPopup && popupRegistrarPeso()}
          {mostrarHistorico && popupHistoricoPesagens()}
          {mostrarMaterial && popupMaterialDidatico()}
        </div>
      </div>
    </main>
  );

  // --- Funções Popup ---
  function popupRegistrarPeso() {
    return (
      <div style={estiloPopupFundo}>
        <div style={estiloPopupCaixa}>
          <h2>Registrar Novo Peso</h2>
          <input type="text" value={novoPeso} onChange={(e) => setNovoPeso(e.target.value)} placeholder="Digite seu peso (kg)" style={estiloInput} />
          <input type="date" value={dataPesagem} onChange={(e) => setDataPesagem(e.target.value)} style={estiloInput} />
          <div>
            <button style={estiloBotaoOk} onClick={registrarPeso}>OK</button>
            <button style={estiloBotaoCancelar} onClick={() => setMostrarPopup(false)}>Cancelar</button>
          </div>
        </div>
      </div>
    );
  }

  function popupHistoricoPesagens() {
    const dadosGrafico = historicoPesagens.map(item => ({
      data: item.data.slice(5),
      peso: Number(item.peso)
    }));

    return (
      <div style={estiloPopupFundo}>
        <div style={estiloPopupCaixa}>
          <h2>Histórico de Pesagens</h2>
          <ul style={{ listStyle: 'none', padding: 0, marginBottom: '20px' }}>
            {historicoPesagens.map((item, index) => (
              <li key={index} style={{ marginBottom: 8, fontWeight: 'bold' }}>{item.data} - {item.peso}kg</li>
            ))}
          </ul>
          <LineChart width={300} height={200} data={dadosGrafico}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="data" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="peso" stroke="#F58220" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
          </LineChart>
          <button style={estiloBotaoOk} onClick={() => setMostrarHistorico(false)}>Fechar</button>
        </div>
      </div>
    );
  }

  function popupMaterialDidatico() {
    return (
      <div style={estiloPopupFundo}>
        <div style={estiloPopupCaixa}>
          <h2>Material Didático</h2>
          <select style={estiloInput}>
            <option value="">Selecione uma apostila...</option>
            <option value="01">Semana 1 - Atividade Física</option>
            <option value="02">Semana 2 - Alimentação</option>
            <option value="03">Semana 3 - Sono</option>
            <option value="04">Semana 4 - Estresse</option>
          </select>
          <button style={estiloBotaoOk} onClick={() => setMostrarMaterial(false)}>Fechar</button>
        </div>
      </div>
    );
  }
}

// --- Estilos ---
const estiloMain: React.CSSProperties = { minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', backgroundColor: '#f7f7f7' };
const estiloCard: React.CSSProperties = { backgroundColor: 'white', padding: '30px 20px', borderRadius: '16px', boxShadow: '0px 6px 18px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px', textAlign: 'center', position: 'relative', overflow: 'hidden' };
const estiloImagemFundo: React.CSSProperties = { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.2, zIndex: 0 };
const estiloLogoutContainer: React.CSSProperties = { position: "absolute", top: "8px", right: "8px", zIndex: 2 };
const estiloTitulo: React.CSSProperties = { fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '20px', color: '#333', textShadow: '1px 1px 2px rgba(0,0,0,0.2)' };
const estiloPesoArea: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' };
const estiloBalança: React.CSSProperties = { width: '120px', height: '120px', marginRight: '10px' };
const estiloPesoCard: React.CSSProperties = { backgroundColor: '#fff', border: '2px solid #F58220', borderRadius: '12px', padding: '10px', textAlign: 'left' };
const estiloTextoPeso: React.CSSProperties = { fontWeight: 'bold', fontSize: '1rem', margin: '6px 0', color: '#333', textShadow: '1px 1px 2px rgba(0,0,0,0.2)' };
const estiloParabens: React.CSSProperties = { backgroundColor: '#FFEB99', padding: '15px', borderRadius: '12px', marginBottom: '20px', fontSize: '1rem', boxShadow: '0px 2px 8px rgba(0,0,0,0.05)', fontWeight: 'bold', color: '#333' };
const estiloBotao: React.CSSProperties = { width: '75%', padding: '8px', marginBottom: '15px', backgroundColor: '#F58220', color: 'white', fontWeight: 'bold', fontSize: '1rem', border: 'none', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s ease' };
const estiloDesafioArea: React.CSSProperties = { backgroundColor: '#fff', border: '2px solid #F58220', borderRadius: '12px', padding: '10px', marginTop: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' };
const estiloBotaoDesafio: React.CSSProperties = { backgroundColor: '#F58220', border: 'none', color: 'white', fontWeight: 'bold', fontSize: '0.9rem', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer' };
const estiloPopupFundo: React.CSSProperties = { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
const estiloPopupCaixa: React.CSSProperties = { backgroundColor: 'white', padding: '30px', borderRadius: '10px', textAlign: 'center', boxShadow: '0px 4px 10px rgba(0,0,0,0.3)', width: '90%', maxWidth: '350px' };
const estiloInput: React.CSSProperties = { padding: '10px', width: '80%', marginBottom: '10px', fontSize: '1rem', border: '1px solid #ccc', borderRadius: '6px' };
const estiloBotaoOk: React.CSSProperties = { marginRight: '10px', backgroundColor: '#55A350', color: 'white', fontWeight: 'bold', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontSize: '1rem' };
const estiloBotaoCancelar: React.CSSProperties = { backgroundColor: '#ccc', color: 'black', fontWeight: 'bold', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontSize: '1rem' };

