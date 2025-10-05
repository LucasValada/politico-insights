import { FastifyInstance } from "fastify";
import {
  deriveIndiciosFromDespesas,
  computeSuspicionScore,
  computeTransparencyScore,
} from "@pi/shared";
import type { Despesa } from "@pi/shared";
import { z } from "zod"; // <-- novo

// Schema de validação (evita payload quebrado)
const DespesaSchema = z.object({
  id: z.string().min(1),
  idExterno: z.string().min(1),
  politicoId: z.string().min(1),
  data: z.string().min(10), // depois podemos trocar por z.string().datetime()
  categoria: z.string().min(1),
  fornecedorCnpj: z.string().optional(),
  valor: z.number().nonnegative(),
  urlComprovante: z.string().url().optional().or(z.literal("")),
});

const BodySchema = z.object({
  despesas: z.array(DespesaSchema).min(1).max(5000),
});

export async function scoringRoutes(app: FastifyInstance) {
  app.post("/api/scoring/mock", async (req, reply) => {
    // valida/parseia
    const parsed = BodySchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.code(400).send({
        error: "Bad Request",
        message: "Payload inválido",
        issues: parsed.error.flatten(),
      });
    }
    const body = parsed.data as { despesas: Despesa[] };

    // 1) Indícios
    const indicios = deriveIndiciosFromDespesas(body.despesas);

    // 2) Métricas auxiliares p/ TransparencyScore
    const total = body.despesas.reduce((a, d) => a + d.valor, 0);
    const byCnpj = new Map<string, number>();
    for (const d of body.despesas) {
      if (!d.fornecedorCnpj) continue;
      byCnpj.set(
        d.fornecedorCnpj,
        (byCnpj.get(d.fornecedorCnpj) || 0) + d.valor
      );
    }
    const top = Math.max(0, ...byCnpj.values());
    const concentracaoTopCnpj = total > 0 ? top / total : 0;

    const pctComprovantesValidos =
      body.despesas.length > 0
        ? body.despesas.filter(
            (d) => d.urlComprovante && d.urlComprovante.length > 5
          ).length / body.despesas.length
        : 0;

    // 3) Scores
    const suspicionScore = computeSuspicionScore(indicios);
    const transparencyScore = computeTransparencyScore({
      pctComprovantesValidos,
      concentracaoTopCnpj,
    });

    return {
      aviso: "Indícios baseados em dados públicos. Não é prova de crime.",
      indicios,
      metrics: { pctComprovantesValidos, concentracaoTopCnpj },
      scores: { suspicionScore, transparencyScore },
    };
  });
}
