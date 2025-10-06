export function createWelcomeEmailTemplate(name, clientURL) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Echoo</title>
  </head>
  <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #eaeaea; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0d1117;">

    <div style="background-color: #161b22; padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
      <img src="https://img.freepik.com/free-vector/sound-wave-logo_23-2147512708.jpg?t=st=1738838598~exp=1738842198~hmac=f7239b95efbe4a176a6128c3d5973f81c481978b7e8d32b672b6a6f88b64b836&w=740" 
        alt="Echoo Logo" 
        style="width: 80px; height: 80px; margin-bottom: 20px; border-radius: 50%; background-color: #0d1117; padding: 10px;">
      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 500;">Welcome to Echoo</h1>
    </div>

    <div style="background-color: #1c1f26; padding: 35px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.4);">
      <p style="font-size: 18px; color: #58a6ff;"><strong>Hello ${name},</strong></p>
      <p style="color: #d1d5db;">We're excited to have you join our messaging platform. Echoo connects you with friends, family, and colleagues in real time, wherever they are.</p>
      
      <div style="background-color: #21262d; padding: 25px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #58a6ff;">
        <p style="font-size: 16px; margin: 0 0 15px 0; color: #e6edf3;"><strong>Get started in just a few steps:</strong></p>
        <ul style="padding-left: 20px; margin: 0; color: #c9d1d9;">
          <li style="margin-bottom: 10px;">Set up your profile picture</li>
          <li style="margin-bottom: 10px;">Find and add your contacts</li>
          <li style="margin-bottom: 10px;">Start a conversation</li>
          <li style="margin-bottom: 0;">Share photos, videos, and more</li>
        </ul>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${clientURL}" style="background-color: #238636; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 8px; font-weight: 500; display: inline-block;">
          Open Echoo
        </a>
      </div>
      
      <p style="color: #c9d1d9; margin-bottom: 5px;">If you need any help or have questions, our team is here to assist you.</p>
      <p style="color: #c9d1d9; margin-top: 0;">Happy messaging.</p>
      
      <p style="margin-top: 25px; margin-bottom: 0; color: #8b949e;">Best regards,<br>The Echoo Team</p>
    </div>
    
    <div style="text-align: center; padding: 20px; color: #8b949e; font-size: 12px;">
      <p style="margin: 0;">© 2025 Echoo. All rights reserved.</p>
      <p style="margin-top: 5px;">
        <a href="#" style="color: #58a6ff; text-decoration: none; margin: 0 10px;">Privacy Policy</a>
        <a href="#" style="color: #58a6ff; text-decoration: none; margin: 0 10px;">Terms of Service</a>
        <a href="#" style="color: #58a6ff; text-decoration: none; margin: 0 10px;">Contact Us</a>
      </p>
    </div>

  </body>
  </html>
  `;
}
