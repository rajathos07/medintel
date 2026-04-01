// supabase/functions/sos-notify/index.ts
// Deploy: supabase functions deploy sos-notify --no-verify-jwt
//
// Requires env vars in Supabase dashboard → Edge Functions → Manage secrets:
//   RESEND_API_KEY=your_resend_api_key   (get free key at resend.com)
//   FROM_EMAIL=alerts@yourdomain.com     (verified sender in Resend)
//
// ⚠ Until your domain is verified in Resend, set:
//   FROM_EMAIL=onboarding@resend.dev
//   and only send to your own email for testing.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS });
  }

  try {
    const { userId, emergencyContact, symptoms, latitude, longitude } = await req.json() as {
      userId: string;
      emergencyContact: string;
      symptoms: string[];
      latitude: number | null;
      longitude: number | null;
    };

    const resendKey = Deno.env.get('RESEND_API_KEY');
    const fromEmail = Deno.env.get('FROM_EMAIL') ?? 'onboarding@resend.dev';

    if (!resendKey) {
      console.warn('RESEND_API_KEY not set — skipping email notification');
      return new Response(
        JSON.stringify({ success: true, notified: false, reason: 'email not configured' }),
        { headers: { ...CORS, 'Content-Type': 'application/json' } }
      );
    }

    const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const symptomList = symptoms.length > 0
      ? symptoms.map(s => `• ${s}`).join('\n')
      : '• No specific symptoms reported';

    const htmlBody = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #ff2d55, #f59e0b); padding: 24px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 28px; letter-spacing: 2px;">⚠ SOS ALERT</h1>
      <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 14px;">MedIntel Emergency Notification</p>
    </div>

    <!-- Content -->
    <div style="padding: 28px;">
      <div style="background: #fff5f5; border: 2px solid #ff2d55; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
        <p style="margin: 0; color: #cc0000; font-size: 16px; font-weight: bold;">
          Your contact has triggered an emergency SOS alert on MedIntel.
        </p>
      </div>

      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666; width: 140px;">⏰ Time</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #333;">${now} IST</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;">👤 User ID</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-family: monospace; color: #333; font-size: 12px;">${userId}</td>
        </tr>
      </table>

      ${symptoms.length > 0 ? `
      <div style="margin-top: 20px;">
        <p style="color: #666; font-size: 14px; margin-bottom: 8px; font-weight: bold;">🩺 REPORTED SYMPTOMS:</p>
        <div style="background: #fff9f0; border-left: 4px solid #f59e0b; padding: 12px 16px; border-radius: 0 8px 8px 0;">
          ${symptoms.map(s => `<p style="margin: 4px 0; color: #333;">• ${s}</p>`).join('')}
        </div>
      </div>` : ''}

      ${latitude && longitude ? `
      <div style="margin-top: 20px; background: #f0fff4; border: 1px solid #10b981; border-radius: 8px; padding: 14px;">
        <p style="margin: 0 0 8px; color: #059669; font-weight: bold; font-size: 14px;">📍 LAST KNOWN LOCATION</p>
        <a href="https://maps.google.com/?q=${latitude},${longitude}" 
           style="color: #059669; text-decoration: none; font-size: 13px;">
          View on Google Maps →
        </a>
        <p style="margin: 4px 0 0; color: #666; font-size: 12px;">${latitude.toFixed(5)}, ${longitude.toFixed(5)}</p>
      </div>` : `
      <div style="margin-top: 20px; background: #f9f9f9; border: 1px solid #ddd; border-radius: 8px; padding: 14px;">
        <p style="margin: 0; color: #999; font-size: 13px;">📍 Location not available — user may have location access disabled.</p>
      </div>`}

      <div style="margin-top: 24px; padding: 16px; background: #fff0f3; border-radius: 8px; text-align: center;">
        <p style="margin: 0; color: #cc0000; font-size: 16px; font-weight: bold;">
          Please check on this person immediately or call 112.
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="background: #f8f8f8; padding: 16px 28px; text-align: center; border-top: 1px solid #eee;">
      <p style="margin: 0; color: #999; font-size: 12px;">
        This alert was sent automatically by MedIntel · Do not reply to this email
      </p>
    </div>
  </div>
</body>
</html>`;

    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `MedIntel Alert <${fromEmail}>`,
        to: [emergencyContact],
        subject: '🚨 SOS ALERT — Immediate Attention Required',
        html: htmlBody,
      }),
    });

    if (!emailRes.ok) {
      const errText = await emailRes.text();
      throw new Error(`Resend failed (${emailRes.status}): ${errText}`);
    }

    return new Response(
      JSON.stringify({ success: true, notified: true }),
      { headers: { ...CORS, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('sos-notify error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...CORS, 'Content-Type': 'application/json' } }
    );
  }
});