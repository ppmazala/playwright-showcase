import { test, expect } from '../fixtures';
import { UserSchema } from '../../types/api';
import { NEW_USER, UPDATED_USER } from '../data/users.data';

const ENDPOINTS = {
  USERS: '/users',
  INVALID: '/invalid-endpoint',
};

test.describe('Users API', () => {
  test.describe('GET /users', () => {
    test('returns a list of users with valid shape', async ({ request }) => {
      const response = await request.get(ENDPOINTS.USERS);
      expect(response.ok()).toBe(true);

      const body = await response.json();
      const users = UserSchema.array().nonempty().parse(body);
      expect(users.length).toBeGreaterThan(0);
    });

    test('returns 404 for non-existent user', async ({ request }) => {
      const response = await request.get(`${ENDPOINTS.USERS}/999999`);
      expect(response.status()).toBe(404);
    });
  });

  test.describe('POST /users', () => {
    test('creates a new user and returns it with an id', async ({ request }) => {
      const response = await request.post(ENDPOINTS.USERS, { data: NEW_USER });
      expect(response.status()).toBe(201);

      const body = await response.json();
      expect(body.id).toBeDefined();
      expect(body).toEqual(expect.objectContaining(NEW_USER));
    });

    test('returns 404 for invalid endpoint', async ({ request }) => {
      const response = await request.post(ENDPOINTS.INVALID, { data: { name: 'Test' } });
      expect(response.status()).toBe(404);
    });
  });

  test.describe('PUT /users/:id', () => {
    test('updates a newly created user', async ({ request }) => {
      const { id } = await request.post(ENDPOINTS.USERS, { data: NEW_USER }).then(r => r.json());

      const response = await request.put(`${ENDPOINTS.USERS}/${id}`, { data: UPDATED_USER });
      expect(response.ok()).toBe(true);

      const body = await response.json();
      expect(body).toEqual(expect.objectContaining(UPDATED_USER));
    });
  });

  test.describe('DELETE /users/:id', () => {
    test('deletes a newly created user', async ({ request }) => {
      const { id } = await request.post(ENDPOINTS.USERS, { data: NEW_USER }).then(r => r.json());

      const response = await request.delete(`${ENDPOINTS.USERS}/${id}`);
      expect(response.ok()).toBe(true);
    });
  });
});
