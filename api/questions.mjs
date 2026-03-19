import { neon } from "@neondatabase/serverless";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

const normalizeQuestion = (question) => ({
  id: question.id,
  title: question.title,
  promptHtml: question.prompt_html ?? "",
  options:
    typeof question.options_json === "string"
      ? JSON.parse(question.options_json)
      : question.options_json ?? [],
  answer: {
    id: question.answer_id,
    detailHtml: question.answer_detail_html ?? "",
  },
});

export default async function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return response.status(405).json({ error: "Method Not Allowed" });
  }

  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

  if (!connectionString) {
    return response.status(500).json({
      error: "DATABASE_URL is not configured",
    });
  }

  try {
    const sql = neon(connectionString);
    const requestedLimit = Number.parseInt(request.query?.limit ?? DEFAULT_LIMIT, 10);
    const limit = Number.isNaN(requestedLimit)
      ? DEFAULT_LIMIT
      : Math.min(Math.max(requestedLimit, 1), MAX_LIMIT);
    const result = await sql`
      select *
      from questions
      order by random()
      limit ${limit}
    `;

    return response.status(200).json({
      ok: true,
      count: result.length,
      data: result.map(normalizeQuestion),
    });
  } catch (error) {
    console.error("Neon query failed", error);

    return response.status(500).json({
      error: "Database query failed",
    });
  }
}
