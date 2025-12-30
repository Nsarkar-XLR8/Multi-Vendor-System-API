import { companyName } from "../lib/globalType";

interface MessageTemplateProps {
  type: "success" | "rejected";
  email: string;
  subject: string;
  message: string;
  resetPasswordURL?: string; // ✅ optional
  dashboardUrl?: string;
}


const sendTemplateMail = ({
  type,
  email,
  subject,
  message,
  resetPasswordURL,
  dashboardUrl,
}: MessageTemplateProps): string => {
  const color = type === "success" ? "#10B981" : "#EF4444";
  const emoji = type === "success" ? "✅" : "❌";

  return `
  <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f5; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
      
      <header style="background-color: ${color}; padding: 20px; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 24px;">${companyName}</h1>
        <p style="margin: 5px 0 0; font-size: 16px;">${emoji} ${subject}</p>
      </header>

      <section style="padding: 20px; color: #111827; font-size: 15px; line-height: 1.6;">
        <p>Hello,</p>
        <p>${message}</p>

        ${
          type === "success" && resetPasswordURL
            ? `
          <!-- Set Password Section -->
          <div style="margin-top: 20px; padding: 15px; background-color: #f9fafb; border-left: 5px solid ${color}; border-radius: 6px;">
            <p style="margin: 0 0 10px;">
              <strong>Step 1:</strong> Set your password to activate your account.
            </p>

            <a 
              href="${resetPasswordURL}" 
              style="display: inline-block; padding: 12px 20px; background-color: ${color}; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;"
            >
              Set Your Password
            </a>

            <p style="margin-top: 12px; font-size: 13px; color: #b91c1c;">
              Without setting your password, you will not be able to log in.
            </p>
          </div>
          `
            : ""
        }

        ${
          type === "success" && dashboardUrl
            ? `
          <!-- Dashboard Section -->
          <div style="margin-top: 20px; padding: 15px; background-color: #ecfeff; border-left: 5px solid #06b6d4; border-radius: 6px;">
            <p style="margin: 0 0 10px;">
              <strong>Step 2:</strong> After setting your password, you can access your dashboard.
            </p>

            <a 
              href="${dashboardUrl}" 
              style="display: inline-block; padding: 12px 20px; background-color: #06b6d4; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;"
            >
              Go to Dashboard
            </a>
          </div>
          `
            : ""
        }

      </section>

      <footer style="padding: 15px 20px; text-align: center; font-size: 13px; color: #6b7280; background-color: #f4f4f5;">
        &copy; 2025 <strong>${companyName}</strong>. All rights reserved.
      </footer>

    </div>
  </div>
  `;
};

export default sendTemplateMail;