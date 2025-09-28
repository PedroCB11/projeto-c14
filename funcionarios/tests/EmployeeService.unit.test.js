import { EmployeeService } from '../src/EmployeeService.js';
import { jest } from '@jest/globals';

const makeRepoMock = () => ({
  create: jest.fn(),
  findById: jest.fn(),
  findByEmail: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  list: jest.fn()
});

describe('EmployeeService (unit com mock do repo)', () => {
  const base = { name: 'Maria Silva', email: 'maria@ex.com' };

  test('create: sucesso', async () => {
    const repo = makeRepoMock();
    repo.findByEmail.mockResolvedValue(null);
    repo.create.mockResolvedValue({ id: 'EMP-20250101010101-1', ...base });

    const svc = new EmployeeService(repo);
    const emp = await svc.create(base);

    expect(repo.findByEmail).toHaveBeenCalledWith('maria@ex.com');
    expect(repo.create).toHaveBeenCalledWith({ name: 'Maria Silva', email: 'maria@ex.com' });
    expect(emp.id).toBe('EMP-20250101010101-1');
    expect(emp.email).toBe('maria@ex.com');
  });

  test('create: valida nome curto', async () => {
    const repo = makeRepoMock();
    const svc = new EmployeeService(repo);
    await expect(svc.create({ name: 'Jo', email: 'jo@ex.com' }))
      .rejects.toThrow('ValidationError');
  });

  test('create: valida email inválido', async () => {
    const repo = makeRepoMock();
    const svc = new EmployeeService(repo);
    await expect(svc.create({ name: 'Joao', email: 'email-invalido' }))
      .rejects.toThrow('ValidationError');
  });

  test('create: email duplicado', async () => {
    const repo = makeRepoMock();
    repo.findByEmail.mockResolvedValue({ id: 'X', ...base });
    const svc = new EmployeeService(repo);

    await expect(svc.create(base)).rejects.toThrow('ValidationError');
  });

  test('getById: sucesso', async () => {
    const repo = makeRepoMock();
    repo.findById.mockResolvedValue({ id: 'EMP-1', ...base });

    const svc = new EmployeeService(repo);
    const emp = await svc.getById('EMP-1');

    expect(repo.findById).toHaveBeenCalledWith('EMP-1');
    expect(emp.id).toBe('EMP-1');
  });

  test('getById: not found', async () => {
    const repo = makeRepoMock();
    repo.findById.mockResolvedValue(null);

    const svc = new EmployeeService(repo);
    await expect(svc.getById('EMP-404')).rejects.toThrow('NotFound');
  });

  test('getByEmail: sucesso', async () => {
    const repo = makeRepoMock();
    repo.findByEmail.mockResolvedValue({ id: 'EMP-2', ...base });

    const svc = new EmployeeService(repo);
    const emp = await svc.getByEmail('maria@ex.com');

    expect(repo.findByEmail).toHaveBeenCalledWith('maria@ex.com');
    expect(emp.id).toBe('EMP-2');
  });

  test('getByEmail: not found', async () => {
    const repo = makeRepoMock();
    repo.findByEmail.mockResolvedValue(null);

    const svc = new EmployeeService(repo);
    await expect(svc.getByEmail('none@ex.com')).rejects.toThrow('NotFound');
  });

  test('list: delega para repo.list', async () => {
    const repo = makeRepoMock();
    repo.list.mockResolvedValue([{ id: 'EMP-1', ...base }]);

    const svc = new EmployeeService(repo);
    const all = await svc.list();

    expect(repo.list).toHaveBeenCalled();
    expect(all).toHaveLength(1);
    expect(all[0].id).toBe('EMP-1');
  });
});
