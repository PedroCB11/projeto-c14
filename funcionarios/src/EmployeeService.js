// EmployeeService.js
import { Employee } from './Employee.js';

export class EmployeeService {
  constructor(repo) {
    this.repo = repo;
  }

  /**
   * Normaliza e valida. Retorna { name, email } já com trim.
   * Lança Error('ValidationError') se houver problemas.
   */
  _validate(input) {
    const name = typeof input?.name === 'string' ? input.name.trim() : '';
    const email = typeof input?.email === 'string' ? input.email.trim() : '';

    const errors = [];
    if (!name || name.length < 3) {
      errors.push({ field: 'name', message: 'name must be at least 3 chars' });
    }
    const okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!okEmail) errors.push({ field: 'email', message: 'invalid email' });

    if (errors.length) {
      const e = new Error('ValidationError');
      e.errors = errors;
      throw e;
    }
    return { name, email };
  }

  /** cria e retorna o funcionário com ID único */
  async create(input) {
    // ✅ usa dados normalizados
    const { name, email } = this._validate(input);

    // checa duplicidade com erro padronizado
    const exists = await this.repo.findByEmail(email);
    if (exists) {
      const e = new Error('ValidationError');
      e.errors = [{ field: 'email', message: 'email already in use' }];
      throw e;
    }

    const saved = await this.repo.create({ name, email });
    return new Employee(saved);
  }

  /** identifica por ID */
  async getById(id) {
    const found = await this.repo.findById(id);
    if (!found) {
      const e = new Error('NotFound');
      e.code = 'NOT_FOUND';
      throw e;
    }
    return new Employee(found);
  }

  /** identifica por email */
  async getByEmail(email) {
    const found = await this.repo.findByEmail(String(email).trim());
    if (!found) {
      const e = new Error('NotFound');
      e.code = 'NOT_FOUND';
      throw e;
    }
    return new Employee(found);
  }

  /** lista todos */
  async list() {
    const all = await this.repo.list();
    return all.map(r => new Employee(r));
  }
}
