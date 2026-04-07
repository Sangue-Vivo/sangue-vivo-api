# Sangue Vivo API

API REST da plataforma gamificada de doação de sangue para estudantes universitários de Alagoas.

## Tecnologias

- **Node.js** + **TypeScript**
- **Express 5** — Framework HTTP
- **PostgreSQL** + **Sequelize ORM** — Banco de dados
- **JWT** — Autenticação
- **Zod** — Validação de schemas
- **Resend** — Envio de emails
- **Helmet / CORS / Rate Limit** — Segurança

## Pré-requisitos

- Node.js 18+
- PostgreSQL rodando localmente
- Banco de dados `sangue_vivo` criado

```bash
createdb sangue_vivo
```

## Instalação

```bash
npm install
cp .env.example .env
```

Edite o `.env` com suas credenciais.

## Variáveis de Ambiente

| Variável | Descrição | Default |
|----------|-----------|---------|
| `PORT` | Porta do servidor | `3000` |
| `DATABASE_URL` | URL de conexão PostgreSQL | `postgres://postgres:postgres@localhost:5432/sangue_vivo` |
| `JWT_SECRET` | Chave secreta para tokens JWT | — |
| `JWT_EXPIRES_IN` | Tempo de expiração do token | `7d` |
| `FRONTEND_URL` | URL do frontend (CORS) | `http://localhost:5173` |
| `RESEND_API_KEY` | Chave da API Resend para emails | — |

## Scripts

```bash
npm run dev      # Servidor em modo desenvolvimento (hot reload)
npm run build    # Build para produção
npm start        # Executa build de produção
npm run seed     # Popula o banco com dados iniciais
```

## Estrutura do Projeto

```
src/
├── config/          # Variáveis de ambiente e constantes
├── database/
│   ├── models/      # Models Sequelize (User, Donation, Cause, Achievement...)
│   └── seeders/     # Seeds do banco de dados
├── lib/             # Utilitários (JWT, email, CSV)
├── middlewares/     # Auth, admin, validação, error handler
├── modules/
│   ├── auth/        # Registro, login, reset de senha
│   ├── users/       # Perfil, ranking, histórico
│   ├── causes/      # Campanhas de doação
│   ├── donations/   # Agendamento e gestão de doações
│   ├── achievements/# Sistema de conquistas
│   ├── notifications/# Notificações do sistema
│   └── admin/       # Estatísticas e exportações
├── utils/           # Gamificação, compatibilidade sanguínea
├── app.ts           # Configuração Express
└── server.ts        # Entry point
```

## Endpoints

### Auth — `/api/auth`
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/register` | Cadastro de usuário |
| POST | `/login` | Login |
| GET | `/me` | Usuário autenticado |
| POST | `/forgot-password` | Solicitar reset de senha |
| POST | `/reset-password` | Redefinir senha |

### Users — `/api/users`
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/` | Listar usuários |
| GET | `/:id` | Buscar usuário |
| PUT | `/:id` | Atualizar perfil |
| GET | `/:id/achievements` | Conquistas do usuário |
| GET | `/:id/donations` | Doações do usuário |

### Causes — `/api/causes`
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/` | Listar causas |
| GET | `/compatible` | Causas compatíveis com o tipo sanguíneo |
| GET | `/:id` | Detalhes da causa |
| POST | `/` | Criar causa (admin) |
| PUT | `/:id` | Editar causa (admin) |
| PATCH | `/:id/status` | Alterar status (admin) |
| DELETE | `/:id` | Remover causa (admin) |

### Donations — `/api/donations`
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/` | Agendar doação |
| GET | `/` | Listar doações do usuário |
| GET | `/:id` | Detalhes da doação |
| PATCH | `/:id/cancel` | Cancelar doação |
| PATCH | `/:id/complete` | Confirmar doação (admin) |
| PATCH | `/:id/no-show` | Marcar ausência (admin) |

### Achievements — `/api/achievements`
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/` | Listar conquistas |
| GET | `/:id` | Detalhes da conquista |

### Notifications — `/api/notifications`
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/` | Listar notificações |
| PATCH | `/:id/read` | Marcar como lida |
| DELETE | `/:id` | Remover notificação |

### Admin — `/api/admin`
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/stats` | Estatísticas gerais |
| GET | `/stats/donations-by-month` | Doações por mês |
| GET | `/stats/blood-distribution` | Distribuição por tipo sanguíneo |
| GET | `/stats/university-stats` | Estatísticas por universidade |
| GET | `/stats/rank-distribution` | Distribuição de ranks |
| GET | `/export/users` | Exportar usuários (CSV) |
| GET | `/export/donations` | Exportar doações (CSV) |
| GET | `/export/causes` | Exportar causas (CSV) |

## Gamificação

| Rank | XP necessário |
|------|--------------|
| Gota | 0 |
| Doador Bronze | 200 |
| Doador Prata | 500 |
| Doador Ouro | 1000 |
| Doador Platina | 2000 |
| Guardião da Vida | 3000 |
| Herói de Sangue | 4000 |

**XP por doação:** 100 base + 50 (vinculada a causa) + 30 (causa urgente)

## Licença

Este projeto é de uso acadêmico.
