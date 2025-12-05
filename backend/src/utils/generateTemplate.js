export const generateVerifyEmailTemplate = (link) => {
  return `
  <!doctype html>
    <html lang="vi">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Xác nhận địa chỉ Email</title>
      </head>
      <body style="margin:0;padding:40px;background:#f6f7fb;font-family:Arial,Helvetica,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
          <tr>
            <td align="center">
              <table width="680" style="max-width:680px;background:#ffffff;border-radius:10px;padding:36px;text-align:center;box-shadow:0 6px 18px rgba(17,24,39,0.06);" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td>
                    <img src="https://img.icons8.com/fluency/96/mail.png" alt="Email Icon" width="80" height="80" style="display:block;margin:0 auto 24px;" />
                    <h1 style="font-size:28px;color:#111;margin:0 0 10px;">Xác nhận địa chỉ Email</h1>
                    <p style="color:#556070;font-size:15px;line-height:1.6;margin:0 0 22px;">Bạn vừa tạo một tài khoản Quizzy mới. Vui lòng xác nhận địa chỉ email của bạn để chúng tôi biết bạn là chủ sở hữu hợp pháp của tài khoản này.</p>
                    <a href="${link}" style="display:inline-block;background:#6c63ff;color:#ffffff;padding:12px 22px;border-radius:8px;text-decoration:none;font-weight:600;margin-bottom:14px;" target="_blank">Xác nhận địa chỉ email</a>
                    <p style="color:#9aa4b2;font-size:12px;margin-top:20px;">Nếu bạn không yêu cầu việc này, bạn có thể bỏ qua email này.</p>
                  </td>
                </tr>
              </table>
              <table width="680" style="max-width:680px;margin-top:18px;text-align:center;" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="color:#9aa4b2;font-size:13px;padding-top:8px;">Quizzy © 2025 Quizzy, Inc. All Rights Reserved.<br/>Hanoi 2025, Vietnam.</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `
}