import { Op } from 'sequelize';
import Cause from '../../database/models/Cause';
import User from '../../database/models/User';
import CauseDonation from '../../database/models/CauseDonation';
import { getCompatibleBloodTypes } from '../../utils/bloodCompatibility';

interface ListFilters {
  status?: string;
  bloodType?: string;
  city?: string;
  urgent?: boolean;
  page?: number;
  limit?: number;
}

export async function list(filters: ListFilters) {
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const offset = (page - 1) * limit;

  const where: any = {};

  if (filters.status) {
    where.status = filters.status;
  }
  if (filters.bloodType) {
    where.bloodType = filters.bloodType;
  }
  if (filters.city) {
    where.city = filters.city;
  }
  if (filters.urgent) {
    where.urgencyLevel = { [Op.gte]: 4 };
  }

  const { rows: causes, count: total } = await Cause.findAndCountAll({
    where,
    order: [['createdAt', 'DESC']],
    limit,
    offset,
  });

  return {
    causes,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getCompatible(userBloodType: string) {
  const compatibleTypes = getCompatibleBloodTypes(userBloodType);

  const causes = await Cause.findAll({
    where: {
      bloodType: { [Op.in]: compatibleTypes },
      status: 'ACTIVE',
    },
    order: [['urgencyLevel', 'DESC']],
  });

  return causes;
}

export async function getById(id: string) {
  const cause = await Cause.findByPk(id, {
    include: [
      { model: User, as: 'createdBy' },
      { model: CauseDonation, as: 'donations' },
    ],
  });

  if (!cause) {
    throw new Error('Causa não encontrada');
  }

  return cause;
}

export async function create(data: {
  title: string;
  description: string;
  patientName?: string;
  bloodType: string;
  hospital: string;
  city: string;
  urgencyLevel: number;
  goalDonations: number;
  expiresAt: string;
}, userId: string) {
  const cause = await Cause.create({
    ...data,
    createdById: userId,
  });

  return cause;
}

export async function update(id: string, data: Record<string, unknown>) {
  const cause = await Cause.findByPk(id);
  if (!cause) {
    throw new Error('Causa não encontrada');
  }

  const allowedFields = ['title', 'description', 'hospital', 'city', 'targetDonations', 'bloodTypes', 'urgencyLevel', 'status'];
  const sanitized: Record<string, unknown> = {};
  for (const key of allowedFields) {
    if (key in data) {
      sanitized[key] = data[key];
    }
  }

  await cause.update(sanitized);
  return cause;
}

export async function updateStatus(id: string, status: string) {
  const cause = await Cause.findByPk(id);
  if (!cause) {
    throw new Error('Causa não encontrada');
  }

  await cause.update({ status });
  return cause;
}
