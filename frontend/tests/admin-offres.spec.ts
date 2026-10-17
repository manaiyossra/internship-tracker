import { test, expect } from '@playwright/test';

test('un admin peut créer, modifier et supprimer une offre', async ({ page }) => {
  const adminEmail = process.env.E2E_ADMIN_EMAIL;
  const adminPassword = process.env.E2E_ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) {
    throw new Error('E2E_ADMIN_EMAIL et E2E_ADMIN_PASSWORD doivent être définis dans frontend/.env.test');
  }

  const uniqueTitre = `Offre Test E2E ${Date.now()}`;
  const updatedTitre = `${uniqueTitre} (modifiée)`;

  // Connexion admin
  await page.goto('/login');
  await page.getByLabel('Email', { exact: true }).fill(adminEmail);
  await page.getByLabel('Mot de passe', { exact: true }).fill(adminPassword);
  await page.getByRole('button', { name: 'Se connecter' }).click();
  await expect(page).toHaveURL('/');

  // Création
  await page.goto('/admin/offres');
  await page.getByRole('button', { name: '+ Nouvelle offre' }).click();
  await page.getByLabel('Entreprise', { exact: true }).fill('TestCorp E2E');
  await page.getByLabel('Titre', { exact: true }).fill(uniqueTitre);
  await page.getByLabel('Description', { exact: true }).fill('Offre créée automatiquement par un test e2e.');
  await page.getByLabel('Ville', { exact: true }).fill('Sfax');
  await page.locator('form button[type="submit"]').click();

  const card = page.locator('.bg-white.p-4.rounded-lg.shadow-sm').filter({ hasText: uniqueTitre });
  await expect(card).toBeVisible();

  // Modification
  await card.getByRole('button', { name: 'Modifier' }).click();
  await page.getByLabel('Titre', { exact: true }).fill(updatedTitre);
  await page.locator('form button[type="submit"]').click();

  const updatedCard = page.locator('.bg-white.p-4.rounded-lg.shadow-sm').filter({ hasText: updatedTitre });
  await expect(updatedCard).toBeVisible();

  // Suppression (nettoyage)
  page.once('dialog', (dialog) => dialog.accept());
  await updatedCard.getByRole('button', { name: 'Supprimer' }).click();

  await expect(page.getByText(updatedTitre)).not.toBeVisible();
});