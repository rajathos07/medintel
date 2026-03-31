import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// ─────────────────────────────────────────────────────────────────────────────
// DEPLOY WITH:  supabase functions deploy risk-assessment --no-verify-jwt
// ─────────────────────────────────────────────────────────────────────────────

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { demographics, medicalHistory, lifestyle, currentVitals } = body;

    if (!demographics || !medicalHistory || !lifestyle || !currentVitals) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const groqApiKey = Deno.env.get("GROQ_API_KEY");
    if (!groqApiKey) {
      return new Response(
        JSON.stringify({ error: "GROQ_API_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const prompt = `You are a medical AI assistant. Analyze this patient data and return ONLY valid JSON, no markdown, no extra text:

Patient:
- Age: ${demographics.age}, Gender: ${demographics.gender}
- Past conditions: ${medicalHistory.pastConditions?.join(", ") || "none"}
- Family history: ${medicalHistory.familyHistory?.join(", ") || "none"}
- Medications: ${medicalHistory.medications?.join(", ") || "none"}
- Exercise: ${lifestyle.exercise}, Diet: ${lifestyle.diet}
- Smoking: ${lifestyle.smoking}, Alcohol: ${lifestyle.alcohol}
- Sleep: ${lifestyle.sleepHours}hrs, Stress: ${lifestyle.stressLevel}
- Heart rate: ${currentVitals.heartRate}bpm, BP: ${currentVitals.bloodPressure}
- Temp: ${currentVitals.temperature}C, O2: ${currentVitals.oxygenLevel}%
- Glucose: ${currentVitals.glucose}mg/dL, Weight: ${currentVitals.weight}kg, BMI: ${currentVitals.bmi}

Return this exact JSON structure:
{
  "riskScore": 45,
  "riskLevel": "Medium",
  "analysis": "Overall analysis paragraph here",
  "concerns": ["concern 1", "concern 2"],
  "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"]
}`;

    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${groqApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 800,
      }),
    });

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      return new Response(
        JSON.stringify({ error: "Groq API error", details: errorText }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const groqData = await groqResponse.json();
    const content = groqData.choices[0]?.message?.content || "{}";

    let result;
    try {
      result = JSON.parse(content);
    } catch {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      result = jsonMatch ? JSON.parse(jsonMatch[0]) : { error: "Failed to parse AI response" };
    }

    if (result.riskScore && typeof result.riskScore === "string") {
      result.riskScore = parseInt(result.riskScore, 10);
    }

    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Internal server error", message: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});