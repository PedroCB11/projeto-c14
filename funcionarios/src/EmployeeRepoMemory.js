// Repositório em memória: guarda e busca funcionários
export class EmployeeRepoMemory {
  constructor() {
    /** @type {Map<string, any>} */
    this.byId = new Map();
    /** @type {Map<string, string>} email -> id */
    this.emailIndex = new Map();
  }

  _newId() {
    // ID legível: EMP-YYYYMMDDHHMMSS-<contador>
    const ts = new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 14);
    this._seq = (this._seq ?? 0) + 1;
    return `EMP-${ts}-${this._seq}`;
  }

  async create({ name, email }) {
    if (this.emailIndex.has(email)) {
      throw new Error('email already in use');
    }
    const id = this._newId();
    const record = { id, name, email };
    this.byId.set(id, record);
    this.emailIndex.set(email, id);
    return { ...record };
  }

  async findById(id) {
    const r = this.byId.get(id);
    return r ? { ...r } : null;
  }

  async findByEmail(email) {
    const id = this.emailIndex.get(email);
    if (!id) return null;
    const r = this.byId.get(id);
    return r ? { ...r } : null;
  }

  async list() {
    return [...this.byId.values()].map(v => ({ ...v }));
  }
}
