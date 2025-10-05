import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import { scoringRoutes } from "./routes/scoring";

const app = Fastify({ logger: true });

await app.register(cors, { origin: true });
await app.register(scoringRoutes);

app.get("/health", async () => ({ ok: true, ts: new Date().toISOString() }));

const port = Number(process.env.PORT || 3333);
app.listen({ port, host: "0.0.0.0" }).then(() => {
  console.log(`API running on http://localhost:${port}`);
});
