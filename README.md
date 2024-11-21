# Portal GeHfer

O Portal GeHfer é uma aplicação web modular para gerenciamento de operações empresariais, com foco inicial nos módulos de Qualidade e Administração.

## Tecnologias Utilizadas

- React com TypeScript
- Tailwind CSS para estilização
- Supabase para backend e autenticação
- Shadcn/UI para componentes de interface

## Módulos

### Módulo de Qualidade

- Dashboard com KPIs de RNCs
- Gerenciamento de RNCs (Registros de Não Conformidade)
- Relatórios e análises

### Módulo de Administração

- Gerenciamento de usuários
- Configurações do sistema
- Controle de acesso

## Como executar o projeto

```bash
# Instalar dependências
npm install

# Iniciar em modo desenvolvimento
npm run dev
```

## Estrutura do Projeto

```
src/
  ├── components/     # Componentes reutilizáveis
  ├── pages/         # Páginas da aplicação
  ├── lib/           # Utilitários e configurações
  └── styles/        # Estilos globais
```

## Próximos Passos

- [ ] Implementar autenticação com Supabase
- [ ] Desenvolver CRUD completo de RNCs
- [ ] Adicionar módulo de administração
- [ ] Implementar relatórios avançados