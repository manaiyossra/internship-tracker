import { test, expect } from '@playwright/test';

test("un nouvel utilisateur peut s'inscrire et accède à la liste des offres", async ({ page }) => {
  const uniqueEmail = `test-${Date.now()}@example.com`;

  await page.goto('/register');

  await page.getByLabel('Prénom', { exact: true }).fill('Jean');
  await page.getByLabel('Nom', { exact: true }).fill('Dupont');
  await page.getByLabel('Email', { exact: true }).fill(uniqueEmail);
  await page.getByLabel('Mot de passe', { exact: true }).fill('motdepasse123');


  await page.getByRole('button', { name: 'Créer mon compte' }).click();

  await expect(page).toHaveURL('/');
  await expect(page.getByRole('heading', { name: 'Offres de stage' })).toBeVisible();
});