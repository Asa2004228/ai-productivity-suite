import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-3.7-flash";

const EmailInput = z.object({
  kind: z.literal("email"),
  context: z.string().min(1),
  recipient: z.string(),
  tone: z.enum(["Formal", "Friendly", "Persuasive"]),
  length: z.enum(["Short", "Medium", "Detailed"]),
});

const PlannerInput = z.object({
  kind: z.literal("planner"),
  horizon: z.enum(["Today", "Tomorrow", "This Week"]),
  tasks: z.array(
    z.object({
      title: z.string(),
      deadline: z.string().optional(),
      priority: z.string().optional(),
      estimate: z.string().optional(),
    }),
  ),
  notes: z.string().optional(),
});

const ResearchInput = z.object({
  kind: z.literal("research"),
  mode: z.enum(["topic", "text"]),
  content: z.string().min(1),
});

const Input = z.discriminatedUnion("kind", [EmailInput, PlannerInput, ResearchInput]);
export type AIInput = z.infer<typeof Input>;

export type EmailResult = { subject: string; body: string };
export type PlannerResult = {
  summary: string;
  schedule: { time: string; task: string; priority: string; duration: string; why: string }[];
};
export type ResearchResult = {
  executiveSummary: string;
  keyPoints: string[];
  keyInsights: string[];
  recommendations: string[];
  furtherQuestions: string[];
};

function buildPrompt(data: AIInput): { system: string; user: string } {
  if (data.kind === "email") {
    return {
      system:
        "You are an expert workplace communication assistant. Write original, context-specific business emails. Never use filler placeholders like [Your Name] unless the sender name is unknown, and never reuse template boilerplate. Return strict JSON only.",
      user: `Write a professional email.
Recipient: ${data.recipient || "unspecified"}
Tone: ${data.tone}
Length: ${data.length} (Short = under 90 words, Medium = 120-180 words, Detailed = 250-350 words)
Purpose and context from the user: """${data.context}"""

Base every sentence on the user's actual context above. Return JSON: {"subject": string, "body": string}. Body uses plain text with line breaks.`,
    };
  }
  if (data.kind === "planner") {
    return {
      system:
        "You are an expert productivity planner. Analyse the user's real tasks and build a realistic, personalised schedule ordered by urgency, deadline, priority and workload. Return strict JSON only.",
      user: `Plan horizon: ${data.horizon}
Tasks (JSON): ${JSON.stringify(data.tasks)}
Extra notes: ${data.notes || "none"}

Sequence these exact tasks (do not invent unrelated ones, but you may add short breaks or buffers). Return JSON:
{"summary": string, "schedule": [{"time": string, "task": string, "priority": string, "duration": string, "why": string}]}
"why" is one short sentence explaining the placement.`,
    };
  }
  return {
    system:
      "You are a rigorous research analyst. Analyse only the user's provided material or topic and produce specific, non-generic analysis. Return strict JSON only.",
    user: `Mode: ${data.mode === "topic" ? "Research topic" : "Pasted article/text to analyse"}
Input: """${data.content}"""

Return JSON:
{"executiveSummary": string, "keyPoints": string[], "keyInsights": string[], "recommendations": string[], "furtherQuestions": string[]}
Each list has 4-6 concrete, specific items grounded in the input.`,
  };
}

function extractJson(text: string): unknown {
  const cleaned = text.replace(/```json/gi, "```").split("```").join("\n").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("AI returned an unexpected format.");
  return JSON.parse(cleaned.slice(start, end + 1));
}

export const runAI = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => Input.parse(input))
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("AI is not configured. Add an AI API key to enable generation.");

    const { system, user } = buildPrompt(data);

    const res = await fetch(GATEWAY, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Lovable-API-Key": key },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      if (res.status === 429)
        throw new Error("AI is rate limited right now. Please try again in a moment.");
      if (res.status === 402)
        throw new Error("AI credits are exhausted. Add credits to continue generating.");
      throw new Error(`AI request failed (${res.status}). ${detail.slice(0, 200)}`);
    }

    const json = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = json.choices?.[0]?.message?.content ?? "";
    return extractJson(content) as EmailResult | PlannerResult | ResearchResult;
  });
