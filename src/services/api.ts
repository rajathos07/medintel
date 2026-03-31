import { supabase } from '../lib/supabase';

// ── Helper: call edge functions via raw fetch, bypassing supabase.functions.invoke()
// supabase.functions.invoke() sends the JWT signed with the OLD HS256 key,
// but your project's gateway now verifies with the NEW ECC (P-256) key → 401.
// Raw fetch with only the anon key works because --no-verify-jwt disables
// gateway-level JWT checking entirely on these two functions.
async function callEdgeFunction(functionName: string, body: unknown): Promise<any> {
  const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL as string;
  const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

  const url = `${supabaseUrl}/functions/v1/${functionName}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseAnon,
      // No Authorization header — function is deployed with --no-verify-jwt
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Edge function "${functionName}" failed (${res.status}): ${text}`);
  }

  return res.json();
}

// ── Health Records ─────────────────────────────────────────────────────────────

export const healthApi = {
  async getAll(_userId?: string) {
    const { data, error } = await supabase
      .from('health_records')
      .select('*')
      .order('recorded_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async create(_userId: string, record: any) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    const { error } = await supabase
      .from('health_records')
      .insert([{ ...record, user_id: user.id }]);
    if (error) throw error;
    return null;
  },

  async update(id: string, record: any) {
    const { error } = await supabase
      .from('health_records')
      .update(record)
      .eq('id', id);
    if (error) throw error;
    return null;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('health_records')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  async getRecent(limit: number = 7) {
    const { data, error } = await supabase
      .from('health_records')
      .select('*')
      .order('recorded_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data;
  },
};

// ── Disease Detection ──────────────────────────────────────────────────────────

export const diseaseApi = {
  async detect(_userId: string, symptoms: string[]) {
    // Use raw fetch — supabase.functions.invoke() sends a JWT signed with the
    // old HS256 key, which the new ECC gateway rejects with 401.
    return callEdgeFunction('disease-detection', { symptoms });
  },

  async saveAssessment(symptoms: string[], result: any) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    const { data, error } = await supabase
      .from('disease_assessments')
      .insert([{
        user_id: user.id,
        symptoms,
        detected_diseases: result.diseases || [],
        recommendations: result.recommendations,
        severity: result.severity || 'Medium',
      }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getHistory() {
    const { data, error } = await supabase
      .from('disease_assessments')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
};

// ── Risk Assessment ────────────────────────────────────────────────────────────

export const riskAssessmentAPI = {
  async assess(formData: any) {
    const payload = {
      demographics:  formData.demographics,
      medicalHistory: formData.medicalHistory,
      lifestyle:     formData.lifestyle,
      currentVitals: formData.vitals ?? formData.currentVitals,
    };
    // Use raw fetch — same ECC key mismatch issue as disease-detection
    return callEdgeFunction('risk-assessment', payload);
  },

  async saveAssessment(formData: any, result: any) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    const { data, error } = await supabase
      .from('risk_assessments')
      .insert([{
        user_id:         user.id,
        medical_history: formData.medicalHistory,
        lifestyle_data:  formData.lifestyle,
        current_vitals:  formData.vitals ?? formData.currentVitals,
        risk_score:      result.riskScore,
        risk_level:      result.riskLevel,
        ai_analysis:     result.analysis,
        recommendations: result.recommendations,
      }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getHistory() {
    const { data, error } = await supabase
      .from('risk_assessments')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
};