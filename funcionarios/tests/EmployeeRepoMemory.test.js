import { EmployeeRepoMemory } from '../src/EmployeeRepoMemory.js';

describe('EmployeeRepoMemory', () => {
  test('teste 1 -> create: gera ID único e indexa por email', async () => {
    const repo = new EmployeeRepoMemory();
    const a = await repo.create({ name: 'Ana', email: 'ana@ex.com' });
    const b = await repo.create({ name: 'João', email: 'joao@ex.com' });

    expect(a.id).toMatch(/^EMP-\d{14}-\d+$/);
    expect(b.id).toMatch(/^EMP-\d{14}-\d+$/);
    expect(a.id).not.toBe(b.id);

    const byId = await repo.findById(a.id);
    expect(byId?.email).toBe('ana@ex.com');

    const byEmail = await repo.findByEmail('joao@ex.com');
    expect(byEmail?.name).toBe('João');

    const all = await repo.list();
    expect(all).toHaveLength(2);
  });

  test('teste 2 -> create: não permite email duplicado', async () => {
    const repo = new EmployeeRepoMemory();
    await repo.create({ name: 'Ana', email: 'ana@ex.com' });
    await expect(repo.create({ name: 'Outra Ana', email: 'ana@ex.com' }))
      .rejects.toThrow('email already in use');
  });

  test('teste 3 -> findById/findByEmail: retorna null quando não existe', async () => {
    const repo = new EmployeeRepoMemory();
    expect(await repo.findById('EMP-NAO-EXISTE')).toBeNull();
    expect(await repo.findByEmail('none@ex.com')).toBeNull();
  });

  test('teste 4 -> list: vazio inicialmente', async () => {
    const repo = new EmployeeRepoMemory();
    const all = await repo.list();
    expect(all).toEqual([]);
  });
});
