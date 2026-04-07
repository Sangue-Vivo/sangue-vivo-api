import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { signToken } from '../../lib/jwt';
import User from '../../database/models/User';
import { sendEmail } from '../../lib/email';
import { env } from '../../config/env';

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function register(data: {
  name: string;
  email: string;
  cpf: string;
  password: string;
  bloodType: string;
  gender: string;
  birthDate: string;
  university: string;
  course: string;
}) {
  const existingEmail = await User.findOne({ where: { email: data.email } });
  if (existingEmail) throw new Error('Não foi possível criar a conta. Verifique os dados.');

  const existingCpf = await User.findOne({ where: { cpf: data.cpf } });
  if (existingCpf) throw new Error('Não foi possível criar a conta. Verifique os dados.');

  const passwordHash = await bcrypt.hash(data.password, 12);

  const user = await User.create({
    name: data.name,
    email: data.email,
    cpf: data.cpf,
    passwordHash,
    bloodType: data.bloodType,
    gender: data.gender,
    birthDate: data.birthDate,
    university: data.university,
    course: data.course,
  });

  const token = signToken({ userId: user.id, role: user.role });
  return { token, user };
}

export async function login(email: string, password: string) {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error('Credenciais inválidas.');

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) throw new Error('Credenciais inválidas.');

  const token = signToken({ userId: user.id, role: user.role });
  return { token, user };
}

export async function forgotPassword(email: string) {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error('Usuário não encontrado.');

  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
  const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

  await user.update({ resetToken: resetTokenHash, resetTokenExpiry });

  const resetUrl = `${env.FRONTEND_URL}/redefinir-senha?token=${resetToken}`;
  const safeName = escapeHtml(user.name);

  await sendEmail({
    to: user.email,
    subject: 'Sangue Vivo — Redefinição de senha',
    html: `<p>Olá ${safeName},</p><p>Você solicitou uma redefinição de senha. Clique no link abaixo:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>Este link expira em 1 hora.</p>`,
  });
}

export async function resetPassword(token: string, password: string) {
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({ where: { resetToken: tokenHash } });
  if (!user || !user.resetTokenExpiry || new Date(user.resetTokenExpiry) < new Date()) {
    throw new Error('Token inválido ou expirado.');
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await user.update({ passwordHash, resetToken: null, resetTokenExpiry: null });
}
