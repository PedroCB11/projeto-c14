import { EmployeeRepoMemory } from '../src/EmployeeRepoMemory.js';
import { EmployeeService } from '../src/EmployeeService.js';

describe('EmployeeService + MemoryRepo (integração simples)', () => {
  test('teste 7 -> fluxo completo: create -> getById/getByEmail -> list', async () => {
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

  test('teste 8 -> create: falha em email duplicado (repo real)', async () => {
    const repo = new EmployeeRepoMemory();
    const svc = new EmployeeService(repo);

    await svc.create({ name: 'Ana', email: 'ana@ex.com' });
    await expect(svc.create({ name: 'Outra', email: 'ana@ex.com' }))
      .rejects.toThrow('ValidationError');
  });

  test('teste 9 -> create: falha de validação (nome curto / email ruim)', async () => {
    const repo = new EmployeeRepoMemory();
    const svc = new EmployeeService(repo);
    await expect(svc.create({ name: 'Al', email: 'a@a.com' })).rejects.toThrow('ValidationError');
    await expect(svc.create({ name: 'Alice', email: 'ruim@' })).rejects.toThrow('ValidationError');
  });

  test('teste 10  -> create com espaços: normaliza name/email', async () => {
    const repo = new EmployeeRepoMemory();
    const svc = new EmployeeService(repo);

    const emp = await svc.create({ name: '  Ana  ', email: '  ana@ex.com  ' });

    // deve ter sido salvo já normalizado
    expect(emp.name).toBe('Ana');
    expect(emp.email).toBe('ana@ex.com');

    // e deve ser encontrável por email já limpo
    const byEmail = await svc.getByEmail('ana@ex.com');
    expect(byEmail.id).toBe(emp.id);
  });

  test('teste 11 -> getById: not found (repo real)', async () => {
    const repo = new EmployeeRepoMemory();
    const svc = new EmployeeService(repo);

    await expect(svc.getById('EMP-NAO-EXISTE')).rejects.toThrow('NotFound');
  });
});
