import 'reflect-metadata';
import bcrypt from 'bcryptjs';
import sequelize from '../index';
import User from '../models/User';
import Cause from '../models/Cause';
import Donation from '../models/Donation';
import CauseDonation from '../models/CauseDonation';
import Achievement from '../models/Achievement';
import UserAchievement from '../models/UserAchievement';
import Notification from '../models/Notification';

async function seed() {
  console.log('[SEED] Conectando ao banco...');
  await sequelize.authenticate();
  await sequelize.sync({ force: true });
  console.log('[SEED] Tabelas recriadas.');

  const hash = (pw: string) => bcrypt.hashSync(pw, 10);

  // ============ USERS ============
  const maria = await User.create({
    id: 'user-1',
    email: 'maria@ufal.edu.br',
    cpf: '123.456.789-00',
    passwordHash: hash('123456'),
    name: 'Maria Santos',
    phone: '(82) 99123-4567',
    birthDate: '2001-03-15',
    gender: 'FEMALE',
    bloodType: 'O_POSITIVE',
    university: 'UFAL — Universidade Federal de Alagoas',
    course: 'Medicina',
    semester: 6,
    role: 'user',
    rank: 'AMIGO',
    totalDonations: 4,
    xp: 500,
    lastDonationDate: new Date('2025-12-10'),
    nextEligibleDate: new Date('2026-03-10'),
    isEligible: true,
    consecutiveStreak: 3,
  });

  const joao = await User.create({
    id: 'user-2',
    email: 'joao@ufal.edu.br',
    cpf: '234.567.890-11',
    passwordHash: hash('123456'),
    name: 'João Pedro Oliveira',
    phone: '(82) 99234-5678',
    birthDate: '2000-07-22',
    gender: 'MALE',
    bloodType: 'A_POSITIVE',
    university: 'UFAL — Universidade Federal de Alagoas',
    course: 'Enfermagem',
    semester: 8,
    role: 'user',
    rank: 'LENDA',
    totalDonations: 20,
    xp: 2800,
    lastDonationDate: new Date('2026-02-15'),
    nextEligibleDate: new Date('2026-05-15'),
    isEligible: false,
    consecutiveStreak: 12,
  });

  const ana = await User.create({
    id: 'user-3',
    email: 'ana@uneal.edu.br',
    cpf: '345.678.901-22',
    passwordHash: hash('123456'),
    name: 'Ana Clara Ferreira',
    phone: '(82) 99345-6789',
    birthDate: '2002-01-10',
    gender: 'FEMALE',
    bloodType: 'B_NEGATIVE',
    university: 'UNEAL — Universidade Estadual de Alagoas',
    course: 'Biomedicina',
    semester: 4,
    role: 'user',
    rank: 'GUARDIAO',
    totalDonations: 10,
    xp: 1400,
    lastDonationDate: new Date('2026-01-20'),
    nextEligibleDate: new Date('2026-04-20'),
    isEligible: false,
    consecutiveStreak: 7,
  });

  const carlos = await User.create({
    id: 'user-4',
    email: 'carlos@cesmac.edu.br',
    cpf: '456.789.012-33',
    passwordHash: hash('123456'),
    name: 'Carlos Eduardo Lima',
    phone: '(82) 99456-7890',
    birthDate: '1999-11-05',
    gender: 'MALE',
    bloodType: 'O_NEGATIVE',
    university: 'CESMAC — Centro Universitário CESMAC',
    course: 'Farmácia',
    semester: 10,
    role: 'user',
    rank: 'HEROI_DE_SANGUE',
    totalDonations: 30,
    xp: 4500,
    lastDonationDate: new Date('2026-03-01'),
    nextEligibleDate: new Date('2026-06-01'),
    isEligible: false,
    consecutiveStreak: 20,
  });

  // More users
  for (const u of [
    { id: 'user-5', email: 'beatriz@ufal.edu.br', cpf: '567.890.123-44', name: 'Beatriz Rodrigues', bloodType: 'AB_POSITIVE', rank: 'SALVADOR', totalDonations: 15, xp: 2100 },
    { id: 'user-6', email: 'lucas@unit.edu.br', cpf: '678.901.234-55', name: 'Lucas Mendonça', bloodType: 'A_NEGATIVE', rank: 'GUARDIAO', totalDonations: 12, xp: 1650 },
    { id: 'user-7', email: 'fernanda@fits.edu.br', cpf: '789.012.345-66', name: 'Fernanda Costa Silva', bloodType: 'B_POSITIVE', rank: 'DOADOR', totalDonations: 3, xp: 350 },
    { id: 'user-8', email: 'rafael@ufal.edu.br', cpf: '890.123.456-77', name: 'Rafael Almeida Souza', bloodType: 'AB_NEGATIVE', rank: 'AMIGO', totalDonations: 5, xp: 600 },
    { id: 'user-9', email: 'camila@uneal.edu.br', cpf: '901.234.567-88', name: 'Camila Barros Nunes', bloodType: 'O_POSITIVE', rank: 'SALVADOR', totalDonations: 14, xp: 1950 },
    { id: 'user-10', email: 'diego@cesmac.edu.br', cpf: '012.345.678-99', name: 'Diego Tavares Pinto', bloodType: 'A_POSITIVE', rank: 'LENDA', totalDonations: 22, xp: 3100 },
    { id: 'user-11', email: 'juliana@unit.edu.br', cpf: '111.222.333-44', name: 'Juliana Pereira Gomes', bloodType: 'O_NEGATIVE', rank: 'GOTA', totalDonations: 1, xp: 100 },
  ]) {
    await User.create({
      ...u,
      passwordHash: hash('123456'),
      phone: '',
      birthDate: '2001-01-01',
      gender: 'FEMALE',
      university: 'UFAL',
      course: 'Curso',
      semester: 5,
      role: 'user',
      isEligible: false,
      consecutiveStreak: 0,
    });
  }

  // Admins
  await User.create({
    id: 'admin-1',
    email: 'admin@hemoal.gov.br',
    cpf: '000.000.000-00',
    passwordHash: hash('admin123'),
    name: 'Administrador Hemoal',
    phone: '(82) 3315-2102',
    birthDate: '1985-01-01',
    gender: 'MALE',
    bloodType: 'O_NEGATIVE',
    role: 'admin',
    rank: 'HEROI_DE_SANGUE',
    isEligible: false,
  });

  await User.create({
    id: 'admin-2',
    email: 'marcelo@umj.edu.br',
    cpf: '111.111.111-11',
    passwordHash: hash('admin123'),
    name: 'Marcelo Lucas de Oliveira Lima',
    phone: '(82) 99999-0000',
    birthDate: '2000-01-01',
    gender: 'MALE',
    bloodType: 'O_POSITIVE',
    university: 'UMJ — Universidade Mário Pontes Jucá',
    role: 'admin',
    rank: 'HEROI_DE_SANGUE',
    isEligible: false,
  });

  console.log('[SEED] 13 usuários criados.');

  // ============ ACHIEVEMENTS ============
  const achievements = await Achievement.bulkCreate([
    { id: 'ach-1', code: 'FIRST_DROP', name: 'Primeira Gota', description: 'Realizou sua primeira doação de sangue.', icon: 'droplet', xpReward: 50, requiredDonations: 1 },
    { id: 'ach-2', code: 'STREAK_3', name: 'Doação Tripla', description: 'Manteve uma sequência de 3 doações consecutivas.', icon: 'flame', xpReward: 100, requiredStreak: 3 },
    { id: 'ach-3', code: 'STREAK_5', name: 'Fidelidade Sanguínea', description: 'Manteve uma sequência de 5 doações consecutivas.', icon: 'zap', xpReward: 200, requiredStreak: 5 },
    { id: 'ach-4', code: 'CAUSE_FIRST', name: 'Solidariedade em Ação', description: 'Doou pela primeira vez para uma causa específica.', icon: 'heart-handshake', xpReward: 75, requiredCauses: 1 },
    { id: 'ach-5', code: 'CAUSE_5', name: 'Campeão das Causas', description: 'Contribuiu para 5 causas diferentes.', icon: 'trophy', xpReward: 250, requiredCauses: 5 },
    { id: 'ach-6', code: 'LIVES_10', name: 'Salva-Vidas', description: 'Suas doações já ajudaram a salvar 10 vidas.', icon: 'heart-pulse', xpReward: 150, requiredDonations: 3 },
    { id: 'ach-7', code: 'LIVES_50', name: 'Guardião da Vida', description: 'Suas doações já ajudaram a salvar 50 vidas.', icon: 'shield-check', xpReward: 500, requiredDonations: 13 },
    { id: 'ach-8', code: 'URGENT_HERO', name: 'Herói de Urgência', description: 'Atendeu a um chamado urgente de doação.', icon: 'siren', xpReward: 200, requiredCauses: 1 },
    { id: 'ach-9', code: 'RANK_GUARDIAO', name: 'Guardião da Vida', description: 'Alcançou o rank Guardião.', icon: 'medal', xpReward: 300, requiredDonations: 8 },
    { id: 'ach-10', code: 'RANK_LENDA', name: 'Lenda Vermelha', description: 'Alcançou o rank Lenda.', icon: 'gem', xpReward: 500, requiredDonations: 20 },
  ]);
  console.log('[SEED] 10 conquistas criadas.');

  // ============ CAUSES ============
  const cause1 = await Cause.create({
    id: 'cause-1', title: 'Cirurgia de emergência — HEMO Maceió', description: 'Paciente necessita de cirurgia cardíaca de emergência.', patientName: 'José Silva',
    bloodType: 'O_POSITIVE', hospital: 'HEMO — Hemocentro de Alagoas', city: 'Maceió', urgencyLevel: 5, goalDonations: 10, currentDonations: 6, status: 'ACTIVE',
    expiresAt: new Date('2026-04-15'), createdById: joao.id,
  });

  const cause2 = await Cause.create({
    id: 'cause-2', title: 'Tratamento oncológico infantil', description: 'Criança de 8 anos em tratamento de leucemia.', patientName: 'Maria Eduarda',
    bloodType: 'A_POSITIVE', hospital: 'Hospital Universitário Prof. Alberto Antunes', city: 'Maceió', urgencyLevel: 4, goalDonations: 15, currentDonations: 9, status: 'ACTIVE',
    expiresAt: new Date('2026-05-30'), createdById: ana.id,
  });

  await Cause.create({
    id: 'cause-3', title: 'Parto de alto risco — Hospital Universitário', description: 'Gestante com complicações na gravidez.',
    bloodType: 'B_POSITIVE', hospital: 'Hospital Universitário Prof. Alberto Antunes', city: 'Maceió', urgencyLevel: 4, goalDonations: 6, currentDonations: 4, status: 'ACTIVE',
    expiresAt: new Date('2026-04-10'), createdById: carlos.id,
  });

  await Cause.create({
    id: 'cause-4', title: 'Reposição de estoque — Tipo O-', description: 'Estoque crítico de sangue tipo O negativo.',
    bloodType: 'O_NEGATIVE', hospital: 'HEMO — Hemocentro de Alagoas', city: 'Maceió', urgencyLevel: 5, goalDonations: 20, currentDonations: 8, status: 'ACTIVE',
    expiresAt: new Date('2026-04-30'), createdById: 'admin-1',
  });

  const cause5 = await Cause.create({
    id: 'cause-5', title: 'Tratamento de anemia falciforme', description: 'Paciente com anemia falciforme necessita de transfusões regulares.',
    bloodType: 'A_NEGATIVE', hospital: 'Hospital Universitário Prof. Alberto Antunes', city: 'Maceió', urgencyLevel: 2, goalDonations: 8, currentDonations: 8, status: 'FULFILLED',
    expiresAt: new Date('2026-03-15'), createdById: ana.id,
  });

  await Cause.create({
    id: 'cause-6', title: 'Acidente de trânsito — Pronto Socorro', description: 'Vítima de acidente de trânsito necessita de transfusão urgente.',
    bloodType: 'AB_POSITIVE', hospital: 'Hospital Geral do Estado', city: 'Maceió', urgencyLevel: 5, goalDonations: 12, currentDonations: 3, status: 'ACTIVE',
    expiresAt: new Date('2026-04-05'), createdById: 'admin-1',
  });
  console.log('[SEED] 6 causas criadas.');

  // ============ DONATIONS ============
  const d1 = await Donation.create({
    id: 'don-1', userId: maria.id, scheduledDate: new Date('2025-06-15'), completedDate: new Date('2025-06-15'),
    status: 'COMPLETED', hospital: 'Hemocentro de Alagoas', city: 'Maceió', xpEarned: 150,
  });
  await CauseDonation.create({ id: 'cd-1', causeId: cause1.id, donationId: d1.id });

  const d2 = await Donation.create({
    id: 'don-2', userId: maria.id, scheduledDate: new Date('2025-08-20'), completedDate: new Date('2025-08-20'),
    status: 'COMPLETED', hospital: 'Hemocentro de Alagoas', city: 'Maceió', xpEarned: 100,
  });

  const d3 = await Donation.create({
    id: 'don-3', userId: maria.id, scheduledDate: new Date('2025-10-05'), completedDate: new Date('2025-10-05'),
    status: 'COMPLETED', hospital: 'Hospital Universitário Prof. Alberto Antunes', city: 'Maceió', xpEarned: 150,
  });
  await CauseDonation.create({ id: 'cd-2', causeId: cause2.id, donationId: d3.id });

  const d4 = await Donation.create({
    id: 'don-4', userId: maria.id, scheduledDate: new Date('2025-12-10'), completedDate: new Date('2025-12-10'),
    status: 'COMPLETED', hospital: 'Hemocentro de Alagoas', city: 'Maceió', xpEarned: 150,
  });
  await CauseDonation.create({ id: 'cd-3', causeId: cause5.id, donationId: d4.id });

  await Donation.create({
    id: 'don-5', userId: maria.id, scheduledDate: new Date('2026-03-28'),
    status: 'SCHEDULED', hospital: 'Hemocentro de Alagoas', city: 'Maceió',
  });

  await Donation.create({
    id: 'don-6', userId: maria.id, scheduledDate: new Date('2026-04-15'),
    status: 'SCHEDULED', hospital: 'Hospital Universitário Prof. Alberto Antunes', city: 'Maceió',
  });
  console.log('[SEED] 6 doações criadas.');

  // ============ USER ACHIEVEMENTS ============
  await UserAchievement.bulkCreate([
    { id: 'ua-1', userId: maria.id, achievementId: 'ach-1', unlockedAt: new Date('2025-06-15') },
    { id: 'ua-2', userId: maria.id, achievementId: 'ach-2', unlockedAt: new Date('2025-10-05') },
    { id: 'ua-3', userId: maria.id, achievementId: 'ach-4', unlockedAt: new Date('2025-08-20') },
    { id: 'ua-4', userId: maria.id, achievementId: 'ach-6', unlockedAt: new Date('2025-12-10') },
  ]);
  console.log('[SEED] 4 conquistas desbloqueadas.');

  // ============ NOTIFICATIONS ============
  await Notification.bulkCreate([
    { userId: maria.id, type: 'ELIGIBLE_TO_DONATE', title: 'Você já pode doar novamente!', message: 'Seu período de carência terminou.', isRead: true, actionUrl: '/causes' },
    { userId: maria.id, type: 'DONATION_REMINDER', title: 'Lembrete: Doação agendada para 28/03', message: 'Sua doação está agendada para amanhã.', isRead: false, actionUrl: '/donations' },
    { userId: maria.id, type: 'CAUSE_MATCH', title: 'Causa compatível encontrada!', message: 'Uma nova causa precisa do seu tipo sanguíneo O+.', isRead: false, actionUrl: '/causes' },
    { userId: maria.id, type: 'RANK_UP', title: 'Parabéns! Você subiu para Amigo de Sangue!', message: 'Continue doando para alcançar ranks maiores.', isRead: true, actionUrl: '/profile' },
    { userId: maria.id, type: 'ACHIEVEMENT', title: 'Conquista desbloqueada: Salva-Vidas!', message: 'Suas doações já ajudaram a salvar 10 vidas.', isRead: false, actionUrl: '/achievements' },
    { userId: maria.id, type: 'CAUSE_MATCH', title: 'Nova causa urgente!', message: 'Uma emergência precisa de doadores O+.', isRead: false, actionUrl: '/causes' },
    { userId: maria.id, type: 'GENERAL', title: 'Campanha de doação na UFAL', message: 'Participe da campanha de doação de sangue.', isRead: true, actionUrl: '/causes' },
    { userId: maria.id, type: 'ACHIEVEMENT', title: 'Conquista desbloqueada: Doação Tripla!', message: 'Você manteve 3 doações consecutivas.', isRead: true, actionUrl: '/achievements' },
  ]);
  console.log('[SEED] 8 notificações criadas.');

  console.log('[SEED] Seed completo!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('[SEED] Erro:', err);
  process.exit(1);
});
