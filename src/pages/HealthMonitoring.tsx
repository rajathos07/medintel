import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Save, X, Heart, Activity, Thermometer, Wind, Droplet, TrendingUp, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface HealthRecord { 
  id: string; 
  user_id: string; 
  heart_rate: number|null; 
  blood_pressure: string|null; 
  temperature: number|null; 
  oxygen_level: number|null; 
  glucose: number|null; 
  weight: number|null; 
  notes: string|null; 
  recorded_at: string; 
  created_at?: string;
}

const STYLE = `@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap');
.gbg{background-image:linear-gradient(rgba(16,185,129,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(16,185,129,0.03) 1px,transparent 1px);background-size:60px 60px;}
.cc::before,.cc::after{content:'';position:absolute;width:12px;height:12px;border-color:#10b981;border-style:solid;}
.cc::before{top:0;left:0;border-width:2px 0 0 2px;} .cc::after{bottom:0;right:0;border-width:0 2px 2px 0;}
.inp:focus{box-shadow:0 0 0 1px #10b981,0 0 15px rgba(16,185,129,0.2);}`;

export default function HealthMonitoring() {
  const { user } = useAuth();
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string|null>(null);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [form, setForm] = useState({ 
    heart_rate:'', 
    blood_pressure:'', 
    temperature:'', 
    oxygen_level:'', 
    glucose:'', 
    weight:'', 
    notes:'' 
  });

  useEffect(() => { 
    if (user?.id) {
      load(); 
    }
  }, [user?.id]);

  const load = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    setError('');
    try { 
      const { data, error: fetchError } = await supabase
        .from('health_records')
        .select('*')
        .eq('user_id', user.id)
        .order('recorded_at', { ascending: false });
      
      if (fetchError) {
        throw new Error(fetchError.message);
      }
      
      setRecords(data || []); 
    }
    catch(e) { 
      const errMsg = e instanceof Error ? e.message : 'Failed to load records';
      setError(`⚠️ ${errMsg}`);
      console.error('Load error:', e); 
    }
    finally { 
      setLoading(false); 
    }
  };

  const reset = () => { 
    setForm({ heart_rate:'', blood_pressure:'', temperature:'', oxygen_level:'', glucose:'', weight:'', notes:'' }); 
    setEditingId(null); 
    setShowForm(false);
    setError('');
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      setError('⚠️ User not authenticated');
      return;
    }

    setError('');
    setSuccess('');
    setSubmitting(true);
    
    // Validate at least one field is filled
    if (!form.heart_rate && !form.blood_pressure && !form.temperature && !form.oxygen_level && !form.glucose && !form.weight) {
      setError('⚠️ Please enter at least one vital sign');
      setSubmitting(false);
      return;
    }

    const recordData = {
      user_id: user.id,
      heart_rate: form.heart_rate ? parseInt(form.heart_rate) : null,
      blood_pressure: form.blood_pressure || null,
      temperature: form.temperature ? parseFloat(form.temperature) : null,
      oxygen_level: form.oxygen_level ? parseInt(form.oxygen_level) : null,
      glucose: form.glucose ? parseInt(form.glucose) : null,
      weight: form.weight ? parseFloat(form.weight) : null,
      notes: form.notes || null,
      recorded_at: new Date().toISOString()
    };
    
    try {
      if (editingId) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('health_records')
          .update(recordData)
          .eq('id', editingId)
          .eq('user_id', user.id);
        
        if (updateError) throw new Error(updateError.message);
        setSuccess('✓ Record updated successfully!');
      } else {
        // Create new record
        const { error: insertError } = await supabase
          .from('health_records')
          .insert([recordData]);
        
        if (insertError) throw new Error(insertError.message);
        setSuccess('✓ Record saved successfully!');
      }
      
      await load(); 
      reset();
      
      // Clear success message after 2 seconds
      setTimeout(() => setSuccess(''), 2000);
    } catch(e) { 
      const errMsg = e instanceof Error ? e.message : 'Failed to save record';
      setError(`✗ ${errMsg}`);
      console.error('Submit error:', e); 
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!user?.id) {
      setError('⚠️ User not authenticated');
      return;
    }

    if (!confirm('Are you sure? This cannot be undone.')) return;
    
    setError('');
    setSubmitting(true);
    
    try {
      const { error: deleteError } = await supabase
        .from('health_records')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (deleteError) throw new Error(deleteError.message);
      
      setSuccess('✓ Record deleted successfully!');
      await load();
      setTimeout(() => setSuccess(''), 2000);
    } catch(e) {
      const errMsg = e instanceof Error ? e.message : 'Failed to delete';
      setError(`✗ ${errMsg}`);
    } finally {
      setSubmitting(false);
    }
  };

  const vitals = [
    { key: 'heart_rate', label: 'HEART_RATE', unit: 'BPM', icon: Heart, color: '#ff2d55', type: 'number', ph: '72' },
    { key: 'blood_pressure', label: 'BLOOD_PRESSURE', unit: 'mmHg', icon: Activity, color: '#00d4ff', type: 'text', ph: '120/80' },
    { key: 'temperature', label: 'TEMPERATURE', unit: '°C', icon: Thermometer, color: '#f59e0b', type: 'number', ph: '36.6' },
    { key: 'oxygen_level', label: 'OXYGEN_LEVEL', unit: '%', icon: Wind, color: '#10b981', type: 'number', ph: '98' },
    { key: 'glucose', label: 'GLUCOSE', unit: 'mg/dL', icon: Droplet, color: '#a855f7', type: 'number', ph: '90' },
    { key: 'weight', label: 'WEIGHT', unit: 'kg', icon: TrendingUp, color: '#ec4899', type: 'number', ph: '70.5' },
  ];

  if (!user?.id) {
    return (
      <div style={{ fontFamily: "'Rajdhani', sans-serif" }} className="min-h-screen bg-[#050810] text-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-[#ff2d55] mx-auto mb-4" />
          <p className="text-lg">Please log in to access Health Monitoring</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Rajdhani', sans-serif" }} className="min-h-screen bg-[#050810] text-white">
      <style>{STYLE}</style>
      <div className="fixed inset-0 gbg pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <div className="text-[#10b981]/60 text-xs tracking-widest mb-1" style={{ fontFamily: "'Share Tech Mono', monospace" }}>// VITALS_TRACKER</div>
            <h1 style={{ fontFamily: "'Orbitron', sans-serif" }} className="text-4xl font-black text-white">HEALTH <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg,#10b981,#00d4ff)' }}>MONITOR</span></h1>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(16,185,129,0.4)' }} 
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(!showForm)}
            disabled={submitting}
            className="px-5 py-2.5 font-black text-sm rounded-lg flex items-center gap-2 tracking-widest disabled:opacity-50"
            style={{ fontFamily: "'Orbitron', sans-serif", background: showForm ? '#1a2540' : 'linear-gradient(135deg,#10b981,#00d4ff)', color: showForm ? '#8892a4' : '#050810', border: showForm ? '1px solid rgba(16,185,129,0.3)' : 'none' }}>
            {showForm ? <><X className="w-4 h-4" />[CANCEL]</> : <><Plus className="w-4 h-4" />[ADD_RECORD]</>}
          </motion.button>
        </motion.div>

        {/* Error message */}
        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} 
            className="p-4 rounded-lg border border-[#ff2d55]/30 bg-[#ff2d55]/10 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-[#ff2d55] flex-shrink-0" />
            <div className="text-sm text-[#ff2d55]">{error}</div>
          </motion.div>
        )}

        {/* Success message */}
        {success && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="p-4 rounded-lg border border-[#10b981]/30 bg-[#10b981]/10 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-[#10b981] flex-shrink-0" />
            <div className="text-sm text-[#10b981]">{success}</div>
          </motion.div>
        )}

        {/* Form */}
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="relative p-6 border border-[#10b981]/30 rounded-xl bg-[#0a0f1e]/80 cc">
            <div className="text-[#10b981]/60 text-xs tracking-widest mb-4" style={{ fontFamily: "'Share Tech Mono', monospace" }}>// {editingId ? 'EDIT_RECORD' : 'NEW_RECORD'}</div>
            <form onSubmit={submit}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {vitals.map(v => (
                  <div key={v.key}>
                    <label className="flex items-center gap-1.5 text-xs mb-1.5 tracking-widest" style={{ color: `${v.color}80`, fontFamily: "'Share Tech Mono', monospace" }}>
                      <v.icon className="w-3 h-3" style={{ color: v.color }} />{v.label} ({v.unit})
                    </label>
                    <input 
                      type={v.type} 
                      step={v.key === 'temperature' || v.key === 'weight' ? '0.1' : undefined}
                      value={(form as any)[v.key]} 
                      onChange={e => setForm({ ...form, [v.key]: e.target.value })}
                      placeholder={v.ph}
                      disabled={submitting}
                      className="inp w-full px-3 py-2.5 bg-[#0d1528] border rounded-lg text-white placeholder-[#8892a4]/40 focus:outline-none text-sm transition-all disabled:opacity-50"
                      style={{ borderColor: `${v.color}25`, fontFamily: "'Share Tech Mono', monospace" }} 
                    />
                  </div>
                ))}
                <div className="md:col-span-3">
                  <label className="block text-xs text-[#10b981]/60 mb-1.5 tracking-widest" style={{ fontFamily: "'Share Tech Mono', monospace" }}>NOTES (OPTIONAL)</label>
                  <input 
                    type="text" 
                    value={form.notes} 
                    onChange={e => setForm({ ...form, notes: e.target.value })} 
                    placeholder="Any additional observations..."
                    disabled={submitting}
                    className="inp w-full px-3 py-2.5 bg-[#0d1528] border border-[#10b981]/20 rounded-lg text-white placeholder-[#8892a4]/40 focus:outline-none text-sm transition-all disabled:opacity-50"
                    style={{ fontFamily: "'Share Tech Mono', monospace" }} 
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <motion.button 
                  whileHover={{ scale: submitting ? 1 : 1.02 }} 
                  whileTap={{ scale: submitting ? 1 : 0.98 }} 
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 font-black text-sm rounded-lg flex items-center gap-2 tracking-widest disabled:opacity-50"
                  style={{ fontFamily: "'Orbitron', sans-serif", background: 'linear-gradient(135deg,#10b981,#00d4ff)', color: '#050810' }}>
                  {submitting ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  [{submitting ? 'SAVING...' : editingId ? 'UPDATE' : 'SAVE'}]
                </motion.button>
                {editingId && (
                  <motion.button 
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.98 }} 
                    type="button" 
                    onClick={reset}
                    disabled={submitting}
                    className="px-5 py-2.5 font-black text-sm rounded-lg border border-[#10b981]/20 text-[#8892a4] hover:text-white tracking-widest disabled:opacity-50"
                    style={{ fontFamily: "'Orbitron', sans-serif" }}>
                    [CANCEL_EDIT]
                  </motion.button>
                )}
              </div>
            </form>
          </motion.div>
        )}

        {/* Records */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span style={{ fontFamily: "'Orbitron', sans-serif" }} className="font-bold text-white">HEALTH_RECORDS</span>
            <span className="text-xs text-[#10b981]" style={{ fontFamily: "'Share Tech Mono', monospace" }}>[{records.length}]</span>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-10 h-10 border-2 border-[#10b981] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : records.length === 0 ? (
            <div className="relative p-12 border border-[#10b981]/10 rounded-xl bg-[#0a0f1e]/50 text-center cc">
              <Activity className="w-14 h-14 mx-auto mb-4 text-[#10b981]/20" />
              <div style={{ fontFamily: "'Orbitron', sans-serif" }} className="text-[#8892a4] font-bold">NO_RECORDS_FOUND</div>
              <div className="text-[#8892a4]/50 text-xs mt-2" style={{ fontFamily: "'Share Tech Mono', monospace" }}>click [ADD_RECORD] to start tracking</div>
            </div>
          ) : (
            <div className="space-y-3">
              {records.map((rec, i) => (
                <motion.div 
                  key={rec.id} 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: i * 0.05 }}
                  className="relative p-5 border border-[#10b981]/15 rounded-xl bg-[#0a0f1e]/80 hover:border-[#10b981]/30 transition-all cc">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-xs text-[#10b981]/60" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                        {new Date(rec.recorded_at).toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' })}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <motion.button 
                        whileHover={{ scale: 1.1 }} 
                        whileTap={{ scale: 0.9 }}
                        onClick={() => { 
                          setForm({ 
                            heart_rate: rec.heart_rate?.toString()||'', 
                            blood_pressure: rec.blood_pressure||'', 
                            temperature: rec.temperature?.toString()||'', 
                            oxygen_level: rec.oxygen_level?.toString()||'', 
                            glucose: rec.glucose?.toString()||'', 
                            weight: rec.weight?.toString()||'', 
                            notes: rec.notes||'' 
                          }); 
                          setEditingId(rec.id); 
                          setShowForm(true); 
                        }}
                        disabled={submitting}
                        className="p-2 border border-[#00d4ff]/20 rounded-lg text-[#00d4ff] hover:bg-[#00d4ff]/10 transition-all disabled:opacity-50">
                        <Edit2 className="w-4 h-4" />
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.1 }} 
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(rec.id)}
                        disabled={submitting}
                        className="p-2 border border-[#ff2d55]/20 rounded-lg text-[#ff2d55] hover:bg-[#ff2d55]/10 transition-all disabled:opacity-50">
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {vitals.map(v => {
                      const val = (rec as any)[v.key];
                      if (!val) return null;
                      return (
                        <div key={v.key} className="p-3 rounded-lg border" style={{ borderColor: `${v.color}20`, background: `${v.color}08` }}>
                          <div className="flex items-center gap-1 mb-1">
                            <v.icon className="w-3 h-3" style={{ color: v.color }} />
                            <span className="text-xs" style={{ color: `${v.color}70`, fontFamily: "'Share Tech Mono', monospace" }}>{v.key.split('_')[0].toUpperCase()}</span>
                          </div>
                          <div className="font-black text-white text-base" style={{ fontFamily: "'Orbitron', sans-serif" }}>{val}</div>
                          <div className="text-xs mt-0.5" style={{ color: `${v.color}60`, fontFamily: "'Share Tech Mono', monospace" }}>{v.unit}</div>
                        </div>
                      );
                    })}
                  </div>
                  {rec.notes && <div className="mt-3 px-3 py-2 rounded-lg border border-[#10b981]/10 bg-[#0d1528]/40 text-xs text-[#8892a4]" style={{ fontFamily: "'Share Tech Mono', monospace" }}>NOTE: {rec.notes}</div>}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}