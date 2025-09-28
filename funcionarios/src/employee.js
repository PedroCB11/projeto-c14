// Entidade simples e imutável
export class Employee {
  constructor({ id, name, email }) {
    this.id = id;         // string única
    this.name = name;     // nome do funcionário
    this.email = email;   // identificador humano (único no sistema)
    Object.freeze(this);
  }
}
