let qvacInitialized = false
let qvacModel: unknown = null

const MODEL_ID = "LLAMA_3_2_1B_INST_Q4_0"

export async function initQvac(): Promise<void> {
  if (qvacInitialized) return
  try {
    const QvacSdk = await import("@qvac/sdk")
    qvacModel = await (QvacSdk as any).loadModel(MODEL_ID)
    qvacInitialized = true
    console.log("[QVAC] Model loaded:", MODEL_ID)
  } catch (err) {
    console.warn("[QVAC] Running in demo mode (SDK not available):", err)
    qvacInitialized = true
  }
}

export async function generateChecklist(matchType: string, venue: string): Promise<string> {
  const prompt = `Generate a concise matchday checklist for a ${matchType} at ${venue}. Include items like tickets, cash, phone charger, team scarf, water, snacks, rain gear, and any venue-specific items. Return a numbered list.`
  return await runLocalInference(prompt)
}

export async function translatePhrase(phrase: string, targetLanguage: string): Promise<string> {
  const prompt = `Translate the following phrase into ${targetLanguage} for a football fan traveling abroad. Only return the translation, no explanation: "${phrase}"`
  return await runLocalInference(prompt)
}

export async function answerVenueQuestion(question: string, venueContext: string): Promise<string> {
  const prompt = `You are a local guide for football fans. Based on the following venue context, answer the question concisely.\n\nContext: ${venueContext}\n\nQuestion: ${question}\n\nAnswer:`
  return await runLocalInference(prompt)
}

export async function generateSafetyTips(venue: string, city: string): Promise<string> {
  const prompt = `List 5 safety tips for football fans visiting ${venue} in ${city}. Include advice about crowd safety, local customs, emergency contacts, and areas to avoid. Return a numbered list.`
  return await runLocalInference(prompt)
}

export async function summarizeGroupPlan(tripData: string): Promise<string> {
  const prompt = `Summarize the following matchday trip plan for a group of football fans in 2-3 sentences. Highlight the key details:\n\n${tripData}`
  return await runLocalInference(prompt)
}

export async function understandTicketInfo(imageDescription: string): Promise<string> {
  const prompt = `Based on this description of a football ticket or venue sign, extract and summarize the key information (seat, gate, time, rules):\n\n${imageDescription}`
  return await runLocalInference(prompt)
}

async function runLocalInference(prompt: string): Promise<string> {
  const model = qvacModel as any
  if (model) {
    try {
      const result = await model.completion(prompt, { maxTokens: 512, temperature: 0.7 })
      return result.text
    } catch (err) {
      console.error("[QVAC] Inference error, using fallback:", err)
    }
  }
  return getSimulatedResponse(prompt)
}

function getSimulatedResponse(prompt: string): string {
  const lower = prompt.toLowerCase()
  if (lower.includes("checklist")) {
    return "1. Match tickets (digital or printed)\n2. Phone + portable charger\n3. Team scarf or jersey\n4. Cash (local currency) + USDT wallet\n5. Water bottle (check venue policy)\n6. Snacks for the journey\n7. Rain jacket or umbrella\n8. ID / passport for away matches\n9. Camera for matchday memories\n10. First aid basics (painkillers, bandages)"
  }
  if (lower.includes("translate") || lower.includes("say")) {
    return "[Translated phrase would appear here via QVAC local model]"
  }
  if (lower.includes("safety")) {
    return "1. Stay with your group in crowded areas\n2. Know the location of the nearest hospital\n3. Avoid wearing rival colors near the stadium\n4. Keep valuables in a front pocket\n5. Save local emergency numbers on your phone"
  }
  if (lower.includes("summarize")) {
    return "Your group is heading to the match together. Meeting at the designated point before heading to the venue. All expenses will be tracked and split via the shared fund. Make sure everyone has their tickets and the meetup location saved offline."
  }
  return "I can help with matchday planning, translations, venue Q&A, and safety tips. All processing happens locally on your device for privacy."
}

export function cleanup(): void {
  qvacModel = null
  qvacInitialized = false
}
