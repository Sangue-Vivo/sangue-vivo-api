import app from './app';
import { env } from './config/env';
import sequelize from './database';

async function start() {
  try {
    await sequelize.authenticate();
    console.log('[DB] Conexão com PostgreSQL estabelecida.');

    // Sync models (dev only — use migrations in production)
    await sequelize.sync({ alter: true });
    console.log('[DB] Models sincronizados.');

    app.listen(env.PORT, () => {
      console.log(`[SERVER] Sangue Vivo API rodando em http://localhost:${env.PORT}`);
      console.log(`[SERVER] Health check: http://localhost:${env.PORT}/api/health`);
    });
  } catch (err) {
    console.error('[SERVER] Falha ao iniciar:', err);
    process.exit(1);
  }
}

start();
