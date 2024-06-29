import request from 'supertest'
import app from '../index.js'
import { describe, expect, test } from 'vitest'

const FAKE_ID = 666
const NEW_CAFE = { id: 5, nombre: 'Frapuccino' }
const FAKE_CAFE = { id: 4, nombre: 'Frapuccino' }

describe('Operaciones CRUD de cafes', () => {
  test('[GET /cafes | Deberia retornar un codigo 200 con un arreglo que tenga por lo menos un objeto]', async () => {
    const response = await request(app).get('/cafes').send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toBeInstanceOf(Array)
    expect(response.body.length).toBeGreaterThan(0)
  })

  test('[DELETE] /cafes/:id | Deberia retornar un error con codigo 404 al intentar eliminar un cafe con un id que no existe', async () => {
    const response = await request(app).delete(`/cafes/${FAKE_ID}`).set('Authorization', `${FAKE_ID}`).send()

    expect(response.statusCode).toBe(404)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toBe('No se encontró ningún cafe con ese id')
  })

  test('[POST] /cafes | Deberia retornar un codigo 201 y agregar un nuevo cafe', async () => {
    const response = await request(app).post('/cafes').send(NEW_CAFE)

    expect(response.statusCode).toBe(201)
    expect(response.body).toBeInstanceOf(Array)
  })

  test('[PUT] /cafes/:id | Deberia retornar un error con codigo 400 al intentar actualizar un café enviando un id en los parámetros que sea diferente al id dentro del payload', async () => {
    const response = await request(app).put(`/cafes/${NEW_CAFE.id}`).send(`${FAKE_CAFE}`)

    expect(response.statusCode).toBe(400)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toBe('El id del parámetro no coincide con el id del café recibido')
  })
})
