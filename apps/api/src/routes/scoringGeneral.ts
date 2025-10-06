import { FastifyInstance } from "fastify";
import fetch from "node-fetch";

export async function scoringGeralRoutes(app: FastifyInstance) {
  app.get("/api/scoring/top5-geral", async (req, reply) => {
    const politicos = [
      { id: 204567, tipo: "deputado", score: 10 }, // Eduardo Bolsonaro
      { id: 204554, tipo: "deputado", score: 15 }, // Kim Kataguiri
      { id: 220558, tipo: "deputado", score: 25 }, // Guto Zacarias
      { id: 999001, tipo: "vereadora", score: 30 }, // Amanda Vettorazzo
      { id: 1, tipo: "presidente", score: 40 }, // Lula
    ];

    const enriched = await Promise.all(
      politicos.map(async (p) => {
        try {
          let dados: any;

          if (p.tipo === "deputado") {
            const resp = await fetch(
              `https://dadosabertos.camara.leg.br/api/v2/deputados/${p.id}`
            );
            const jd = await resp.json();
            dados = jd.dados;
          } else if (p.tipo === "senador") {
            const resp = await fetch(
              `https://legis.senado.leg.br/dadosabertos/senador/${p.id}`
            );
            const jd = await resp.json();
            dados =
              jd.DetalheParlamentar?.Parlamentar?.IdentificacaoParlamentar ||
              null;
          } else if (p.tipo === "presidente") {
            dados = {
              nome: "Luiz Inácio Lula da Silva",
              siglaPartido: "PT",
              uf: "BR",
              urlFoto:
                "https://www.gov.br/planalto/pt-br/presidencia/o-presidente/lula.png",
            };
          } else {
            dados = {
              nome: "Amanda Vettorazzo",
              siglaPartido: "NOVO",
              uf: "SP",
              urlFoto:
                "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png",
            };
          }

          return { ...p, dados };
        } catch (err) {
          console.error("Erro ao buscar dados para", p.id);
          return { ...p, dados: null };
        }
      })
    );

    return reply.send(enriched);
  });
}
