# Portal GeHfer - Documentação Técnica

## Visão Geral
O Portal GeHfer é uma aplicação web modular desenvolvida para gerenciar operações empresariais, com foco nos módulos de Portaria, Qualidade e Administração. A aplicação utiliza tecnologias modernas e segue as melhores práticas de desenvolvimento.

## Arquitetura

### Frontend
- **React 18 com TypeScript**: Framework principal
- **Tailwind CSS**: Sistema de estilização
- **Shadcn/UI**: Biblioteca de componentes
- **React Query v5**: Gerenciamento de estado e cache
- **React Router v6**: Roteamento
- **React DnD**: Funcionalidade de drag-and-drop

### Backend (Supabase)
- **PostgreSQL**: Banco de dados principal
- **Autenticação**: Sistema completo de auth
- **Storage**: Armazenamento de arquivos
- **Row Level Security**: Políticas de segurança por linha
- **Edge Functions**: Funções serverless
- **Realtime**: Atualizações em tempo real

## Módulos

### 1. Portaria
- Registro de entrada/saída de caminhões
- Sistema Kanban para filas
- Gestão de documentos
- Dashboard em tempo real
- Agendamento de operações
- Controle de tacógrafos
- Pesagem de veículos

### 2. Qualidade
- Gestão de RNCs
- Sistema de anexos
- Workflow configurável
- Relatórios e métricas
- Gestão de coletas e devoluções
- Controle de devoluções
- Notificações automáticas

### 3. Administração
- Gestão de usuários e perfis
- Controle de acesso por módulos
- Configurações do sistema
- Auditoria de operações
- Gestão de workflows
- Configuração de notificações

## Como Executar o Projeto

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# Iniciar em modo desenvolvimento
npm run dev
```

## Estrutura do Projeto
```
src/
  ├── components/     # Componentes reutilizáveis
  │   ├── admin/     # Componentes administrativos
  │   ├── atoms/     # Componentes básicos
  │   ├── molecules/ # Componentes compostos
  │   └── organisms/ # Componentes complexos
  ├── hooks/         # Hooks personalizados
  ├── integrations/  # Integrações externas
  ├── modules/       # Módulos da aplicação
  ├── pages/         # Páginas da aplicação
  ├── routes/        # Configuração de rotas
  ├── types/         # Definições de tipos
  └── utils/         # Utilitários
```

## Funcionalidades Principais

- **Autenticação**: Sistema completo de login e controle de acesso
- **Gestão de RNCs**: Workflow completo de qualidade
- **Controle de Portaria**: Gestão de entrada/saída
- **Gestão de Usuários**: Controle granular de permissões
- **Relatórios**: Dashboards e métricas em tempo real
- **Notificações**: Sistema de notificações em tempo real
- **Upload de Arquivos**: Gestão de anexos e evidências

## Boas Práticas

### Performance
- Uso de React.memo para componentes puros
- Lazy loading de rotas e componentes
- Otimização de queries com React Query
- Caching eficiente de dados
- Compressão de imagens

### Segurança
- Autenticação robusta
- Políticas RLS no Supabase
- Sanitização de inputs
- Proteção contra XSS
- Validação de dados

### UX/UI
- Design responsivo
- Feedback visual claro
- Loading states
- Error boundaries
- Toasts informativos

## Manutenção

### Versionamento
- Git flow para branches
- Conventional commits
- Pull requests obrigatórios
- Code review necessário

### Testes
- Jest para testes unitários
- React Testing Library
- E2E com Cypress
- Testes de integração

### CI/CD
- GitHub Actions
- Deploy automático
- Validação de tipos
- Lint e formatação

## Próximos Passos

### Integrações
- [ ] Implementar módulo de BI
- [ ] Adicionar integração com SAP
- [ ] Desenvolver app mobile
- [ ] Implementar chat interno
- [ ] Expandir relatórios avançados
- [ ] Adicionar integração com o Korp
- [ ] Adicionar integração com o WhatsApp
- [ ] Adicionar/validar disparo de emails

### Performance
- [ ] Implementar SSR
- [ ] Otimizar bundle size
- [ ] Melhorar code splitting
- [ ] Adicionar PWA
- [ ] Implementar service workers

### Portaria
- [ ] Sistema de agendamento avançado
- [ ] Integração com balanças
- [ ] OCR para placas
- [ ] Notificações em tempo real
- [ ] App mobile para porteiros

### Qualidade
- [ ] Workflow configurável
- [ ] Sistema de alertas
- [ ] Integração com SAP
- [ ] Dashboard personalizado
- [ ] Relatórios avançados

### Segurança
- [ ] Autenticação 2FA
- [ ] Audit logs
- [ ] Backup automático
- [ ] Políticas de retenção
- [ ] Criptografia de dados sensíveis

### UX/UI
- [ ] Temas personalizáveis
- [ ] Tour guiado
- [ ] Ajuda contextual
- [ ] Melhorar acessibilidade
- [ ] Suporte a múltiplos idiomas
