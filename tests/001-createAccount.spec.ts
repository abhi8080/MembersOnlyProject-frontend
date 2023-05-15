import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/register');
});

test('login link is displayed and can be clicked to navigate to login page', async ({
  page,
}) => {
  const backToLoginLink = await page.waitForSelector(
    'a.btn.btn-secondary.btn-block'
  );
  expect(backToLoginLink).not.toBeNull();

  await backToLoginLink.click();

  await page.waitForURL('http://localhost:4200/login');
  expect(page.url()).toBe('http://localhost:4200/login');
});

test('a new account is created successfully', async ({ page }) => {
  await page.getByPlaceholder('Enter full name').click();
  await page.getByPlaceholder('Enter full name').fill('Test');
  await page.getByPlaceholder('Enter email').click();
  await page
    .getByPlaceholder('Enter email')
    .fill('playwrighttestnotadmin@gmail.com');
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill('password');
  await page.getByRole('button', { name: 'Create a new account' }).click();
  const logoutButton = await page.waitForSelector('button.btn.btn-secondary');
  expect(logoutButton).not.toBeNull();
});

//http://localhost:4200/login
test("'Email already exists' is displayed when using an email that is already in use", async ({
  page,
}) => {
  await page.getByPlaceholder('Enter full name').click();
  await page.getByPlaceholder('Enter full name').fill('Another test');
  await page.getByPlaceholder('Enter email').click();
  await page
    .getByPlaceholder('Enter email')
    .fill('playwrighttestnotadmin@gmail.com');
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill('testpassword');
  await page.getByRole('button', { name: 'Create a new account' }).click();
  const errorMessage = await page.waitForSelector('.alert-danger');

  expect(await errorMessage.innerText()).toBe('Email already exists');
});
