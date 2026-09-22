import firebaseConfig from '../../firebase-applet-config.json';

declare global {
  interface Window {
    google?: {
      accounts?: {
        oauth2?: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: { access_token?: string; error?: string; error_description?: string }) => void;
          }) => {
            requestAccessToken: (options?: { prompt?: string }) => void;
          };
        };
      };
    };
  }
}

/**
 * Dynamically loads the Google Identity Services client script if not already present.
 */
export function loadGisScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.oauth2) {
      resolve();
      return;
    }
    const existing = document.getElementById('google-gis-sdk');
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Failed to load Google GIS script')));
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-gis-sdk';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = (e) => reject(new Error(`Failed to load Google Identity Services: ${e}`));
    document.head.appendChild(script);
  });
}

/**
 * Requests a user-consented OAuth 2.0 access token for Gmail sending.
 */
export async function requestGmailAccessToken(): Promise<string> {
  await loadGisScript();

  const clientId = firebaseConfig.oAuthClientId;
  if (!clientId) {
    throw new Error('OAuth Client ID not found in configuration. Please ensure OAuth is set up.');
  }

  return new Promise((resolve, reject) => {
    try {
      if (!window.google?.accounts?.oauth2) {
        reject(new Error('Google Identity Services SDK could not be initialized.'));
        return;
      }

      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'https://www.googleapis.com/auth/gmail.send',
        callback: (response) => {
          if (response.error) {
            console.error('Google OAuth token error:', response);
            reject(new Error(response.error_description || response.error || 'User cancelled authorization.'));
          } else if (response.access_token) {
            resolve(response.access_token);
          } else {
            reject(new Error('No access token received from Google.'));
          }
        },
      });

      tokenClient.requestAccessToken({ prompt: 'consent' });
    } catch (err) {
      reject(err);
    }
  });
}

export interface SendEmailPayload {
  to: string;
  recipientName?: string;
  subject: string;
  htmlContent: string;
  senderName?: string;
}

/**
 * Constructs a MIME email and sends it via Gmail REST API.
 */
export async function sendGmailMessage(
  accessToken: string,
  payload: SendEmailPayload
): Promise<{ id: string; threadId: string }> {
  const { to, recipientName, subject, htmlContent, senderName = 'MP Shikshak Portal (Mockia)' } = payload;

  const boundary = `__mockia_boundary_${Date.now()}_${Math.random().toString(36).substring(2, 9)}__`;
  
  // Encode Subject cleanly in UTF-8 Base64 for RFC 2047 standard support
  const utf8Subject = `=?utf-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`;
  const fromHeader = `${senderName} <me>`;
  const toHeader = recipientName ? `"${recipientName}" <${to}>` : to;
  
  const plainTextFallback = htmlContent
    .replace(/<br\s*[\/]?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]*>/g, '')
    .trim();

  // Full styled HTML email wrapper
  const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f1f5f9; padding: 24px 12px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.05);">
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%); padding: 24px 32px; text-align: left;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <span style="display: inline-block; background-color: #2563eb; color: #ffffff; font-size: 10px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; padding: 4px 8px; border-radius: 6px; margin-bottom: 8px;">Official Portal</span>
                    <h1 style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 800; letter-spacing: -0.5px;">MP Shikshak Portal (Mockia)</h1>
                    <p style="margin: 4px 0 0 0; color: #93c5fd; font-size: 12px;">मध्यप्रदेश प्राथमिक, माध्यमिक एवं उच्च माध्यमिक शिक्षक भर्ती परीक्षा</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Body -->
          <tr>
            <td style="padding: 32px; font-size: 15px; line-height: 1.65; color: #334155;">
              ${htmlContent}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 20px 32px; border-top: 1px solid #e2e8f0; text-align: center;">
              <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: 700; color: #475569;">
                मध्यप्रदेश शिक्षक भर्ती परीक्षा तैयारी मंच
              </p>
              <p style="margin: 0; font-size: 11px; color: #94a3b8; line-height: 1.5;">
                यह संदेश आपको MP Shikshak Mock Test Portal द्वारा प्रेषित किया गया है।<br/>
                &copy; ${new Date().getFullYear()} MP Shikshak Exam Portal. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const messageParts = [
    `From: ${fromHeader}`,
    `To: ${toHeader}`,
    `Subject: ${utf8Subject}`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 7bit',
    '',
    plainTextFallback,
    '',
    `--${boundary}`,
    'Content-Type: text/html; charset=UTF-8',
    'Content-Transfer-Encoding: 7bit',
    '',
    fullHtml,
    '',
    `--${boundary}--`
  ];

  const rawMessage = messageParts.join('\r\n');
  const encodedMessage = btoa(unescape(encodeURIComponent(rawMessage)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ raw: encodedMessage }),
  });

  if (!response.ok) {
    const errorJson = await response.json().catch(() => ({}));
    const errorMsg = errorJson?.error?.message || `Gmail API failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return await response.json();
}
