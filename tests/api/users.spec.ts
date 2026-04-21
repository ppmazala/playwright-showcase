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
      const response = await test.step('GET /users', () => request.get(ENDPOINTS.USERS));

      await test.step('Response is successful (200 OK)', () => {
        expect(response.ok()).toBe(true);
      });

      const body = await test.step('Parse response body', () => response.json());

      await test.step('Response body matches user schema', () => {
        const users = UserSchema.array().nonempty().parse(body);
        expect(users.length).toBeGreaterThan(0);
      });
    });

    test('returns 404 for non-existent user', async ({ request }) => {
      const response = await test.step('GET /users/999999', () =>
        request.get(`${ENDPOINTS.USERS}/999999`)
      );

      await test.step('Response is 404 Not Found', () => {
        expect(response.status()).toBe(404);
      });
    });
  });

  test.describe('POST /users', () => {
    test('creates a new user and returns it with an id', async ({ request }) => {
      const response = await test.step('POST /users with new user data', () =>
        request.post(ENDPOINTS.USERS, { data: NEW_USER })
      );

      await test.step('Response is 201 Created', () => {
        expect(response.status()).toBe(201);
      });

      const body = await test.step('Parse response body', () => response.json());

      await test.step('Response includes a generated id', () => {
        expect(body.id).toBeDefined();
      });
      await test.step('Response body matches submitted data', () => {
        expect(body).toEqual(expect.objectContaining(NEW_USER));
      });
    });

    test('returns 404 for invalid endpoint', async ({ request }) => {
      const response = await test.step('POST /invalid-endpoint', () =>
        request.post(ENDPOINTS.INVALID, { data: { name: 'Test' } })
      );

      await test.step('Response is 404 Not Found', () => {
        expect(response.status()).toBe(404);
      });
    });
  });

  test.describe('PUT /users/:id', () => {
    test('updates an existing user', async ({ request }) => {
      const users = await test.step('GET /users to find existing user', () =>
        request.get(ENDPOINTS.USERS).then(r => r.json())
      );

      await test.step('Users exist to update', () => {
        expect(users.length).toBeGreaterThan(0);
      });

      const { id } = users[0];
      const response = await test.step(`PUT /users/${id} with updated data`, () =>
        request.put(`${ENDPOINTS.USERS}/${id}`, { data: UPDATED_USER })
      );

      await test.step('Response is successful', () => {
        expect(response.ok()).toBe(true);
      });

      const body = await test.step('Parse response body', () => response.json());

      await test.step('Response body matches updated data', () => {
        expect(body).toEqual(expect.objectContaining(UPDATED_USER));
      });
    });
  });

  test.describe('DELETE /users/:id', () => {
    test('deletes an existing user', async ({ request }) => {
      const users = await test.step('GET /users to find existing user', () =>
        request.get(ENDPOINTS.USERS).then(r => r.json())
      );

      await test.step('Users exist to delete', () => {
        expect(users.length).toBeGreaterThan(0);
      });

      const { id } = users[0];
      const response = await test.step(`DELETE /users/${id}`, () =>
        request.delete(`${ENDPOINTS.USERS}/${id}`)
      );

      await test.step('Response is successful', () => {
        expect(response.ok()).toBe(true);
      });
    });
  });
});
