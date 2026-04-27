# SkillMatch

Marketplace acadêmico que conecta estudantes de TI a projetos reais de micro e pequenas empresas, criando um ambiente prático de aprendizado e desenvolvimento de portfólio.

## 🚀 Tecnologias (Protótipo)

O projeto foi construído focado em ser um **protótipo frontend de demonstração**:
- **Framework:** React 18 + Vite
- **Estilização/Componentes:** Chakra UI v2 (Cuidado para não usar v3)
- **Animações:** Framer Motion (v10/v11)
- **Navegação:** React Router Dom
- **Armazenamento:** Nenhuma API ou banco de dados externo é utilizado. Tudo é persistido via `Context API` + `localStorage` com dados mockados.

## 🛠️ Como rodar o projeto

1. Clone o repositório.
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor local:
   ```bash
   npm run dev
   ```

## 🧠 Regras de Negócio e Lógica de App

- **1 Projeto por Aluno:** Se um aluno for aceito em um projeto (`em_projeto: true`), ele não pode se candidatar a novos projetos até concluir o atual.
- **Formação de Time:** Empresas abrem vagas (de 1 a N). Conforme aceitam candidaturas, o array `time` é preenchido. Quando lota, o projeto muda de `aberto` para `em_andamento`.
- **Resetar Dados:** Como é um protótipo, existe um botão de "Resetar Dados" no menu do usuário para restaurar o estado de todos os projetos, empresas e alunos ao padrão inicial da apresentação.
