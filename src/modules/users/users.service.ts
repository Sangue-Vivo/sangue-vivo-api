import bcrypt from 'bcryptjs';
import User from '../../database/models/User';

export async function changePassword(userId: string, currentPassword: string, newPassword: string) {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isMatch) {
    throw new Error('Senha atual incorreta.');
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await user.update({ passwordHash });
}

export async function getProfile(userId: string) {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error('Usuário não encontrado');
  }
  return user;
}

export async function updateProfile(userId: string, data: {
  name?: string;
  phone?: string;
  university?: string;
  course?: string;
}) {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  await user.update(data);
  return user;
}

export async function getRanking(page = 1, limit = 20) {
  const offset = (page - 1) * limit;

  const { rows: users, count: total } = await User.findAndCountAll({
    order: [['xp', 'DESC']],
    limit,
    offset,
  });

  return {
    users,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}
