# Portal GeHfer - Documentação Técnica

## Visão Geral
O Portal GeHfer é uma aplicação web modular desenvolvida para gerenciar operações empresariais, com foco inicial nos módulos de Portaria, Qualidade e Administração. A aplicação utiliza tecnologias modernas e segue as melhores práticas de desenvolvimento.

## Arquitetura

### Frontend
- **React com TypeScript**: Framework principal
- **Tailwind CSS**: Sistema de estilização
- **Shadcn/UI**: Biblioteca de componentes
- **React Query**: Gerenciamento de estado e cache
- **React Router**: Roteamento
- **React DnD**: Funcionalidade de drag-and-drop

### Backend
- **Supabase**: Plataforma de backend
  - Banco de dados PostgreSQL
  - Autenticação e autorização
  - Armazenamento de arquivos
  - Edge Functions

## Módulos

### 1. Portaria
#### Controle de Acesso
- Registro de entrada e saída de caminhões
- Captura de documentos e fotos
- Monitoramento de status em tempo real
- Métricas e indicadores

#### Gestão de Filas
- Sistema Kanban para organização de caminhões
- Drag-and-drop entre filas
- Controle de status de operações
- Gestão de baias

### 2. Qualidade
- Gestão de RNCs (Registros de Não Conformidade)
- Dashboard com KPIs
- Sistema de anexos
- Histórico de eventos

### 3. Administração
- Gerenciamento de usuários
- Controle de acesso baseado em módulos
- Configurações do sistema

## Estrutura do Projeto
```
src/
  ├── components/     # Componentes reutilizáveis
  │   ├── ui/        # Componentes base (shadcn)
  │   ├── portaria/  # Componentes do módulo portaria
  │   └── quality/   # Componentes do módulo qualidade
  ├── hooks/         # Hooks personalizados
  ├── pages/         # Páginas da aplicação
  ├── types/         # Definições de tipos
  └── integrations/  # Integrações (Supabase, etc)
```

## Modelo de Dados

### Principais Tabelas
- `trucks`: Cadastro de caminhões
- `truck_access_logs`: Registros de acesso
- `operations`: Operações de carga/descarga
- `rncs`: Registros de não conformidade
- `profiles`: Perfis de usuário

## Fluxos Principais

### Portaria
1. **Registro de Entrada**
   - Cadastro do caminhão
   - Registro de documentos
   - Criação do log de acesso

2. **Gestão de Operações**
   - Movimentação entre filas
   - Atualização de status
   - Registro de pesagens

3. **Finalização**
   - Registro de saída
   - Atualização de status
   - Geração de documentação

## Próximos Passos e Melhorias Sugeridas

### 1. Arquitetura e Performance
- [ ] Implementar cache local com React Query
- [ ] Adicionar testes automatizados (Jest/Testing Library)
- [ ] Implementar PWA para uso offline
- [ ] Otimizar carregamento com lazy loading

### 2. Módulo Portaria
- [ ] Adicionar sistema de agendamento
- [ ] Implementar notificações em tempo real
- [ ] Adicionar reconhecimento automático de placas
- [ ] Desenvolver dashboard com métricas avançadas
- [ ] Integrar com balanças automatizadas

### 3. Módulo Qualidade
- [ ] Implementar workflow configurável para RNCs
- [ ] Adicionar sistema de alertas
- [ ] Desenvolver relatórios personalizáveis
- [ ] Integrar com sistema de gestão documental

### 4. Segurança e Compliance
- [ ] Implementar autenticação 2FA
- [ ] Adicionar registro de auditoria (audit log)
- [ ] Desenvolver sistema de backup automático
- [ ] Implementar políticas de retenção de dados

### 5. Experiência do Usuário
- [ ] Melhorar responsividade em dispositivos móveis
- [ ] Adicionar temas personalizáveis
- [ ] Implementar tour guiado para novos usuários
- [ ] Desenvolver sistema de ajuda contextual

### 6. Integrações
- [ ] Integrar com sistemas ERP
- [ ] Adicionar APIs para integração externa
- [ ] Implementar webhooks para eventos
- [ ] Desenvolver integração com sistemas de câmeras

## Boas Práticas
- Manter documentação atualizada
- Seguir padrões de código estabelecidos
- Realizar code reviews
- Manter testes atualizados
- Documentar alterações no CHANGELOG

## Considerações de Segurança
- Manter dependências atualizadas
- Seguir princípios de menor privilégio
- Implementar validação de entrada
- Manter logs de segurança
- Realizar auditorias periódicas

## Suporte e Manutenção
- Monitorar performance
- Manter backups regulares
- Documentar problemas conhecidos
- Manter rotina de atualizações