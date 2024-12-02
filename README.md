# Portal GeHfer

O Portal GeHfer é uma aplicação web modular para gerenciamento de operações empresariais, com foco nos módulos de Portaria, Qualidade e Administração.

## Tecnologias Utilizadas

- React 18 com TypeScript
- Tailwind CSS para estilização
- Supabase para backend e autenticação
- Shadcn/UI para componentes de interface
- React Query para gerenciamento de estado e cache
- React DnD para funcionalidades de drag-and-drop

## Módulos

### Módulo de Portaria

- Controle de entrada e saída de veículos
- Sistema Kanban para filas de operação
- Gestão de documentos e evidências
- Dashboard em tempo real
- Agendamento de operações

### Módulo de Qualidade

- Gestão completa de RNCs (Registros de Não Conformidade)
- Sistema de anexos e evidências
- Workflow configurável de aprovação
- Relatórios e métricas
- Gestão de coletas e devoluções

### Módulo de Administração

- Gerenciamento de usuários e perfis
- Configurações do sistema
- Controle de acesso baseado em módulos
- Auditoria de operações

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
  │   ├── admin/     # Componentes do módulo admin
  │   ├── portaria/  # Componentes do módulo portaria
  │   ├── quality/   # Componentes do módulo qualidade
  │   └── ui/        # Componentes de interface base
  ├── hooks/         # Hooks personalizados
  ├── integrations/  # Integrações (Supabase, etc)
  ├── modules/       # Módulos da aplicação
  ├── pages/         # Páginas principais
  ├── routes/        # Configuração de rotas
  └── types/         # Definições de tipos
```

## Funcionalidades Principais

- **Autenticação**: Sistema completo de login e controle de acesso
- **Gestão de RNCs**: Workflow completo de qualidade
- **Controle de Portaria**: Gestão de entrada/saída
- **Gestão de Usuários**: Controle granular de permissões
- **Relatórios**: Dashboards e métricas em tempo real
- **Notificações**: Sistema de notificações em tempo real
- **Upload de Arquivos**: Gestão de anexos e evidências

## Próximos Passos

- [ ] Implementar módulo de BI
- [ ] Adicionar integração com SAP
- [ ] Desenvolver app mobile
- [ ] Implementar chat interno
- [ ] Expandir relatórios avançados

## Suporte

Em caso de problemas:
1. Verifique os logs no console
2. Confira as configurações do Supabase
3. Verifique as permissões do usuário
4. Entre em contato com o suporte técnico