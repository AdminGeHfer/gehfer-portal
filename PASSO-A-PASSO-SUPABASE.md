# Passo a Passo - Configuração do Banco de Dados Supabase

## 1. Configuração Inicial

### Configurar Variáveis de Ambiente
```bash
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anon
```

### Configurar Autenticação
1. Habilitar provedores desejados (Email, Google, etc)
2. Configurar URLs de redirecionamento
3. Personalizar templates de email

## 2. Tabelas Principais

### Perfis de Usuário
```sql
create table public.profiles (
  id uuid references auth.users primary key,
  name text,
  email text,
  department text,
  modules text[] default '{}',
  active boolean default true,
  password_reset_needed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
```

### Caminhões e Operações
```sql
create table public.trucks (
  id uuid primary key default gen_random_uuid(),
  plate text not null,
  driver_name text not null,
  truck_type text not null,
  transport_company text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table public.operations (
  id uuid primary key default gen_random_uuid(),
  truck_id uuid references public.trucks,
  operation_type text not null,
  status text not null,
  entry_time timestamp with time zone default now(),
  exit_time timestamp with time zone,
  created_at timestamp with time zone default now()
);
```

### RNCs e Workflows
```sql
create table public.rncs (
  id uuid primary key default gen_random_uuid(),
  description text not null,
  status status_enum not null default 'open',
  priority text not null default 'medium',
  type text not null,
  department department_enum not null,
  company text not null,
  cnpj text not null,
  created_at timestamp with time zone default now(),
  created_by uuid references public.profiles
);

create table public.rnc_workflow_transitions (
  id uuid primary key default gen_random_uuid(),
  rnc_id uuid references public.rncs,
  from_status rnc_workflow_status_enum,
  to_status rnc_workflow_status_enum not null,
  created_by uuid references public.profiles,
  created_at timestamp with time zone default now()
);
```

## 3. Políticas de Segurança (RLS)

### Perfis
```sql
alter table public.profiles enable row level security;

create policy "Usuários podem ver todos os perfis"
on public.profiles for select using (true);

create policy "Usuários podem atualizar seu próprio perfil"
on public.profiles for update using (auth.uid() = id);
```

### RNCs
```sql
alter table public.rncs enable row level security;

create policy "Usuários podem ver todas as RNCs"
on public.rncs for select using (true);

create policy "Usuários podem criar RNCs"
on public.rncs for insert with check (true);

create policy "Usuários podem atualizar suas próprias RNCs"
on public.rncs for update using (created_by = auth.uid());
```

## 4. Storage

### Configurar Buckets
```sql
insert into storage.buckets (id, name, public)
values 
  ('avatars', 'avatars', true),
  ('rnc-attachments', 'rnc-attachments', true),
  ('collection-evidence', 'collection-evidence', true);
```

### Políticas de Storage
```sql
create policy "Arquivos públicos são visíveis"
on storage.objects for select
using ( bucket_id in ('avatars', 'rnc-attachments', 'collection-evidence') );

create policy "Usuários autenticados podem fazer upload"
on storage.objects for insert
with check ( auth.role() = 'authenticated' );
```

## 5. Funções e Triggers

### Criação de Usuário
```sql
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, email)
  values (new.id, new.raw_user_meta_data->>'name', new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

### Notificações
```sql
create function public.handle_rnc_notification()
returns trigger
language plpgsql
security definer
as $$
begin
  if OLD.status != NEW.status then
    insert into public.notifications (user_id, title, message, type)
    values (
      NEW.created_by,
      'Status Atualizado',
      format('RNC #%s: %s -> %s', NEW.id, OLD.status, NEW.status),
      'rnc_status'
    );
  end if;
  return NEW;
end;
$$;

create trigger on_rnc_status_change
  after update on public.rncs
  for each row
  when (OLD.status IS DISTINCT FROM NEW.status)
  execute procedure public.handle_rnc_notification();
```

## 6. Verificação e Manutenção

### Checklist de Verificação
- [ ] Todas as tabelas criadas corretamente
- [ ] Políticas RLS ativas e funcionando
- [ ] Triggers respondendo adequadamente
- [ ] Buckets de storage configurados
- [ ] Backup automático habilitado

### Manutenção Regular
1. Verificar logs de erro
2. Monitorar performance
3. Atualizar políticas conforme necessário
4. Backup regular dos dados
5. Limpeza de dados obsoletos

## 7. Troubleshooting

### Problemas Comuns
1. Erro de permissão: Verificar políticas RLS
2. Trigger não dispara: Verificar logs
3. Upload falha: Verificar configurações do bucket
4. Query lenta: Verificar índices

### Suporte
- Documentação Supabase
- Discord da comunidade
- GitHub Issues
- Suporte técnico oficial