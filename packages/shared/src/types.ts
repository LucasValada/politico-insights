export type Casa = "CAMARA" | "SENADO";

export interface Politico {
  id: string;
  idExterno: string;
  nome: string;
  casa: Casa;
  partido?: string;
  uf?: string;
}

export type Despesa = {
  id: string;
  idExterno: string;
  politicoId: string;
  data: string;
  categoria: string;
  fornecedorCnpj?: string;
  valor: number;
  urlComprovante?: string;
};

export interface Score {
  politicoId: string;
  suspicionScore: number; // 0-100
  transparencyScore: number; // 0-100
  atualizadoEm: string; // ISO
}
