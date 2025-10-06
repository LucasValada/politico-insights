import { FastifyInstance } from "fastify";

export async function mockRoutes(app: FastifyInstance) {
  app.post("/api/scoring/mock", async (req, reply) => {
    const { politicoId } = req.body as { politicoId?: number };

    if (!politicoId) {
      return reply.status(400).send({ error: "politicoId obrigatório" });
    }

    // 🔸 Base mock de políticos
    const politicos = [
      {
        id: 1,
        nome: "Kim Kataguiri",
        partido: "UNIÃO",
        estado: "SP",
        imagem:
          "https://upload.wikimedia.org/wikipedia/commons/f/fc/Kim_Kataguiri_2023_%28cropped%29.jpg",
      },
      {
        id: 2,
        nome: "Amanda Vettorazzo",
        partido: "NOVO",
        estado: "SP",
        imagem:
          "https://upload.wikimedia.org/wikipedia/commons/2/29/Amanda_Vettorazzo_2023.jpg",
      },
      {
        id: 3,
        nome: "Guto Zacarias",
        partido: "PODEMOS",
        estado: "SP",
        imagem:
          "https://upload.wikimedia.org/wikipedia/commons/b/b2/Guto_Zacarias_2023.jpg",
      },
    ];

    // Seleciona o político com base no ID enviado
    const politico = politicos.find((p) => p.id === politicoId);

    // Se não encontrar, devolve erro amigável
    if (!politico) {
      return reply.status(404).send({ error: "Político não encontrado" });
    }

    // Retorna o mock completo
    return reply.send({
      aviso: "Indícios baseados em dados públicos. Não é prova de crime.",
      indicios: {
        picoP95: politicoId === 1, // exemplo de variação
        categoriasSensiveisAlta: politicoId !== 2,
        notasArredondadas: true,
        frequenciaAtipica: politicoId === 3,
        semComprovante: false,
        outros: false,
      },
      metrics: {
        pctComprovantesValidos: 0.92,
        concentracaoTopCnpj: 0.87,
      },
      scores: {
        suspicionScore: 35 + politicoId * 5,
        transparencyScore: 80 - politicoId * 5,
      },
      politico,
    });
  });
}
