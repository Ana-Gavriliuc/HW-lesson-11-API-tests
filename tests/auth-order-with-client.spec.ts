import { expect, test } from '@playwright/test'
import { ApiClient } from '../src/ApiClient'

test('login and create order with api client', async ({ request }) => {
  const apiClient = await ApiClient.create(request)
  const orderId = await apiClient.createOrderAndReturnOrderId()
  console.log('orderId:', orderId)
})

test('get orders with api client', async ({ request }) => {
  const apiClient = await ApiClient.create(request)
  const ordersBefore = await apiClient.getOrders()
  await apiClient.createOrderAndReturnOrderId()
  const ordersAfter = await apiClient.getOrders()

  expect(ordersBefore.length < ordersAfter.length).toBeTruthy()
})

test('get order by id with api client', async ({ request }) => {
  const apiClient = await ApiClient.create(request)
  const id = await apiClient.createOrderAndReturnOrderId()
  const order = await apiClient.getOrderById(id)
  expect(order.id).toBe(id)
})

test('delete order by id with api client', async ({ request }) => {
  const apiClient = await ApiClient.create(request)
  const id = await apiClient.createOrderAndReturnOrderId()
  await apiClient.deleteOrderById(id)
  const orderAfterDelete = await apiClient.getOrderById(id)
  expect(orderAfterDelete.id).toBeUndefined()
})
