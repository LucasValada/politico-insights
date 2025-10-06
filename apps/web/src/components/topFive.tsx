import React, { useEffect, useState } from "react";

interface PoliticoCard {
  id: number;
  tipo: string;
  score: number;
  dados: {
    nome: string;
    siglaPartido: string;
    siglaUf: string;
    urlFoto: string;
  } | null;
}

export function TopFive() {
  const [top5, setTop5] = useState<PoliticoCard[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTop5();
    const interval = setInterval(fetchTop5, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  async function fetchTop5() {
    setLoading(true);
    try {
      const resp = await fetch("http://localhost:3333/api/scoring/top5-geral");
      if (!resp.ok) {
        throw new Error(`Erro HTTP ${resp.status}`);
      }
      const arr = await resp.json();
      if (!Array.isArray(arr)) {
        throw new Error("Resposta inválida: esperado array");
      }
      setTop5(arr);
    } catch (err) {
      console.error("Erro ao buscar top5", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <p>Carregando...</p>;
  if (!top5.length) return <p>Nenhum dado encontrado.</p>;

  const pior = top5[0];
  const others = top5.slice(1);

  return (
    <div className="flex flex-col items-center mt-8 text-black">
      <h2 className="text-2xl font-bold text-[#fcbd27] mb-6">
        🏛️ Top 5 Geral dos PIORES Políticos
      </h2>

      {/* Pior do dia */}
      <div className="flex flex-col items-center mb-8">
        <h3 className="text-xl font-semibold mb-2">Pior do Dia 😬</h3>
        {pior.dados?.urlFoto && (
          <img
            src={pior.dados.urlFoto}
            alt={pior.dados.nome}
            className="w-60 h-60 rounded-full border-4 border-red-600 object-cover"
          />
        )}
        <h4 className="text-lg font-bold mt-4">{pior.dados?.nome}</h4>
        <p className="text-gray-700">
          {pior.dados?.siglaPartido} — {pior.dados?.siglaUf}
        </p>
        <p className="text-[#fcbd27] text-lg mt-2 font-semibold">
          Score: {pior.score}
        </p>
      </div>

      {/* Outros 4 */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-2xl">
        {others.map((p) => (
          <div
            key={p.id}
            className={`flex items-center gap-3 p-3 border rounded-md shadow-sm ${
              p.score > pior.score ? "bg-white" : "bg-red-50"
            }`}
          >
            {p.dados?.urlFoto && (
              <img
                src={p.dados.urlFoto}
                alt={p.dados.nome}
                className="w-16 h-16 rounded-full object-cover border"
              />
            )}
            <div>
              <div className="font-semibold">{p.dados?.nome}</div>
              <div className="text-gray-600 text-sm">
                {p.dados?.siglaPartido} — {p.dados?.siglaUf}
              </div>
              <div className="text-[#fcbd27] font-semibold">
                Score: {p.score}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
