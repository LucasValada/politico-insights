import React, { useState } from "react";

interface ScoringResponse {
  aviso: string;
  indicios: {
    picoP95: boolean;
    categoriasSensiveisAlta: boolean;
    notasArredondadas: boolean;
    frequenciaAtipica: boolean;
    semComprovante: boolean;
    outros: boolean;
  };
  metrics: {
    pctComprovantesValidos: number;
    concentracaoTopCnpj: number;
  };
  scores: {
    suspicionScore: number;
    transparencyScore: number;
  };
  politico?: {
    nome: string;
    partido: string;
    estado: string;
    imagem?: string;
  };
}
export function ScoringTest() {
  const [data, setData] = useState<ScoringResponse | null>(null);
  const [politicoId, setPoliticoId] = useState(1);
  const [loading, setLoading] = useState(false);

  async function executarTeste() {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3333/api/scoring/mock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ politicoId }),
      });
      if (!response.ok) throw new Error(`Erro HTTP ${response.status}`);
      const json = await response.json();
      setData(json);
    } catch (err) {
      console.error("Erro ao executar teste:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 border rounded-md bg-white max-w-3xl mx-auto mt-6 shadow-sm">
      <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
        <span>⚖️</span> Teste de Scoring
      </h2>
      <select
        value={politicoId}
        onChange={(e) => setPoliticoId(Number(e.target.value))}
        className="border p-2 rounded-md mb-2"
      >
        <option value={1}>Kim Kataguiri</option>
        <option value={2}>Amanda Vettorazzo</option>
        <option value={3}>Guto Zacarias</option>
      </select>
      <button
        onClick={executarTeste}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded-md mt-2 hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Executando..." : "Executar teste"}
      </button>

      {data && (
        <div className="mt-6 space-y-4">
          {data.politico && (
            <div className="flex items-center gap-4 border-b pb-3">
              <img
                src={data.politico.imagem}
                alt={data.politico.nome}
                className="w-20 h-20 rounded-full object-cover border"
              />
              <div>
                <h3 className="text-lg font-semibold">{data.politico.nome}</h3>
                <p className="text-gray-600">
                  {data.politico.partido} — {data.politico.estado}
                </p>
              </div>
            </div>
          )}

          <p className="italic text-gray-600">{data.aviso}</p>

          <div>
            <h4 className="font-semibold text-lg mb-2">Indícios Detectados:</h4>
            <ul className="grid grid-cols-2 gap-x-4">
              {Object.entries(data.indicios).map(([key, value]) => (
                <li key={key} className="flex items-center gap-2">
                  {value ? "✅" : "❌"} {key}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-2">Scores:</h4>
            <p>
              <strong>Suspicion Score:</strong> {data.scores.suspicionScore}
            </p>
            <p>
              <strong>Transparency Score:</strong>{" "}
              {data.scores.transparencyScore}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
