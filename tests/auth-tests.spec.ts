import { expect, test } from '@playwright/test'
import { StatusCodes } from 'http-status-codes'
import { LoginDTO } from './dto/LoginDTO'

const BASE_URL = 'https://backend.tallinn-learning.ee'

test('TL-11-1 Login/student returns 200 and JWT', async ({ request }) => {
  const response = await request.post(`${BASE_URL}/login/student`, {
    data: LoginDTO.createLoginWithCorrectData(),
  })
  expect(response.status()).toBe(StatusCodes.OK)
  expect((await response.text()).length).toBeGreaterThan(0)

  const jwtValue = await response.text()
  const jwtRegex = /^eyJhb[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/
  expect(jwtValue).toMatch(jwtRegex)
})

test('TL-11-2 Login/student returns 401 if password is incorrect', async ({ request }) => {
  const response = await request.post(`${BASE_URL}/login/student`, {
    data: LoginDTO.createLoginWithBrokenData(),
  })
  expect(response.status()).toBe(StatusCodes.UNAUTHORIZED)
})

test('TL-11-3 Login/student returns 401 if password is missing', async ({ request }) => {
  const response = await request.post(`${BASE_URL}/login/student`, {
    data: {
      username1: 'test',
      username2: process.env.USERNAME || '',
    },
  })
  expect(response.status()).toBe(StatusCodes.UNAUTHORIZED)
})

test('TL-11-4 Login/student returns 401 if data is empty', async ({ request }) => {
  const response = await request.post(`${BASE_URL}/login/student`, {
    data: {},
  })
  expect(response.status()).toBe(StatusCodes.UNAUTHORIZED)
})

test('TL-11-5 Login/student returns 401 if data is missing', async ({ request }) => {
  const response = await request.post(`${BASE_URL}/login/student`)
  expect(response.status()).toBe(StatusCodes.BAD_REQUEST)
})

test('TL-11-6 Login/student returns 405 for GET method', async ({ request }) => {
  const response = await request.get(`${BASE_URL}/login/student`)
  expect(response.status()).toBe(StatusCodes.METHOD_NOT_ALLOWED)
})

test('TL-11-7 Login/student returns 405 for DELETE method', async ({ request }) => {
  const response = await request.delete(`${BASE_URL}/login/student`)
  expect(response.status()).toBe(StatusCodes.METHOD_NOT_ALLOWED)
  expect(response.status()).not.toBe(StatusCodes.OK)
})

test('TL-11-8 Login/student returns 401 for incorrect types', async ({ request }) => {
  const response = await request.post(`${BASE_URL}/login/student`, {
    data: {
      username: 111111,
      password: false,
    },
  })
  expect(response.status()).toBe(StatusCodes.UNAUTHORIZED)
})

test('TL-11-9 Login/student returns 401 if there are additional fields', async ({ request }) => {
  const response = await request.post(`${BASE_URL}/login/student`, {
    data: {
      username: 'test',
      password: 'test123',
      comment: 'Test',
    },
  })
  expect(response.status()).toBe(StatusCodes.UNAUTHORIZED)
})

test('TL-11-10 Login/student returns 401 if username is null', async ({ request }) => {
  const response = await request.post(`${BASE_URL}/login/student`, {
    data: {
      username: null,
      password: '1111111',
    },
  })
  expect(response.status()).toBe(StatusCodes.UNAUTHORIZED)
})
