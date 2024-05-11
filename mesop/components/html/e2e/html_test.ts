import {test, expect} from '@playwright/test';

test('test', async ({page}) => {
  await page.goto('/components/html/e2e/html_app');
  expect(await page.getByText('Hello, world!').textContent()).toContain(
    'Hello, world!',
  );
});
