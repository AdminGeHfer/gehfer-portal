# Passo a Passo - Configuração do Banco de Dados Supabase

## 1. Criação das Tabelas Principais

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

### Caminhões
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
```

### Registros de Acesso
```sql
create table public.truck_access_logs (
  id uuid primary key default gen_random_uuid(),
  truck_id uuid references public.trucks,
  entry_time timestamp with time zone default now(),
  exit_time timestamp with time zone,
  purpose text not null,
  driver_document text,
  driver_photo text,
  truck_photo text,
  cargo_description text,
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
```

### RNCs (Registros de Não Conformidade)
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
  order_number text,
  return_number text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  closed_at timestamp with time zone,
  created_by uuid not null references public.profiles,
  assigned_to uuid references public.profiles,
  rnc_number serial
);
```

## 2. Configuração de Armazenamento

### Criar Bucket para Anexos
```sql
insert into storage.buckets (id, name, public)
values ('rnc-attachments', 'rnc-attachments', true);
```

## 3. Configuração de Autenticação

### Trigger para Novos Usuários
```sql
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
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

## 4. Políticas de Segurança (RLS)

### Perfis
```sql
alter table public.profiles enable row level security;

create policy "Usuários podem ver todos os perfis"
on public.profiles for select
to authenticated
using (true);

create policy "Usuários podem atualizar seu próprio perfil"
on public.profiles for update
to authenticated
using (auth.uid() = id);
```

### RNCs
```sql
alter table public.rncs enable row level security;

create policy "Usuários podem ver todas as RNCs"
on public.rncs for select
to authenticated
using (true);

create policy "Usuários podem criar RNCs"
on public.rncs for insert
to authenticated
with check (true);

create policy "Usuários podem atualizar suas próprias RNCs"
on public.rncs for update
to authenticated
using (created_by = auth.uid());
```

## 5. Funções Auxiliares

### Obter Módulos do Usuário
```sql
create or replace function public.get_user_modules()
returns text[]
language sql
security definer
as $$
  select modules
  from profiles
  where id = auth.uid();
$$;
```

## Dicas Importantes

1. **Backup**: Sempre faça backup antes de executar comandos SQL
2. **Ordem**: Execute os comandos na ordem apresentada
3. **Teste**: Após cada comando, verifique se funcionou
4. **Permissões**: Certifique-se que as políticas RLS estão corretas
5. **Dados**: Faça testes com dados reais após configurar

## Verificação

Após executar todos os comandos, verifique:
1. Se consegue criar usuários
2. Se os perfis são criados automaticamente
3. Se consegue fazer upload de arquivos
4. Se as políticas de segurança estão funcionando
5. Se as relações entre tabelas estão corretas

## Suporte

Em caso de problemas:
1. Verifique os logs do Supabase
2. Confira as políticas RLS
3. Teste as queries diretamente no SQL Editor
4. Verifique as permissões dos buckets de storage