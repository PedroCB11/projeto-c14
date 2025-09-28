# Sistema de Funcionários (C214)

Projeto simples em **Node.js (ESM)** para gerenciamento e validação de funcionários. Inclui **testes unitários** (com Jest + mocks) e **testes de integração** (com repositório em memória).

---

## 📦 Pré-requisitos

- [Node.js](https://nodejs.org/) v20+
- [npm](https://www.npmjs.com/) (já vem com o Node)

---

## 🚀 Executando o projeto

1. Clone este repositório:
   ```bash
   git clone https://github.com/<seu-usuario>/projeto-c214.git
   cd projeto-c214/funcionarios
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. (Opcional) Rode o script de setup:
   ```bash
   bash scripts/setup.sh
   ```

---

## 🧪 Executando os testes

O projeto usa [Jest](https://jestjs.io/) em modo ESM.

- Rodar todos os testes:
  ```bash
  npm test
  ```

- Rodar com relatório de cobertura (HTML + JSON):
  ```bash
  npm test -- --coverage --json --outputFile=test-report/jest-report.json
  ```

Os relatórios ficam em:
- `coverage/index.html` → Cobertura de código
- `test-report/jest-report.html` → Relatório de testes em HTML
- `test-report/jest-report.json` → Relatório em JSON

---

## ⚙️ Estrutura do projeto

```
funcionarios/
 ├─ src/
 │   ├─ Employee.js             # Entidade funcionário
 │   ├─ EmployeeRepoMemory.js   # Repositório em memória
 │   └─ EmployeeService.js      # Regras de negócio
 ├─ tests/
 │   ├─ EmployeeRepoMemory.test.js
 │   ├─ EmployeeService.unit.test.js
 │   └─ EmployeeService.integration.test.js
 ├─ scripts/
 │   ├─ setup.sh                # Instala dependências extras (CI)
 │   └─ send_email.js           # Script de notificação por e-mail
 ├─ jest.config.mjs
 ├─ package.json
 └─ README.md
```

---

## 🔄 CI/CD (GitHub Actions)

O repositório inclui um pipeline (`.github/workflows/ci.yml`) com três jobs:

1. **tests** → instala dependências e executa Jest com cobertura.
2. **build** → empacota o projeto (`npm pack`) e gera artefatos.
3. **notifação** → envia e-mail de notificação usando `send_email.js`.

Artefatos publicados:
- Relatórios de teste (`test-report/`)
- Relatórios de cobertura (`coverage/`)
- Pacote gerado (`.tgz` + `source.zip`)