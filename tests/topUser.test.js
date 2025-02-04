const request = require('supertest')
const express = require('express')
const pool = require('../Config/dbConfig')
const { getTopUsers } = require('../Controller/userController')

const app = express()
app.use(express.json())

// Mock the getTopUsers function
app.get('/api/users/topUsers', getTopUsers)

describe('GET /api/users/topUsers', () => {
    const mockTopUsers = [
        { id: 1, name: 'User1', numberoflogin: 100 },
        { id: 2, name: 'User2', numberoflogin: 50 },
        { id: 3, name: 'User3', numberoflogin: 25 }
    ]

    beforeEach(() => {
        pool.query = jest.fn().mockResolvedValue({ rows: mockTopUsers }) // mockResolvedValue function to specify the data that should be returned
    })

    test('returns top 3 users', async () => {
        const response = await request(app)
            .get('/api/users/topUsers')
            .expect('Content-Type', /json/)
            .expect(200)

        expect(response.body).toEqual({
            status: 'success',
            data: { users: mockTopUsers }
        })
    })
})

