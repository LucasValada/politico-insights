import { FastifyInstance } from "fastify";
import { computeSuspicionScore, computeTransparencyScore } from "@pi/shared";

export async function scoringRoutes(app: FastifyInstance) {
  app.post("/api/scoring/mock", async (request, reply) => {
    const body = request.body as any;

    const suspicionScore = computeSuspicionScore(body.indicios);
    const transparencyScore = computeTransparencyScore(body.metrics);

    return {
      aviso: "Indícios baseados em dados públicos. Não é prova de crime.",
      indicios: body.indicios,
      metrics: body.metrics,
      scores: { suspicionScore, transparencyScore },
    };
  });
}
