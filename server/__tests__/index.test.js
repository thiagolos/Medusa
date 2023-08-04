import express from 'express';
import router from '../router';
import supertest from 'supertest';
import dbModels from '../models/chatroom.model'
const Chatroom = dbModels.Chatroom;

import mongoose from 'mongoose';
const databaseName = 'test';

describe ('Integration tests', () => {
  const app = express();
  app.use(express.json());
  app.use(router);
  const request = supertest(app);

  beforeAll(async () => {
    const url = `mongodb://127.0.0.1/${databaseName}`;
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterEach(async () => {
    await Chatroom.collection.drop();
    mongoose.connection.close();
  });

  it('should create chatrooms, and retreive them from the database', async () => {
    let response = await request.get('/chatrooms');
    expect(JSON.parse(response.text).length).toBe(0);
    await request.post('/chatrooms').send('test room 1');
    response = await request.get('/chatrooms');
    expect(JSON.parse(response.text).length).toBe(1);
    await request.post('/chatrooms').send('test room 2');
    response = await request.get('/chatrooms');
    expect(JSON.parse(response.text).length).toBe(2);
  })
});
