
const to = process.env.EMAIL_TO;
const statusTests = process.env.STATUS_TESTS || 'desconhecido';
const statusBuild = process.env.STATUS_BUILD || 'desconhecido';

if (!to) {
  console.error('EMAIL_TO não definido. Abortando notificação.');
  process.exit(1);
}

const msg = `
Pipeline executado!
- Testes: ${statusTests}
- Build: ${statusBuild}
`.trim();

console.log(`(simulação) E-mail enviado para ${to}:\n${msg}`);
