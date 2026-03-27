# Padrões de Arquitetura e Regras do Projeto

Este documento define as regras arquiteturais para o desenvolvimento contínuo do projeto "Inventário de Notebooks", baseando-se nos princípios **SOLID**, na metodologia **Atomic Design** e no uso disciplinado do **Tailwind CSS**.

## 1. Atomic Design + Tailwind CSS
A estrutura de componentes deve seguir a separação proposta pelo Atomic Design para garantir reuso de código, isolamento de responsabilidades e manutenção simples. Seguindo o paradigma do Tailwind CSS, os estilos devem ser compostos majoritariamente via *utility classes* aplicadas diretamente aos componentes.

* **Átomos (Atoms):** Componentes visuais básicos que não podem ser subdivididos.
  * *Exemplos:* `Button`, `Input`, `Label`, `Icon`, `Badge`.
  * *Regra Tailwind:* Devem conter todas as classes base de estilo (`px-4 py-2 rounded-lg bg-blue-500 font-medium text-white`) e permitir que quem os consome adicione classes extras (via props `className`).
* **Moléculas (Molecules):** Grupos de átomos interligados que funcionam como uma pequena unidade funcional.
  * *Exemplos:* `SearchBox` (Input + Ícone), `FormField` (Label + Input + ErrorMessage).
  * *Regra:* O Tailwind aqui foca mais em layout flexível (`flex`, `gap-2`, `items-center`) para alinhar os átomos internos.
* **Organismos (Organisms):** Módulos complexos na interface formados por moléculas e átomos, possuindo responsabilidade de bloco na aplicação.
  * *Exemplos:* `Header`, `Sidebar`, `InventoryTable`, `AddNotebookForm`.
  * *Regra:* Gerenciam comportamentos de UI e podem lidar com estado local simples, mas enviam ações (eventos) à camada da página.
* **Templates / Layouts:** Componentes de estrutura que organizam onde os organismos se posicionam.
  * *Exemplos:* `DashboardLayout` ( Sidebar lateral presa à esquerda, navbar em cima, main content ao centro ).
* **Páginas (Pages):** Instâncias de layout populadas com dados.
  * *Exemplos:* `InventoryPage`, `SettingsPage`. Fazem a comunicação real com a API ou o Local Storage e repassam as props para os Organismos.

## 2. Princípios SOLID no Frontend
Todas as novas implementações ou refatorações (por exemplo, ao quebrar um HTML monolítico para componentes React/Vue/Svelte) devem honrar estruturalmente o padrão S.O.L.I.D:

* **SRP (Princípio da Responsabilidade Única):**
  * *Aplicação:* Componentes e funções devem ter apenas **uma razão para mudar**.
  * *Exemplo prático:* Separe a lógica de acesso a dados (como ler e salvar no `localStorage`) da lógica visual de renderizar a tabela. Crie "Serviços" (ex: `StorageService.js`) ou Custom Hooks genéricos (`useInventory`), enquanto a tabela `InventoryTable` cuida estritamente de plotar `<tr>/<td>`.
* **OCP (Princípio do Aberto/Fechado):**
  * *Aplicação:* Módulos devem estar **abertos para extensão, mas fechados para modificação**.
  * *Exemplo prático:* Um componente `Table` ou `Modal` deve receber seu conteúdo via `children` (slots) ou por meio de configuração de colunas, evitando que você altere o componente genérico toda vez que a equipe de produto pedir um campo ou coluna nova na tabela.
* **LSP (Princípio da Substituição de Liskov):**
  * *Aplicação:* Subtipos de um componente mãe devem substituí-lo e continuar atendendo ao contrato inicial sem bugs.
  * *Exemplo prático:* Criar um `DangerButton` envolta de um `Button` base. Ele deve ter a mesma "assinatura" (`onClick`, `disabled`, etc.) de modo que a tela pai o utilize sem nem se importar se é um botão especial ou básico.
* **ISP (Princípio da Segregação de Interfaces):**
  * *Aplicação:* Uma entidade não deve receber dados ou configurações das quais não precisa. 
  * *Exemplo prático:* Se o `StatusBadge` precisa apenas mostrar o status, não passe o objeto `Notebook` inteiro como propriedade. Passe a string específica: `<StatusBadge status={notebook.status} />`. Assim ele fica desacoplado do modelo central.
* **DIP (Princípio da Inversão de Dependência):**
  * *Aplicação:* Componentes visuais não podem depender de implementações rígidas de bancos de dados ou APIs. Ambos dependem de abstrações (ex: interfaces genéricas ou injeção de dependência).
  * *Exemplo prático:* O formulário de "Adicionar Notebook" não chama `localStorage.setItem` diretamente. Ele dispara um callback genérico genérico fornecido ao formulário (`onSubmit={data => ...}`). Quem resolve o que acontece na persistência do dado é o escopo superior (Página ou Contexto).

## 3. Diretrizes de Tailwind CSS
1. **Design Tokens Integrados:** Use as variáveis CSS no `tailwind.config.js`. Suas variáveis customizadas (ex: `--surface`, `--accent`) devem permear a configuração (ex: `colors: { surface: 'var(--surface)', accent: 'var(--accent)' }`) para viabilizar um dark mode sem duplicar centenas de classes pelo código.
2. **Priorize Componentizar a fazer `@apply`:** Resista à tentação de criar classes customizadas de CSS que nada mais são do que um conjunto empacotado de Tailwind via `@apply`. Se classes estiverem muito repetitivas em vários botões, transforme esse conjunto de elementos em um "Átomo" no seu framework web e aplique as *utility classes* lá.
3. **Consistência de Escala:** Procure usar espaçamentos (padding e margin), arredondamentos de bordas e pesos de fontes nativos do Tailwind, os quais criam um grid visualmente robusto (ex: usar uniformemente `gap-4` para grid e `p-4` nos containers de superfície).

---
**Guia Rápido de Adoção:**
Atualmente os arquivos podem estar estruturados sem separação (Vanilla). Para respeitar esse manifesto de arquitetura de imediato à medida que o projeto evoluir, o passo ideal é preparar/migrar o ambiente para **Vite + React** (ou ferramenta similar), criando as pastas `/src/components/atoms`, `/src/components/molecules`, `/src/components/organisms`, `/src/services`, baseando-se nas regras acima.
