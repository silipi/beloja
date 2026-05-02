# Supabase — Beloja

Este diretório contém migrations e configurações do banco de dados Supabase do projeto Beloja.

---

## Aplicando o schema inicial

Existem dois caminhos para aplicar a migration `00000000000001_initial_schema.sql`:

---

### Caminho A — SQL Editor (rápido, recomendado para MVP)

1. Acesse [supabase.com/dashboard](https://supabase.com/dashboard) e abra seu projeto.
2. No menu lateral, clique em **SQL Editor**.
3. Clique em **New query**.
4. Copie o conteúdo inteiro de `migrations/00000000000001_initial_schema.sql` e cole no editor.
5. Clique em **Run** (ou `Cmd+Enter`).

Pronto. O schema, RLS e buckets de storage estarão criados.

**Quando usar**: fase de desenvolvimento inicial, prototipagem rápida, ou quando a CLI não estiver configurada.

---

### Caminho B — Supabase CLI (recomendado pós-MVP)

A CLI permite versionar e aplicar migrations de forma controlada, como um ORM migration runner.

#### 1. Instalar a CLI

**macOS (recomendado via Homebrew):**

```bash
brew install supabase/tap/supabase
```

**Alternativa (via npm — mas prefira Homebrew):**

```bash
npm install -g supabase
```

> O pacote `supabase` está no `devDependencies` do projeto, mas o binário Go da CLI pode não ser criado corretamente pelo pnpm em todas as plataformas. Use Homebrew como fallback.

#### 2. Login

```bash
supabase login
```

#### 3. Vincular o projeto local

```bash
supabase link --project-ref SEU_PROJECT_ID
```

Onde `SEU_PROJECT_ID` é o ID que aparece na URL do dashboard: `app.supabase.com/project/<ID>`.

#### 4. Aplicar migrations

```bash
supabase db push
```

Isso aplica todas as migrations pendentes em ordem.

#### 5. Gerar types TypeScript após a migration

```bash
pnpm supabase:types
```

---

## Estrutura de arquivos

```
supabase/
├── migrations/
│   └── 00000000000001_initial_schema.sql   # Schema completo + RLS + Storage
└── README.md                                 # Este arquivo
```

---

## Convenções

- **Migrations**: numeradas com timestamp prefix `YYYYMMDDHHMMSS_descricao.sql`.
- **RLS**: todas as tabelas têm RLS habilitado. Acesso sem autenticação é explícito via policy `using (true)`.
- **Storage paths**: arquivos são armazenados em `{user_id}/{filename}` para que as policies de storage funcionem corretamente.
- **Preços**: armazenados em centavos (integer) para evitar problemas de ponto flutuante.
- **Pedidos de clientes**: clientes finais não são usuários Supabase — são leads anônimos registrados na tabela `pedidos`.

---

## Configurações manuais no Dashboard

Após aplicar o schema, configure no dashboard:

### Auth → URL Configuration

- **Site URL**: `http://localhost:3000` (dev) / `https://seudominio.com.br` (prod)
- **Redirect URLs**: adicione `http://localhost:3000/auth/callback` e `https://seudominio.com.br/auth/callback`

### Auth → Email Templates (opcional)

Personalize o template de Magic Link com o nome da marca Beloja.

### Auth → Providers

O projeto usa **Magic Link (OTP por email)** como método principal. Não é necessário habilitar providers OAuth para o MVP.
