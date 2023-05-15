import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/login');
});

test('Can create a new message successfully', async ({ page }) => {
  try {
    await page.getByPlaceholder('Enter email').click();
    await page
      .getByPlaceholder('Enter email')
      .fill('playwrighttestnotadmin@gmail.com');
    await page.getByPlaceholder('Password').click();
    await page.getByPlaceholder('Password').fill('password');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByRole('button', { name: 'Create a new message' }).click();
    await page.getByLabel('Title').click();
    await page.getByLabel('Title').fill('Hello Everyone');
    await page.getByLabel('Text').click();
    await page.getByLabel('Text').fill('Hello');
    await page.getByRole('button', { name: 'Sumbit' }).click();
    await page.getByText('Close').click();

    const cardTitleElement = await page.waitForSelector('.card-title');
    expect(await cardTitleElement.textContent()).toBe('Hello Everyone');
  } catch (err: any) {
    alert(err.message);
  }
});

test('A non-member user can not see the author name', async ({ page }) => {
  await page.getByPlaceholder('Enter email').click();
  await page
    .getByPlaceholder('Enter email')
    .fill('playwrighttestnotadmin@gmail.com');
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill('password');
  await page.getByRole('button', { name: 'Login' }).click();
  const cardSubTitleElement = await page.waitForSelector('.card-subtitle');
  expect(await cardSubTitleElement.textContent()).toBe('Anonymous');
});

test('A non-member user inputs the wrong passcode', async ({ page }) => {
  await page.getByPlaceholder('Enter email').click();
  await page
    .getByPlaceholder('Enter email')
    .fill('playwrighttestnotadmin@gmail.com');
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill('password');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('button', { name: 'Join the club' }).click();
  await page
    .getByPlaceholder('Hint: It is the most populated city in the world')
    .click();
  await page
    .getByPlaceholder('Hint: It is the most populated city in the world')
    .fill('Mumbai');
  await page.getByRole('button', { name: 'Sumbit' }).click();

  const errorMessage = await page.waitForSelector('.alert-danger');

  expect(await errorMessage.innerText()).toBe(
    'The passcode is not correct. Try again!'
  );
});

test('A non-member user inputs the correct passcode', async ({ page }) => {
  await page.getByPlaceholder('Enter email').click();
  await page
    .getByPlaceholder('Enter email')
    .fill('playwrighttestnotadmin@gmail.com');
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill('password');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('button', { name: 'Join the club' }).click();
  await page
    .getByPlaceholder('Hint: It is the most populated city in the world')
    .click();
  await page
    .getByPlaceholder('Hint: It is the most populated city in the world')
    .fill('Tokyo');
  await page.getByRole('button', { name: 'Sumbit' }).click();

  const errorMessage = await page.waitForSelector('.alert-success');

  expect(await errorMessage.innerText()).toBe('You are a member now!');
  await page.getByRole('button', { name: 'Close' }).first().click();
});

test('After entering the correct passcode, the user can see the names of the authors ', async ({
  page,
}) => {
  await page.getByPlaceholder('Enter email').click();
  await page
    .getByPlaceholder('Enter email')
    .fill('playwrighttestnotadmin@gmail.com');
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill('password');
  await page.getByRole('button', { name: 'Login' }).click();
  const cardSubTitleElement = await page.waitForSelector('.card-subtitle');
  expect(await cardSubTitleElement.textContent()).toBe('Test');
});

test('User can log out correctly', async ({ page }) => {
  await page.getByPlaceholder('Enter email').click();
  await page
    .getByPlaceholder('Enter email')
    .fill('playwrighttestnotadmin@gmail.com');
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill('password');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('button', { name: 'Logout' }).click();
  await page.waitForURL('http://localhost:4200/login');
  expect(page.url()).toBe('http://localhost:4200/login');
});

test('An admin user can remove a message', async ({ page }) => {
  await page.getByRole('link', { name: 'Create Account' }).click();
  await page.getByPlaceholder('Enter full name').click();
  await page.getByPlaceholder('Enter full name').fill('Admin User');
  await page.getByPlaceholder('Enter email').click();
  await page.getByPlaceholder('Enter email').fill('playwrightadmin@gmail.com');
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill('admin');
  await page.getByLabel('Admin').check();
  await page.getByRole('button', { name: 'Create a new account' }).click();
  await page.getByRole('button', { name: 'Remove' }).nth(0).click();
  try {
    await page.waitForSelector('.card-subtitle', { state: 'attached' });
    expect(true).toBeFalsy();
  } catch (error) {
    expect(error).toBeTruthy();
  }
});
