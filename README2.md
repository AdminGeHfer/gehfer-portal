# Portal GeHfer - Documentação Técnica

## Visão Geral
O Portal GeHfer é uma aplicação web modular desenvolvida para gerenciar operações empresariais, com foco nos módulos de Portaria, Qualidade e Administração. A aplicação utiliza tecnologias modernas e segue as melhores práticas de desenvolvimento.

## Arquitetura

### Frontend
- **React com TypeScript**: Framework principal
- **Tailwind CSS**: Sistema de estilização
- **Shadcn/UI**: Biblioteca de componentes
- **React Query**: Gerenciamento de estado e cache
- **React Router**: Roteamento
- **React DnD**: Funcionalidade de drag-and-drop

### Backend (Supabase)
- **PostgreSQL**: Banco de dados principal
- **Autenticação**: Sistema completo de auth
- **Storage**: Armazenamento de arquivos
- **Row Level Security**: Políticas de segurança por linha
- **Edge Functions**: Funções serverless

## Módulos

### 1. Portaria
- Registro de entrada/saída de caminhões
- Sistema Kanban para filas
- Gestão de documentos
- Dashboard em tempo real
- Agendamento de operações

### 2. Qualidade
- Gestão de RNCs
- Sistema de anexos
- Workflow de aprovação
- Relatórios e métricas

### 3. Administração
- Gestão de usuários e perfis
- Controle de acesso por módulo
- Configurações do sistema

## Estrutura do Projeto
```
src/
  ├── components/     # Componentes reutilizáveis
  ├── hooks/         # Hooks personalizados
  ├── pages/         # Páginas da aplicação
  ├── types/         # Definições de tipos
  └── integrations/  # Integrações externas
```

## Próximos Passos

### Performance
- [ ] Implementar cache local com React Query
- [ ] Otimizar carregamento de imagens
- [ ] Adicionar PWA para uso offline

### Portaria
- [ ] Sistema de agendamento avançado
- [ ] Integração com balanças
- [ ] OCR para placas de caminhões
- [ ] Notificações em tempo real

### Qualidade
- [ ] Workflow configurável para RNCs
- [ ] Sistema de alertas
- [ ] Integração com SAP
- [ ] Dashboard personalizado

### Segurança
- [ ] Autenticação 2FA
- [ ] Audit logs
- [ ] Backup automático
- [ ] Políticas de retenção

### UX/UI
- [ ] Temas personalizáveis
- [ ] Tour guiado
- [ ] Ajuda contextual
- [ ] Melhorar responsividade