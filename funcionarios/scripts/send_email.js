// scripts/send_email.js
import nodemailer from "nodemailer";

const to = process.env.EMAIL_TO;          // destinatário
const user = process.env.EMAIL_USER;      // remetente (e-mail da conta)
const pass = process.env.EMAIL_PASS;      // senha/app password

const statusTests = process.env.STATUS_TESTS || "desconhecido";
const statusBuild = process.env.STATUS_BUILD || "desconhecido";

async function main() {
  if (!to || !user || !pass) {
    console.error("⚠️ Variáveis de ambiente EMAIL_TO, EMAIL_USER e EMAIL_PASS não estão configuradas.");
    process.exit(1);
  }

  const transporter = nodemailer.createTransport({
    service: "gmail", // pode trocar para outro SMTP
    auth: { user, pass }
  });

  const info = await transporter.sendMail({
    from: `"CI/CD Bot" <${user}>`,
    to,
    subject: "Relatório Pipeline - Funcionários",
    html: `
      <h2>Pipeline executado!</h2>
      <p>Status dos testes: <b>${statusTests}</b></p>
      <p>Status da build: <b>${statusBuild}</b></p>
    `
  });

  console.log("📨 E-mail enviado:", info.messageId);
}

main().catch(console.error);
