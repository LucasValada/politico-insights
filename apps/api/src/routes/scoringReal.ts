import { FastifyInstance } from "fastify";
import fetch from "node-fetch";

/**
 * Retorna o Top 5 geral de políticos (Deputados, Vereadores, Presidente etc.)
 * usando APIs públicas reais.
 */
export async function scoringRealRoutes(app: FastifyInstance) {
  app.get("/api/scoring/top5-geral", async (req, reply) => {
    try {
      // IDs reais da Câmara (Eduardo Bolsonaro, Kim Kataguiri, Guto Zacarias)
      const politicosBase = [
        { id: 204567, tipo: "deputado", score: 10 },
        { id: 204554, tipo: "deputado", score: 15 },
        { id: 220558, tipo: "deputado", score: 25 },
        // Amanda Vettorazzo - vereadora de SP
        {
          id: 999001,
          tipo: "vereadora",
          score: 30,
          dados: {
            nome: "Amanda Vettorazzo",
            siglaPartido: "NOVO",
            uf: "SP",
            urlFoto:
              "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png",
          },
        },
        // Lula (presidente)
        {
          id: 1,
          tipo: "presidente",
          score: 40,
          dados: {
            nome: "Luiz Inácio Lula da Silva",
            siglaPartido: "PT",
            uf: "BR",
            urlFoto:
              "https://upload.wikimedia.org/wikipedia/commons/6/64/Lula2023.jpg",
          },
        },
      ];

      // Buscar detalhes reais só para os deputados
      const enriched = await Promise.all(
        politicosBase.map(async (p) => {
          if (p.tipo !== "deputado") return p; // já tem dados prontos

          try {
            const resp = await fetch(
              `https://dadosabertos.camara.leg.br/api/v2/deputados/${p.id}`
            );
            const jd = await resp.json();
            return {
              ...p,
              dados: jd.dados
                ? {
                    nome: jd.dados.nome,
                    siglaPartido: jd.dados.siglaPartido,
                    uf: jd.dados.siglaUf,
                    urlFoto: jd.dados.urlFoto,
                  }
                : null,
            };
          } catch (err) {
            console.error("Erro ao buscar deputado:", p.id, err);
            return { ...p, dados: null };
          }
        })
      );

      return reply.send(enriched);
    } catch (err) {
      console.error("Erro geral:", err);
      return reply.status(500).send({ error: "Erro interno do servidor" });
    }
  });
}
