const supertest = require('supertest');
const createServer = require('../server');
const app = createServer();
const mongoose = require('mongoose');
const connect = require('../dbconnect.js');
const User = require('../models/user.model');

const UserService = require('../services/user');

beforeAll(async () => {
    await connect();
    jest.setTimeout(5000);
});

afterEach(async () => {
    await User.deleteOne({'username': 'newTestUsername'});    
    await User.updateOne({'username': 'testUsername'}, { $set: { scores: [] }});
});

afterAll(async () => {
    await mongoose.connection.close();
});

const request = {
    username: "testUsername",
    password: "testPassword"
};

const userPayload = {
    body: {
        user: {
            username: "newTestUsername",
            password: "testPassword"
        },
        success: true
    },
    statusCode: 200
  };

const newRequest = {
        username: "newTestUsername",
        password: "newTestPassword"
}

describe('user', () => {

    describe('registration', () => {

        describe('existing user', () => {
            it('should return a 404', async () => {
                const { status, body } = await supertest(app).post('/api/v1/user/register').send(request);
                expect(body.success).toBe(false);
                expect(status).toBe(404);
            });
        });

        describe('new user', () => { 
            it('should return the created user', async () => {
                //const registerUserServiceMock = jest.spyOn(UserService, "register").mockReturnValueOnce(userPayload);

                const { status, body } = await supertest(app).post('/api/v1/user/register').send(newRequest);
                expect(status).toBe(200);
                expect(body.success).toBe(true);
                expect(body.user.username).toEqual("newTestUsername");
            })
        });
    });

    describe('login', () => {
        describe('registered user', () => {
            it('should return a true success', async () => {
                const { body } = await supertest(app).post('/api/v1/user/login').send(request);
                expect(body.success).toBe(true);
            });
        });

        describe('not registered user', () => { 
            it('should return a false success', async () => {
                const { body } = await supertest(app).post('/api/v1/user/login').send(newRequest);
                expect(body.success).toBe(false);
            })
        });
    })

    describe('score', () => {
        describe('add score', () => {
            describe('invalid jwt', () => {
                it('should return a 403', async () => {
                    const { status } = await supertest(app).post('/api/v1/user/addScore').send(request);
                    expect(status).toBe(403);
                });
            });

            describe('valid jwt', () => {
                it('should return a true success', async () => {
                    const { body } = await supertest(app).post('/api/v1/user/login').send(request);
                    const jwt = body.token;
                    
                    let res = await supertest(app).post('/api/v1/user/addScore')
                    .set({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + jwt})
                    .send({
                        username: "testUsername",
                        "score": 100,
                        "category": "testCategory"
                    });
                    expect(res.body.success).toBe(true);
                });
            });
        });

        describe('get users scores', () => {
            describe('invalid jwt', () => {
                it('should return a 403', async () => {
                    const { status } = await supertest(app).get('/api/v1/user/getScores?username=testUsername').send();
                    expect(status).toBe(403);
                });
            });

            describe('valid jwt', () => {
                it('should return an empty array', async () => {
                    const { body } = await supertest(app).post('/api/v1/user/login').send(request);
                    const jwt = body.token;
                    
                    let res = await supertest(app).get('/api/v1/user/getScores?username=testUsername')
                    .set({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + jwt})
                    .send();
                    expect(res.body.success).toBe(true);
                    expect(res.body.scores).toHaveLength(0);
                });
            });
        });
    });

});

