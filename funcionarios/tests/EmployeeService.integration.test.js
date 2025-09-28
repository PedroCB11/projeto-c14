import { EmployeeRepoMemory } from '../src/EmployeeRepoMemory.js';
import { EmployeeService } from '../src/EmployeeService.js';

describe('EmployeeService + MemoryRepo (integração simples)', () => {
  test('fluxo completo: create -> getById/getByEmail -> list', async () => {
    const repo = new EmployeeRepoMemory();
    const svc = new EmployeeService(repo);

    const ana = await svc.create({ name: 'Ana', email: 'ana@ex.com' });
    const joao = await svc.create({ name: 'Joao', email: 'joao@ex.com' });

    const byId = await svc.getById(ana.id);
    expect(byId.email).toBe('ana@ex.com');

    const byEmail = await svc.getByEmail('joao@ex.com');
    expect(byEmail.name).toBe('Joao');

    const all = await svc.list();
    expect(all.map(x => x.id)).toEqual(expect.arrayContaining([ana.id, joao.id]));
  });

  test('create: falha em email duplicado (repo real)', async () => {
    const repo = new EmployeeRepoMemory();
    const svc = new EmployeeService(repo);

    await svc.create({ name: 'Ana', email: 'ana@ex.com' });
    await expect(svc.create({ name: 'Outra', email: 'ana@ex.com' }))
      .rejects.toThrow('ValidationError');
  });

  test('create: falha de validação (nome curto / email ruim)', async () => {
    const repo = new EmployeeRepoMemory();
    const svc = new EmployeeService(repo);
    await expect(svc.create({ name: 'Al', email: 'a@a.com' })).rejects.toThrow('ValidationError');
    await expect(svc.create({ name: 'Alice', email: 'ruim@' })).rejects.toThrow('ValidationError');
  });
});
