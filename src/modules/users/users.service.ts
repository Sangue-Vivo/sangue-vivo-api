import User from '../../database/models/User';

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
