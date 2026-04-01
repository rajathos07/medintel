// supabase/functions/ai-companion/index.ts
// Deploy: supabase functions deploy ai-companion --no-verify-jwt
//
// Requires env var in Supabase dashboard → Edge Functions → Manage secrets:
//   GROQ_API_KEY=your_groq_api_key  (get free key at console.groq.com)

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `You are CARE-AI, a warm and compassionate AI health companion built into the MedIntel platform, specifically designed for elderly users.

Your personality:
- Patient, kind, and encouraging at all times
- Speak in short, clear sentences — never use medical jargon without explaining it
- Address the user warmly, like a trusted friend who happens to know about health

Your responsibilities:
- Provide simple, easy-to-understand health tips and daily wellness advice
- Help with medication information (always remind users to consult their doctor)
- Offer emotional support and friendly conversation when the user feels lonely or anxious
- Suggest gentle exercises appropriate for elderly users (walking, stretching, chair yoga)
- Answer nutrition, hydration, and sleep questions
- Help users understand their MedIntel health records in plain language

CRITICAL SAFETY RULES:
- If the user mentions chest pain, difficulty breathing, sudden numbness, severe headache, or any stroke symptoms → IMMEDIATELY tell them to call 112 or go to the emergency room. Do not continue the conversation until they acknowledge this.
- Never diagnose. Always say "please consult your doctor" for specific medical decisions.
- Never recommend stopping or changing medications without a doctor's approval.
- Keep all responses under 150 words — elderly users prefer concise, easy-to-read answers.`;

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS });
  }

  try {
    const { messages } = await req.json() as {
      messages: { role: 'user' | 'assistant'; content: string }[];
    };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'messages array is required' }),
        { status: 400, headers: { ...CORS, 'Content-Type': 'application/json' } }
      );
    }

    const groqKey = Deno.env.get('GROQ_API_KEY');
    if (!groqKey) {
      return new Response(
        JSON.stringify({ error: 'GROQ_API_KEY not configured' }),
        { status: 500, headers: { ...CORS, 'Content-Type': 'application/json' } }
      );
    }

    // ✅ Using llama-3.3-70b-versatile — current active Groq model (April 2026)
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 300,
        temperature: 0.7,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages,
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Groq API error (${response.status}): ${err}`);
    }

    const groqData = await response.json();
    const reply = groqData.choices?.[0]?.message?.content
      ?? 'I apologize, I could not generate a response. Please try again.';

    return new Response(
      JSON.stringify({ reply }),
      { headers: { ...CORS, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('ai-companion error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...CORS, 'Content-Type': 'application/json' } }
    );
  }
});