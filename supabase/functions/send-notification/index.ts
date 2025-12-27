import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  type: 'created' | 'status_changed';
  requestId: string;
  subject: string;
  equipmentName: string;
  priority: string;
  status?: string;
  previousStatus?: string;
  assignedTo?: string;
  userEmail?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: NotificationRequest = await req.json();
    console.log("Received notification request:", data);

    const { type, subject, equipmentName, priority, status, previousStatus, assignedTo, userEmail } = data;

    // Only send email if we have a recipient email
    if (!userEmail) {
      console.log("No user email provided, skipping email notification");
      return new Response(JSON.stringify({ success: true, message: "No email to send to" }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    let emailSubject = '';
    let emailContent = '';

    if (type === 'created') {
      emailSubject = `[GearGuard] New Maintenance Request: ${subject}`;
      emailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🔧 New Maintenance Request</h1>
          </div>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 0 0 8px 8px;">
            <h2 style="color: #1e3a5f; margin-top: 0;">${subject}</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #dee2e6; color: #6c757d;">Equipment:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #dee2e6; font-weight: bold;">${equipmentName}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #dee2e6; color: #6c757d;">Priority:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #dee2e6;">
                  <span style="background: ${priority === 'critical' ? '#dc3545' : priority === 'high' ? '#fd7e14' : priority === 'medium' ? '#1e3a5f' : '#6c757d'}; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; text-transform: uppercase;">${priority}</span>
                </td>
              </tr>
              ${assignedTo ? `
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #dee2e6; color: #6c757d;">Assigned To:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #dee2e6; font-weight: bold;">${assignedTo}</td>
              </tr>
              ` : ''}
            </table>
            <p style="color: #6c757d; margin-top: 20px; font-size: 12px;">This is an automated notification from GearGuard Maintenance System.</p>
          </div>
        </div>
      `;
    } else if (type === 'status_changed') {
      emailSubject = `[GearGuard] Status Update: ${subject}`;
      emailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">📋 Status Update</h1>
          </div>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 0 0 8px 8px;">
            <h2 style="color: #1e3a5f; margin-top: 0;">${subject}</h2>
            <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
              <p style="margin: 0; color: #6c757d;">Status changed from</p>
              <div style="display: flex; align-items: center; gap: 10px; margin-top: 10px;">
                <span style="background: #6c757d; color: white; padding: 6px 16px; border-radius: 20px; font-size: 14px;">${previousStatus || 'new'}</span>
                <span style="color: #6c757d;">→</span>
                <span style="background: ${status === 'repaired' ? '#28a745' : status === 'in-progress' ? '#fd7e14' : status === 'scrap' ? '#dc3545' : '#1e3a5f'}; color: white; padding: 6px 16px; border-radius: 20px; font-size: 14px;">${status}</span>
              </div>
            </div>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #dee2e6; color: #6c757d;">Equipment:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #dee2e6; font-weight: bold;">${equipmentName}</td>
              </tr>
            </table>
            <p style="color: #6c757d; margin-top: 20px; font-size: 12px;">This is an automated notification from GearGuard Maintenance System.</p>
          </div>
        </div>
      `;
    }

    console.log("Sending email to:", userEmail);
    const emailResponse = await resend.emails.send({
      from: "GearGuard <onboarding@resend.dev>",
      to: [userEmail],
      subject: emailSubject,
      html: emailContent,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
