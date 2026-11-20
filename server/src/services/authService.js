import { z } from 'zod';
import db from '../config/db.js';
import { users } from '../models/baseModel.js';
import { hashPassword, comparePassword } from '../utils/hash.js';
import { signToken } from '../utils/jwt.js';
import { newId } from '../utils/ids.js';
import ApiError from '../utils/apiError.js';

export const registerSchema = z.object({
  name: z.string().trim().min(1), email: z.string().trim().email(),
  password: z.string().min(6), phone: z.string().optional().default(''),
  university: z.string().optional().default(''), department: z.string().optional().default(''),
});
export const loginSchema = z.object({ email: z.string().trim().email(), password: z.string().min(1) });
export const profileSchema = z.object({
  name: z.string().trim().min(1).optional(), phone: z.string().optional(),
  bio: z.string().optional(), university: z.string().optional(), department: z.string().optional(),
});

export function safeUser(row) {
  return { id: row.id, name: row.name, email: row.email, phone: row.phone || '', bio: row.bio || '',
    university: row.university || '', department: row.department || '', createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at };
}
export async function register(input) {
  const exists = await users.findByEmail(input.email);
  if (exists) throw new ApiError(409, 'An account with this email address already exists.', 'CONFLICT');
  const row = { id: newId('user'), name: input.name, email: input.email.toLowerCase(), password_hash: await hashPassword(input.password),
    phone: input.phone, bio: 'Ready to plan the next group trip.', university: input.university, department: input.department,
    created_at: new Date() };
  await users.insert(row);
  return { user: safeUser(row), token: signToken(row.id) };
}
export async function login(input) {
  const row = await users.findByEmail(input.email);
  if (!row || !(await comparePassword(input.password, row.password_hash))) throw new ApiError(401, 'Invalid email or password.', 'UNAUTHORIZED');
  return { user: safeUser(row), token: signToken(row.id) };
}
export async function updateProfile(userId, input) {
  await users.update(userId, {
    ...(input.name !== undefined ? { name: input.name } : {}),
    ...(input.phone !== undefined ? { phone: input.phone } : {}),
    ...(input.bio !== undefined ? { bio: input.bio } : {}),
    ...(input.university !== undefined ? { university: input.university } : {}),
    ...(input.department !== undefined ? { department: input.department } : {}),
  });
  return safeUser(await users.findById(userId));
}
