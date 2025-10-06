import Fastify from "fastify";
import cors from "@fastify/cors";
import { scoringRealRoutes } from "./routes/scoringReal";

const app = Fastify({ logger: true });

await app.register(cors, { origin: true });
await app.register(scoringRealRoutes);

app.get("/health", async () => ({ ok: true }));

app.listen({ port: 3333, host: "0.0.0.0" }).then(() => {
  console.log("✅ API running on http://localhost:3333");
});
