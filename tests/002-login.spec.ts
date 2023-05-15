import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/login');
});

test('user is logged in successfully', async ({ page }) => {
  await page.getByPlaceholder('Enter email').click();
  await page
    .getByPlaceholder('Enter email')
    .fill('playwrighttestnotadmin@gmail.com');
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill('password');
  await page.getByRole('button', { name: 'Login' }).click();
  const logoutButton = await page.waitForSelector('button.btn.btn-secondary');
  expect(logoutButton).not.toBeNull();
});

test('Error message is displayed if email does not exist', async ({ page }) => {
  await page.getByPlaceholder('Enter email').click();
  await page
    .getByPlaceholder('Enter email')
    .fill('emaildoesnotexist@gmail.com');
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill('password');
  await page.getByRole('button', { name: 'Login' }).click();

  const errorMessage = await page.waitForSelector('.alert-danger');

  expect(await errorMessage.innerText()).toBe('Account does not exist');
});

test('Error message is displayed if password is wrong', async ({ page }) => {
  await page.getByPlaceholder('Enter email').click();
  await page
    .getByPlaceholder('Enter email')
    .fill('playwrighttestnotadmin@gmail.com');
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill('wrongpassword');
  await page.getByRole('button', { name: 'Login' }).click();

  const errorMessage = await page.waitForSelector('.alert-danger');

  expect(await errorMessage.innerText()).toBe('Wrong password');
});
