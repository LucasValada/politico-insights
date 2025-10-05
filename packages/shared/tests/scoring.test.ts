import { describe, it, expect } from 'vitest';
import {
  computeSuspicionScore,
  computeTransparencyScore,
} from '../src/scoring';

describe('scoring', () => {
  it('limita SuspicionScore em 100', () => {
    const s = computeSuspicionScore({
      picoP95: true,
      altaConcentracaoCnpj: true,
      categoriasSensiveisAlta: true,
      notasArredondadas: true,
      frequenciaAtipica: true,
      semComprovante: true,
      outros: true,
    });
    expect(s).toBe(100);
  });

  it('calcula TransparencyScore (comprovantes + diversidade)', () => {
    const t = computeTransparencyScore({
      pctComprovantesValidos: 0.8,  // 0.8 * 60 = 48
      concentracaoTopCnpj: 0.5,     // (1 - 0.5) * 40 = 20
    });
    expect(t).toBe(68);
  });
});
