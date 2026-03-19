const fs = require("fs");
const path = require("path");

const inputPath = path.join(__dirname, "..", "public", "questions.json");
const outputDir = path.join(__dirname, "..", "imports");
const outputPath = path.join(outputDir, "questions.csv");

const { questions } = JSON.parse(fs.readFileSync(inputPath, "utf8"));

const columns = [
  "id",
  "title",
  "prompt_html",
  "options_json",
  "answer_id",
  "answer_detail_html",
];

const escapeCsv = (value) => {
  const stringValue = String(value ?? "");
  return `"${stringValue.replace(/"/g, '""')}"`;
};

const rows = questions.map((question) =>
  [
    question.id,
    question.title,
    question.promptHtml,
    JSON.stringify(question.options),
    question.answer.id,
    question.answer.detailHtml,
  ]
    .map(escapeCsv)
    .join(","),
);

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(outputPath, `${columns.join(",")}\n${rows.join("\n")}\n`);

console.log(`Wrote ${questions.length} questions to ${outputPath}`);
