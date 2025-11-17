import { test, expect } from '@playwright/test'
import { StatusCodes } from 'http-status-codes'
import { LoginDTO } from './dto/LoginDTO'
import { OrderDTO } from './dto/OrderDTO'

const BASE_URL = 'https://backend.tallinn-learning.ee'
const ORDER_PATH = '/orders'

test(' Login and get order by id without api client', async ({ request }) => {
  const authResponse = await request.post(`${BASE_URL}/login/student`, {
    data: LoginDTO.createLoginWithCorrectData(),
  })
  expect(authResponse.status()).toBe(StatusCodes.OK)
  const jwt= await authResponse.text()


  const createOrderResponse = await request.post(`${BASE_URL}${ORDER_PATH}`, {
    data: OrderDTO.createOrderWithRandomData(),
    headers: {
      Authorization: `Bearer ${jwt}`,
    }
  })

  const order = await createOrderResponse.json()
  const id :number = order.id

  const getOrderResponse = await request.get(`${BASE_URL}${ORDER_PATH}/${id}`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    }
  })

  expect(getOrderResponse.status()).toBe(StatusCodes.OK)
  const getOrder = await getOrderResponse.json()
  expect(getOrder.id).toBe(id)

})


test(' Login and delete order by id without api client', async ({ request }) => {
  const authResponse = await request.post(`${BASE_URL}/login/student`, {
    data: LoginDTO.createLoginWithCorrectData(),
  })
  expect(authResponse.status()).toBe(StatusCodes.OK)
  const jwt= await authResponse.text()


  const createOrderResponse = await request.post(`${BASE_URL}${ORDER_PATH}`, {
    data: OrderDTO.createOrderWithRandomData(),
    headers: {
      Authorization: `Bearer ${jwt}`,
    }
  })

  const order = await createOrderResponse.json()
  const id :number = order.id


  const deleteOrderResponse = await request.delete(`${BASE_URL}${ORDER_PATH}/${id}`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    }
  })
  expect(deleteOrderResponse.status()).toBe(StatusCodes.OK)


  const afterDeleteResponse = await request.get(`${BASE_URL}${ORDER_PATH}/${id}`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    }
  })
  expect(afterDeleteResponse.status()).toBe(StatusCodes.OK)
  const body = await afterDeleteResponse.text()
  expect(body).toBe('')
})

