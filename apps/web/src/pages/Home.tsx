import { ScoringTest } from "../components/ScoringTest";
import { TopFive } from "../components/topFive";

/**
 * Página inicial do aplicativo
 * Contém os componentes ScoringTest e Top5Scoring
 * @returns {JSX.Element} Elemento JSX da página
 */
export function Home() {
  return (
    <>
      <ScoringTest />
      <TopFive />
    </>
  );
}
