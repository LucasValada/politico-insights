import type { Despesa } from "./types";

export function deriveIndiciosFromDespesas(despesas: Despesa[]) {
  return {
    picoP95: despesas.some((d) => d.valor > 1000),
    categoriasSensiveisAlta: despesas.some(
      (d) =>
        d.categoria.toLowerCase().includes("combustível") ||
        d.categoria.toLowerCase().includes("locação") ||
        d.categoria.toLowerCase().includes("aluguel")
    ),
    notasArredondadas: despesas.some((d) => d.valor % 1 === 0),
    frequenciaAtipica: despesas.length > 50,
    semComprovante: despesas.some((d) => !d.urlComprovante),
    outros: false,
  };
}

export function computeSuspicionScore(indicios: {
  picoP95?: boolean;
  categoriasSensiveisAlta?: boolean;
  notasArredondadas?: boolean;
  frequenciaAtipica?: boolean;
  semComprovante?: boolean;
  outros?: boolean;
}) {
  let score = 0;
  if (indicios.picoP95) score += 25;
  if (indicios.categoriasSensiveisAlta) score += 25;
  if (indicios.notasArredondadas) score += 15;
  if (indicios.frequenciaAtipica) score += 20;
  if (indicios.semComprovante) score += 15;
  return Math.min(score, 100);
}

export function computeTransparencyScore(opts: {
  pctComprovantesValidos: number; // 0..1
  concentracaoTopCnpj: number; // 0..1
}) {
  const score =
    opts.pctComprovantesValidos * 70 + (1 - opts.concentracaoTopCnpj) * 30;
  return Math.round(score);
}
