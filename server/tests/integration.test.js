import { beforeAll, afterAll, describe, it, expect } from 'vitest';
import request from 'supertest';
import fs from 'node:fs';
import app from '../src/app.js';
import db from '../src/config/db.js';

beforeAll(async()=>{process.env.DB_FILENAME='./data/test.sqlite';await db.migrate.latest({directory:'./migrations'});await db.seed.run({directory:'./seeds'});});
afterAll(async()=>{await db.destroy();});

describe('TripForge API',()=>{
 it('register and login',async()=>{
  const email=`test-${Date.now()}@example.test`;
  const registered=await request(app).post('/api/auth/register').send({name:'Test User',email,password:'secret12'});
  expect(registered.status).toBe(201);expect(registered.body.success).toBe(true);expect(registered.body.data.token).toBeTruthy();
  const login=await request(app).post('/api/auth/login').send({email,password:'secret12'});
  expect(login.status).toBe(200);expect(login.body.data.token).toBeTruthy();
 });
 it('returns 403 for a trip the user does not belong to',async()=>{
  const login=await request(app).post('/api/auth/login').send({email:'demo-samira@tripforge.test',password:'password123'});
  const res=await request(app).get('/api/trips/trip-1').set('Authorization',`Bearer ${login.body.data.token}`);
  expect(res.status).toBe(403);
 });
 it('rejects a second poll vote',async()=>{
  const login=await request(app).post('/api/auth/login').send({email:'demo-tonmoy@tripforge.test',password:'tonmoy1234'});
  const token=login.body.data.token;
  const second=await request(app).post('/api/trips/trip-1/polls/poll-1/vote').set('Authorization',`Bearer ${token}`).send({optionId:'opt-2'});
  expect(second.status).toBe(409);
 });
});
