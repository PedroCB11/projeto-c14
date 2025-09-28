import { Employee } from './employee.js';

export class EmployeeService {
  constructor(repo) {
    this.repo = repo;
  }

  _validate(input) {
    const errors = [];
    if (!input?.name || input.name.trim().length < 3) {
      errors.push({ field: 'name', message: 'name must be at least 3 chars' });
    }
    const okEmail = typeof input?.email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email);
    if (!okEmail) errors.push({ field: 'email', message: 'invalid email' });
    if (errors.length) {
      const e = new Error('ValidationError'); e.errors = errors; throw e;
    }
  }

  /** cria e retorna o funcionário com ID único */
  async create(input) {
    this._validate(input);
    const saved = await this.repo.create({ name: input.name.trim(), email: input.email.trim() });
    return new Employee(saved);
  }

  /** identifica por ID */
  async getById(id) {
    const found = await this.repo.findById(id);
    if (!found) { const e = new Error('NotFound'); e.code = 'NOT_FOUND'; throw e; }
    return new Employee(found);
  }

  /** identifica por email */
  async getByEmail(email) {
    const found = await this.repo.findByEmail(email.trim());
    if (!found) { const e = new Error('NotFound'); e.code = 'NOT_FOUND'; throw e; }
    return new Employee(found);
  }

  /** lista todos (útil para ver quem é quem) */
  async list() {
    const all = await this.repo.list();
    return all.map(r => new Employee(r));
  }
}
