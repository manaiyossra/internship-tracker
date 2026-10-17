import { test, expect } from '@playwright/test';

test('un candidat sans CV reçoit une erreur en essayant de postuler', async ({ page }) => {
  const uniqueEmail = `candidat-${Date.now()}@example.com`;

  await page.goto('/register');
  await page.getByLabel('Prénom', { exact: true }).fill('Jean');
  await page.getByLabel('Nom', { exact: true }).fill('Dupont');
  await page.getByLabel('Email', { exact: true }).fill(uniqueEmail);
  await page.getByLabel('Mot de passe', { exact: true }).fill('motdepasse123');
  await page.getByRole('button', { name: 'Créer mon compte' }).click();

  await expect(page).toHaveURL('/');

  await page.getByText('Stage développeur full-stack').click();
  await expect(page.getByRole('heading', { name: 'Stage développeur full-stack' })).toBeVisible();

  await page.getByRole('button', { name: 'Postuler' }).click();

  await expect(page.getByText(/CV/i)).toBeVisible();
});