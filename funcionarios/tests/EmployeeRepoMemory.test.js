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

  test('teste 5 -> IDs únicos + índice de email consistente em lote', async () => {
    const repo = new EmployeeRepoMemory();

    const inputs = [
      { name: 'A', email: 'a@ex.com' },
      { name: 'B', email: 'b@ex.com' },
      { name: 'C', email: 'c@ex.com' },
      { name: 'D', email: 'd@ex.com' },
      { name: 'E', email: 'e@ex.com' }
    ];

    const created = await Promise.all(inputs.map(x => repo.create(x)));

    // IDs únicos e formato correto
    const ids = created.map(c => c.id);
    expect(new Set(ids).size).toBe(created.length);
    for (const id of ids) {
      expect(id).toMatch(/^EMP-\d{14}-\d+$/);
    }

    // list() com o mesmo total
    const all = await repo.list();
    expect(all).toHaveLength(created.length);

    // índice de email retorna o mesmo registro
    for (const c of created) {
      const byEmail = await repo.findByEmail(c.email);
      expect(byEmail).toEqual(c);
    }
  });

  test('teste 6 -> sufixo sequencial do ID cresce a cada create', async () => {
    const repo = new EmployeeRepoMemory();

    const a = await repo.create({ name: 'Ana',  email: 'ana@ex.com' });
    const b = await repo.create({ name: 'Bia',  email: 'bia@ex.com' });
    const c = await repo.create({ name: 'Caio', email: 'caio@ex.com' });

    const suffix = id => Number(id.split('-').pop());

    const sa = suffix(a.id);
    const sb = suffix(b.id);
    const sc = suffix(c.id);

    expect(sa).toBeGreaterThanOrEqual(1);
    expect(sb).toBe(sa + 1);
    expect(sc).toBe(sb + 1);
  });
});
