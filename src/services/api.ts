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
      demographics:   formData.demographics,
      medicalHistory: formData.medicalHistory,
      lifestyle:      formData.lifestyle,
      currentVitals:  formData.vitals ?? formData.currentVitals,
    };
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

// ── Reminders ─────────────────────────────────────────────────────────────────

export type ReminderType = 'medication' | 'hydration' | 'exercise' | 'appointment';

export interface Reminder {
  id: string;
  user_id: string;
  type: ReminderType;
  message: string;
  scheduled_time: string;
  is_recurring: boolean;
  recurrence_rule: string;
  is_completed: boolean;
  created_at: string;
}

export const remindersApi = {
  async getAll(): Promise<Reminder[]> {
    const { data, error } = await supabase
      .from('reminders')
      .select('*')
      .order('scheduled_time', { ascending: true });
    if (error) throw error;
    return data ?? [];
  },

  async create(reminder: Omit<Reminder, 'id' | 'user_id' | 'created_at'>): Promise<Reminder> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    const { data, error } = await supabase
      .from('reminders')
      .insert([{ ...reminder, user_id: user.id }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async toggleComplete(id: string, is_completed: boolean): Promise<void> {
    const { error } = await supabase
      .from('reminders')
      .update({ is_completed })
      .eq('id', id);
    if (error) throw error;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('reminders')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  async getByType(type: ReminderType): Promise<Reminder[]> {
    const { data, error } = await supabase
      .from('reminders')
      .select('*')
      .eq('type', type)
      .order('scheduled_time', { ascending: true });
    if (error) throw error;
    return data ?? [];
  },

  async getPending(): Promise<Reminder[]> {
    const { data, error } = await supabase
      .from('reminders')
      .select('*')
      .eq('is_completed', false)
      .order('scheduled_time', { ascending: true });
    if (error) throw error;
    return data ?? [];
  },
};

// ── AI Companion Chat ──────────────────────────────────────────────────────────

export interface CompanionMessage {
  id: string;
  user_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export const companionApi = {
  // Call the ai-companion Supabase Edge Function
  async chat(messages: { role: 'user' | 'assistant'; content: string }[]): Promise<string> {
    const result = await callEdgeFunction('ai-companion', { messages });
    return result.reply as string;
  },

  // Persist a message to companion_chats table
  async saveMessage(role: 'user' | 'assistant', content: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    const { error } = await supabase
      .from('companion_chats')
      .insert([{ user_id: user.id, role, content }]);
    if (error) throw error;
  },

  // Load last N messages for conversation context
  async getHistory(limit: number = 20): Promise<CompanionMessage[]> {
    const { data, error } = await supabase
      .from('companion_chats')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    // Return chronological order for display
    return (data ?? []).reverse();
  },

  // Clear all chat history for the current user
  async clearHistory(): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    const { error } = await supabase
      .from('companion_chats')
      .delete()
      .eq('user_id', user.id);
    if (error) throw error;
  },
};

// ── Emergency / SOS ───────────────────────────────────────────────────────────

export interface SosEvent {
  id: string;
  user_id: string;
  symptoms: string[];
  latitude: number | null;
  longitude: number | null;
  notified_contact: string | null;
  resolved: boolean;
  created_at: string;
}

export const sosApi = {
  // Log an SOS event and trigger the edge function to notify the caregiver
  async trigger(symptoms: string[], emergencyContact: string): Promise<SosEvent> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Try to get the user's GPS coordinates
    let latitude: number | null = null;
    let longitude: number | null = null;
    try {
      const pos = await new Promise<GeolocationPosition>((res, rej) =>
        navigator.geolocation.getCurrentPosition(res, rej, { timeout: 5000 })
      );
      latitude  = pos.coords.latitude;
      longitude = pos.coords.longitude;
    } catch {
      // Location permission denied — proceed without it
    }

    // Save SOS event to database
    const { data, error } = await supabase
      .from('sos_events')
      .insert([{
        user_id:          user.id,
        symptoms,
        latitude,
        longitude,
        notified_contact: emergencyContact,
        resolved:         false,
      }])
      .select()
      .single();
    if (error) throw error;

    // Call the edge function to send the actual notification
    try {
      await callEdgeFunction('sos-notify', {
        userId:           user.id,
        emergencyContact,
        symptoms,
        latitude,
        longitude,
      });
    } catch (e) {
      // Edge function failed, but we still logged the event — don't crash the UI
      console.error('SOS notification edge function failed:', e);
    }

    return data;
  },

  async getHistory(): Promise<SosEvent[]> {
    const { data, error } = await supabase
      .from('sos_events')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  async resolve(id: string): Promise<void> {
    const { error } = await supabase
      .from('sos_events')
      .update({ resolved: true })
      .eq('id', id);
    if (error) throw error;
  },
};