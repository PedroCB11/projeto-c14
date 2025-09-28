import { EmployeeRepoMemory } from './src/EmployeeRepoMemory.js';
import { EmployeeService } from './src/EmployeeService.js';

const repo = new EmployeeRepoMemory();
const service = new EmployeeService(repo);

(async () => {
  // Cadastrar (gera ID único para cada um)
  const ana = await service.create({ name: 'Ana Silva',  email: 'ana@ex.com' });
  const joao = await service.create({ name: 'João Lima', email: 'joao@ex.com' });

  console.log('Criados:');
  console.table([ana, joao]); // mostra ID único de cada um

  // Identificar por ID
  const achouAna = await service.getById(ana.id);
  console.log('Por ID:', achouAna);

  // Identificar por email
  const achouJoao = await service.getByEmail('joao@ex.com');
  console.log('Por email:', achouJoao);

  // Listar todos
  console.log('Todos:');
  console.table(await service.list());

  // Teste de email duplicado (mostra erro amigável)
  try {
    await service.create({ name: 'Outro João', email: 'joao@ex.com' });
  } catch (e) {
    console.error('Erro esperado:', e.message, e.errors ?? '');
  }
})();
