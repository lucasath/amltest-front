# Documentação — Frontend Next.js (Sistema de Tarefas)

## Visão Geral

Este documento descreve a implementação do **frontend** em **Next.js** para o Sistema de Tarefas, que consome o backend exposto em Java Spring Boot.

A aplicação permite listar, criar, filtrar, ordenar, concluir e excluir tarefas, refletindo visualmente o estado de cada uma.

---

## Tecnologias Utilizadas

- **Next.js** (versão recente)
- **React**
- **npm** (gerenciamento de pacotes)
- **Axios** ou Fetch API para comunicação HTTP com o backend
- **Tailwind CSS** para estilização

---

## Estrutura do Projeto

```
frontend-next/
├─ public/
├─ src/
│  ├─ app/
|  |  ├─ @types/
│  │  ├─ pages/
│  |  ├─ components/
|  |  |  ├─ forms/
|  |  |     └─ TaskForm/
|  |  |  └─ molecules/
|  |  |     └─ TaskList/
│  │  ├─ context/
|  |  |  └─ formContext/
│  │  ├─ hooks/
|  |  |  └─ form/
│  |  ├─ service/
│  |  |  ├─ categorias/
│  |  |  ├─ tarefas/
|  |  |  └─ api/
│  │  └─ templates
|  |     └─ Tasks/
│  └─ styles/
└─ package.json
```

## Fluxo de Funcionalidades

1. **Carregar Página** → buscar categorias e lista inicial de tarefas.
2. **Adicionar Tarefa** → enviar formulário.
3. **Concluir Tarefa** → botão "Concluir" → chama `PUT /api/tasks/{id}/complete`.
4. **Excluir Tarefa** → botão "Excluir" → chama `DELETE /api/tasks/{id}`.
5. **Filtrar/Ordenar** → altera filtros → `TaskList` rebusca tarefas.
6. **UI Dinâmica** → tarefas concluídas têm estilo diferenciado.

---

## Execução

### Instalação e desenvolvimento

```bash
# instalar dependências
npm install

# rodar em desenvolvimento
npm run dev
```

### Build e produção

```bash
npm run build
npm run start
```

### Variáveis de ambiente

No arquivo `.env.dvelopment`:

```
URL_API=http://localhost:8080
```

---

## Check-list

- ✅ Listagem de tarefas funcionando
- ✅ Formulário para adicionar tarefas com campos obrigatórios
- ✅ Filtro por categoria e ordenação por prazo
- ✅ Marcar como concluída e excluir tarefas
- ✅ Estilo diferenciado para concluídas

---

## Possíveis Melhorias Futuras

- Paginação da lista (backend já suporta)
- Validação de formulários com React Hook Form ou Yup
- Autenticação (ex.: JWT)

---

Esse frontend em Next.js garante integração simples com o backend e uma experiência de gerenciamento de tarefas.
