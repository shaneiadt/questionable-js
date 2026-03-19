const fs = require("fs");
const path = require("path");

const questionsPath = path.join(__dirname, "..", "public", "questions.json");

const source = JSON.parse(fs.readFileSync(questionsPath, "utf8"));

const escapeHtml = (value) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const normalizeTitle = (title) => title.replace(/^\d+\.\s*/, "").trim();

const stripChoicePrefix = (value) =>
  value.replace(/^\s*([A-E])\s*:\s*/, "").trim();

const parseAnswerId = (value) => {
  const match = value.match(/Answer:\s*([A-E])/i);

  return match ? match[1].toUpperCase() : null;
};

const extractAnswerDetailHtml = (value) => {
  if (!value) return "";

  const headingMatch = value.match(
    /<h4[^>]*>[\s\S]*?Answer:\s*[A-E][\s\S]*?<\/h4>/i,
  );

  if (headingMatch) {
    return value.replace(headingMatch[0], "").trim();
  }

  const textMatch = value.match(/Answer:\s*[A-E]\s*-\s*([\s\S]*)/i);

  if (textMatch) {
    return `<p>${escapeHtml(textMatch[1].trim())}</p>`;
  }

  return value.trim();
};

const listHtmlToOptions = (html) => {
  const matches = [...html.matchAll(/<li[^>]*>\s*([A-E])\s*:\s*([\s\S]*?)<\/li>/gi)];

  return matches.map(([, id, content]) => ({
    id: id.toUpperCase(),
    content: content.replace(/<[^>]+>/g, "").trim(),
  }));
};

const textArrayToOptions = (values) =>
  values.map((value) => {
    const match = value.match(/^\s*([A-E])\s*:\s*([\s\S]*)$/);

    return {
      id: match ? match[1].toUpperCase() : "",
      content: stripChoicePrefix(value),
    };
  });

const normalizeQuestion = (question, index) => {
  let promptHtml = typeof question.code === "string" ? question.code.trim() : "";
  let options = Array.isArray(question.options)
    ? textArrayToOptions(question.options)
    : [];
  let answerSource = question.detail || "";

  if (Array.isArray(question.code)) {
    options = textArrayToOptions(question.code);
    promptHtml = "";
  }

  if (index === 12 && typeof question.options === "string") {
    answerSource = question.options;
  }

  if (index === 13 && typeof question.options === "string") {
    answerSource = question.options;
  }

  if (index === 25 && Array.isArray(question.options) && question.options.length === 1) {
    answerSource = question.options[0];
  }

  if (index === 38 && typeof question.code === "string" && typeof question.options === "string") {
    promptHtml = "";
    options = listHtmlToOptions(question.code);
    answerSource = question.options;
  }

  if (index === 56 && typeof question.code === "string" && typeof question.options === "string") {
    promptHtml = `${question.code.trim()}\n${question.options.trim()}`.trim();
    options = listHtmlToOptions(question.detail || "");
    answerSource =
      "<h4>Answer: C</h4><p>Imported bindings are read-only, so reassigning the default import throws an error.</p>";
  }

  if (!options.length && typeof question.options === "string") {
    options = listHtmlToOptions(question.options);
  }

  const answerId = parseAnswerId(answerSource);

  if (!answerId) {
    throw new Error(`Unable to parse answer for question ${index + 1}`);
  }

  return {
    id: `q${index + 1}`,
    title: normalizeTitle(question.title),
    promptHtml,
    options,
    answer: {
      id: answerId,
      detailHtml: extractAnswerDetailHtml(answerSource),
    },
  };
};

const normalized = {
  questions: source.questions.map(normalizeQuestion),
};

fs.writeFileSync(questionsPath, `${JSON.stringify(normalized, null, 2)}\n`);
