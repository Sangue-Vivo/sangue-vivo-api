import 'reflect-metadata';
import bcrypt from 'bcryptjs';
import sequelize from '../index';
import User from '../models/User';

// Cria (ou garante) duas contas: 1 admin + 1 usuário comum.
// NÃO apaga dados — usa findOrCreate. Edite os placeholders abaixo conforme necessário.
// Senhas podem ser sobrescritas via env: ADMIN_PASSWORD / USER_PASSWORD.

const accounts = [
  {
    email: 'marcelolucasdeoliveiraa@gmail.com',
    password: process.env.ADMIN_PASSWORD || 'SangueVivo@Admin2026',
    name: 'Marcelo Lucas',
    cpf: '000.000.000-00',
    birthDate: '2000-01-01',
    gender: 'OTHER',
    bloodType: 'O_NEGATIVE',
    university: 'SECTI Alagoas',
    course: 'Administração',
    role: 'admin',
  },
  {
    email: 'usuario.teste@sanguevivo.app',
    password: process.env.USER_PASSWORD || 'SangueVivo@User2026',
    name: 'Usuário Teste',
    cpf: '111.111.111-11',
    birthDate: '2002-05-10',
    gender: 'FEMALE',
    bloodType: 'A_POSITIVE',
    university: 'UFAL — Universidade Federal de Alagoas',
    course: 'Enfermagem',
    role: 'user',
  },
];

async function run() {
  console.log('[ACCOUNTS] Conectando ao banco...');
  await sequelize.authenticate();
  await sequelize.sync();
  console.log('[ACCOUNTS] Conectado.');

  for (const acc of accounts) {
    const passwordHash = await bcrypt.hash(acc.password, 12);
    const [user, created] = await User.findOrCreate({
      where: { email: acc.email },
      defaults: {
        email: acc.email,
        cpf: acc.cpf,
        passwordHash,
        name: acc.name,
        birthDate: acc.birthDate,
        gender: acc.gender,
        bloodType: acc.bloodType,
        university: acc.university,
        course: acc.course,
        role: acc.role,
      },
    });

    if (created) {
      console.log(`[ACCOUNTS] Criada: ${acc.email} (${acc.role}) — senha: ${acc.password}`);
    } else {
      await user.update({ passwordHash, role: acc.role });
      console.log(`[ACCOUNTS] Já existia, senha/role atualizados: ${acc.email} (${acc.role}) — senha: ${acc.password}`);
    }
  }

  console.log('[ACCOUNTS] Concluído. Troque as senhas após o primeiro login.');
  await sequelize.close();
}

run().catch((err) => {
  console.error('[ACCOUNTS] Erro:', err);
  process.exit(1);
});
