const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const baseUrl = process.env.E2E_BASE_URL || 'http://127.0.0.1:4173/';
  const outDir = path.join(process.cwd(), 'test-artifacts');
  fs.mkdirSync(outDir, { recursive: true });
  const imgPath = path.join(outDir, 'mock-memory.png');
  const pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAIAAAAlC+aJAAAApUlEQVR4nO3QwQnAMAwEwVz/0u6dQ2mQICuxeezAIB4f28fbD+7ZB+AHMgYyBjIGMgYyBjIGMgYyBjIGMgYyBjIGMgYyBjIGMgYyBjIGMgYyBjIGMgYyBjIGMgYyBjIGMgYyBjIGMgYyBjIGMgYyBjIGMgYyBjIGMgYyBjIGMgYyBjIGMgYyBjIGMgYyBjIGMgYyBjIGMgYyBjIGMgYyBjIGMgYyBjIGMgYyBjIG8gIFtQJHCEdRtwAAAABJRU5ErkJggg==';
  fs.writeFileSync(imgPath, Buffer.from(pngBase64, 'base64'));

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    acceptDownloads: true,
    permissions: ['clipboard-read', 'clipboard-write'],
  });
  const page = await context.newPage();
  const events = { console: [], pageErrors: [], popups: [] };
  page.on('console', msg => {
    if (['error', 'warning'].includes(msg.type())) events.console.push(`${msg.type()}: ${msg.text()}`);
  });
  page.on('pageerror', err => events.pageErrors.push(err.message));

  await page.goto(baseUrl, { waitUntil: 'networkidle', timeout: 30000 });
  await page.screenshot({ path: path.join(outDir, '01-home.png'), fullPage: true });
  await page.locator('main h2', { hasText: 'Memory Playlist' }).waitFor({ timeout: 10000 });
  await page.locator('input[type="file"]').setInputFiles(imgPath);
  await page.getByAltText('Tu recuerdo').waitFor({ timeout: 10000 });
  await page.getByText(/Lectura de la foto|Ajustaré la playlist/i).waitFor({ timeout: 12000 });
  await page.screenshot({ path: path.join(outDir, '02-form-filled.png'), fullPage: true });
  await page.getByRole('button', { name: /Crear playlist/i }).click();
  await page.getByRole('button', { name: /Abrir en YouTube/i }).waitFor({ timeout: 5000 });
  await page.getByRole('button', { name: /Buscar en Spotify/i }).waitFor({ timeout: 5000 });
  await page.getByRole('button', { name: /Buscar en Apple/i }).waitFor({ timeout: 5000 });
  const stored = await page.evaluate(() => {
    const raw = localStorage.getItem('memoryplaylist_playlists') || localStorage.getItem('fryda_playlists');
    return raw ? JSON.parse(raw) : [];
  });
  if (!stored?.[0]?.photo_preview) throw new Error('Generated playlist did not persist photo_preview for share cards');
  await page.screenshot({ path: path.join(outDir, '03-playlist-result.png'), fullPage: true });

  await page.getByRole('button', { name: /Compartir/i }).click();
  await page.getByRole('button', { name: /Copiar lista/i }).click();
  const sharedText = await page.evaluate(() => navigator.clipboard.readText());
  const sharedUrl = sharedText.match(/https?:\/\/\S+#share=[^\s]+/)?.[0];
  if (!sharedUrl) throw new Error(`Share text did not include a portable #share URL: ${sharedText.slice(0, 160)}`);
  await page.keyboard.press('Escape');
  await page.getByRole('dialog').waitFor({ state: 'hidden', timeout: 5000 });

  const sharedContext = await browser.newContext();
  const sharedPage = await sharedContext.newPage();
  await sharedPage.goto(sharedUrl, { waitUntil: 'networkidle', timeout: 30000 });
  await sharedPage.getByText(/Nueva experiencia/).waitFor({ timeout: 10000 });
  await sharedPage.getByRole('button', { name: /Abrir en YouTube/i }).waitFor({ timeout: 5000 });
  await sharedPage.getByRole('button', { name: /Buscar en Spotify/i }).waitFor({ timeout: 5000 });
  await sharedPage.getByRole('button', { name: /Buscar en Apple/i }).waitFor({ timeout: 5000 });
  const sharedRestored = await sharedPage.evaluate(() => {
    const raw = localStorage.getItem('memoryplaylist_playlists');
    const playlists = raw ? JSON.parse(raw) : [];
    return Boolean(playlists?.[0]?.photo_preview);
  });
  if (!sharedRestored) throw new Error('Portable shared playlist did not restore photo_preview');
  await sharedPage.screenshot({ path: path.join(outDir, '04-shared-link-result.png'), fullPage: true });
  await sharedContext.close();

  const [ytPopup] = await Promise.all([
    context.waitForEvent('page', { timeout: 10000 }),
    page.getByRole('button', { name: /Abrir en YouTube/i }).click(),
  ]);
  await ytPopup.waitForLoadState('domcontentloaded', { timeout: 15000 }).catch(() => {});
  const ytUrl = ytPopup.url();
  await ytPopup.close().catch(() => {});

  const [spPopup] = await Promise.all([
    context.waitForEvent('page', { timeout: 10000 }),
    page.getByRole('button', { name: /Buscar en Spotify/i }).click(),
  ]);
  await spPopup.waitForLoadState('domcontentloaded', { timeout: 15000 }).catch(() => {});
  const spUrl = spPopup.url();
  await spPopup.close().catch(() => {});

  const [applePopup] = await Promise.all([
    context.waitForEvent('page', { timeout: 10000 }),
    page.getByRole('button', { name: /Buscar en Apple/i }).click(),
  ]);
  await applePopup.waitForLoadState('domcontentloaded', { timeout: 15000 }).catch(() => {});
  const appleUrl = applePopup.url();
  await applePopup.close().catch(() => {});

  if (!/youtube\.com\/(watch|watch_videos|results)/.test(ytUrl)) throw new Error(`Unexpected YouTube popup URL: ${ytUrl}`);
  if (!/open\.spotify\.com\/search\//.test(spUrl)) throw new Error(`Unexpected Spotify popup URL: ${spUrl}`);
  if (!/music\.apple\.com\/(?:[a-z]{2}\/)?search/.test(appleUrl)) throw new Error(`Unexpected Apple Music popup URL: ${appleUrl}`);
  const resultText = (await page.locator('body').innerText()).slice(0, 1000);
  if (!/Nueva experiencia/.test(resultText)) throw new Error('Playlist result did not render expected navigation');
  if (events.pageErrors.length) throw new Error(`Page errors: ${events.pageErrors.join(' | ')}`);

  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto(sharedUrl, { waitUntil: 'networkidle', timeout: 30000 });
  await mobilePage.getByText(/Nueva experiencia/).waitFor({ timeout: 10000 });
  await mobilePage.getByRole('button', { name: /Buscar en Apple/i }).waitFor({ timeout: 5000 });
  await mobilePage.screenshot({ path: path.join(outDir, '05-mobile-shared-result.png'), fullPage: true });
  await mobileContext.close();

  const paywallContext = await browser.newContext();
  const paywallPage = await paywallContext.newPage();
  await paywallPage.goto(baseUrl, { waitUntil: 'networkidle', timeout: 30000 });
  await paywallPage.evaluate(() => {
    localStorage.setItem('memoryplaylist_playlists', JSON.stringify([
      { id: 'free-1', created_at: '2026-05-26T00:00:00.000Z' },
      { id: 'free-2', created_at: '2026-05-26T00:01:00.000Z' },
      { id: 'free-3', created_at: '2026-05-26T00:02:00.000Z' },
    ]));
  });
  await paywallPage.reload({ waitUntil: 'networkidle' });
  await paywallPage.getByText(/Ya usaste tus 3 playlists gratis/i).waitFor({ timeout: 5000 });
  const generateDisabled = await paywallPage.getByRole('button', { name: /Crear playlist/i }).isDisabled();
  if (!generateDisabled) throw new Error('Free limit paywall did not disable playlist generation after 3 playlists');
  await paywallPage.screenshot({ path: path.join(outDir, '06-paywall.png'), fullPage: true });
  await paywallContext.close();

  console.log(JSON.stringify({ ok: true, youtubeUrl: ytUrl, spotifyUrl: spUrl, appleUrl, sharedUrlOk: true, photoPreviewStored: true, freeLimitPaywall: true, screenshots: ['test-artifacts/01-home.png','test-artifacts/02-form-filled.png','test-artifacts/03-playlist-result.png','test-artifacts/04-shared-link-result.png','test-artifacts/05-mobile-shared-result.png','test-artifacts/06-paywall.png'], console: events.console.slice(0, 10) }, null, 2));
  await browser.close();
})().catch(async (err) => {
  console.error(err);
  process.exit(1);
});
