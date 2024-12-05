# Documentação do Webhook n8n para Notificações de RNC

## Visão Geral
Este documento descreve a integração entre o sistema de RNCs (Registro de Não Conformidade) e o n8n para automação de notificações. A integração utiliza webhooks para enviar informações sobre mudanças de status das RNCs, permitindo automação de processos e notificações.

## Arquitetura

### Componentes Principais
1. **Supabase**
   - Banco de dados PostgreSQL
   - Funções e triggers PL/pgSQL
   - Configurações de ambiente

2. **n8n**
   - Plataforma de automação
   - Webhook receiver
   - Workflows personalizáveis

3. **Sistema RNC**
   - Frontend React
   - Gerenciamento de estados
   - Interface com usuário

## Configuração Detalhada

### 1. Configuração no n8n

#### 1.1 Criar Novo Workflow
1. Acesse sua instância n8n
2. Clique em "New Workflow"
3. Nomeie o workflow (ex: "RNC Status Notifications")

#### 1.2 Configurar Webhook Trigger
1. Adicione um nó "Webhook"
2. Configurações do webhook:
   - Método: POST
   - Path: /rnc-status (ou personalizado)
   - Response: JSON
   - Authentication: Opcional (recomendado)

#### 1.3 Processamento de Dados
Configure nós adicionais para:
- Filtrar notificações por tipo
- Formatar mensagens
- Enviar emails
- Integrar com outros sistemas

### 2. Configuração no Supabase

#### 2.1 Variável de Ambiente
```sql
-- No console SQL do Supabase
ALTER DATABASE postgres 
SET app.n8n_webhook_url = 'https://seu-n8n.exemplo.com/webhook/123456';
```

#### 2.2 Função de Trigger
A função `handle_workflow_notification` já está configurada e:
- Monitora mudanças de status
- Valida dados
- Envia notificações
- Registra logs

#### 2.3 Estrutura de Dados
Payload enviado ao webhook:
```json
{
  "rnc_number": "123",
  "old_status": "open",
  "new_status": "analysis",
  "assigned_user_email": "usuario@exemplo.com",
  "assigned_user_name": "Nome do Usuário",
  "description": "Descrição da RNC"
}
```

### 3. Fluxo de Dados

#### 3.1 Trigger Events
1. Usuário atualiza status da RNC
2. Trigger `on_workflow_status_change` é acionado
3. Função `handle_workflow_notification` executa

#### 3.2 Validações
- Mudança efetiva de status
- Configuração de workflow existente
- Usuário atribuído válido
- URL do webhook configurada

#### 3.3 Processamento
1. Coleta dados relevantes
2. Formata payload
3. Envia para webhook
4. Registra resultado

## Monitoramento e Manutenção

### 1. Logs
```sql
-- Consultar logs recentes
SELECT * FROM pg_logs 
WHERE message LIKE '%Workflow notification%'
ORDER BY log_time DESC
LIMIT 100;
```

### 2. Troubleshooting

#### 2.1 Problemas Comuns
1. **Webhook não recebe dados**
   - Verificar URL configurada
   - Confirmar permissões de rede
   - Validar formato dos dados

2. **Erros de Processamento**
   - Consultar logs do Supabase
   - Verificar payload
   - Validar configurações do n8n

#### 2.2 Verificações
- Status do serviço n8n
- Conectividade de rede
- Configurações do webhook
- Logs de execução

### 3. Boas Práticas

#### 3.1 Segurança
- Use HTTPS para webhook
- Implemente autenticação
- Limite acesso à URL
- Monitore tentativas falhas

#### 3.2 Performance
- Configure timeouts adequados
- Monitore tempo de resposta
- Implemente retry logic
- Use rate limiting

## Customização

### 1. Payload Personalizado
Modifique a função para incluir dados adicionais:
```sql
jsonb_build_object(
  'custom_field', NEW.campo_personalizado,
  'additional_info', (SELECT info FROM tabela_extra WHERE id = NEW.id)
)
```

### 2. Workflows Adicionais
- Notificações por email
- Integração com Slack/Teams
- Atualização de sistemas externos
- Geração de relatórios

## Referências

### Documentação
- [Documentação n8n](https://docs.n8n.io/)
- [Supabase Functions](https://supabase.com/docs/guides/functions)
- [PostgreSQL Triggers](https://www.postgresql.org/docs/current/triggers.html)

### Suporte
- Supabase Discord
- n8n Community Forum
- Documentação interna

## Checklist de Implementação

### Inicial
- [ ] Criar workflow no n8n
- [ ] Configurar webhook
- [ ] Definir variáveis de ambiente
- [ ] Testar conexão

### Validação
- [ ] Testar mudanças de status
- [ ] Verificar payload
- [ ] Confirmar notificações
- [ ] Validar logs

### Produção
- [ ] Backup configurações
- [ ] Documentar endpoints
- [ ] Configurar monitoramento
- [ ] Treinar equipe