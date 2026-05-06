const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const outDir = path.join(process.cwd(), 'test-artifacts');
  fs.mkdirSync(outDir, { recursive: true });
  const imgPath = path.join(outDir, 'mock-memory.png');
  const pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAIAAAAlC+aJAAAApUlEQVR4nO3QwQnAMAwEwVz/0u6dQ2mQICuxeezAIB4f28fbD+7ZB+AHMgYyBjIGMgYyBjIGMgYyBjIGMgYyBjIGMgYyBjIGMgYyBjIGMgYyBjIGMgYyBjIGMgYyBjIGMgYyBjIGMgYyBjIGMgYyBjIGMgYyBjIGMgYyBjIGMgYyBjIGMgYyBjIGMgYyBjIGMgYyBjIGMgYyBjIGMgYyBjIGMgYyBjIGMgYyBjIG8gIFtQJHCEdRtwAAAABJRU5ErkJggg==';
  fs.writeFileSync(imgPath, Buffer.from(pngBase64, 'base64'));

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ acceptDownloads: true });
  const page = await context.newPage();
  const events = { console: [], pageErrors: [], popups: [] };
  page.on('console', msg => {
    if (['error', 'warning'].includes(msg.type())) events.console.push(`${msg.type()}: ${msg.text()}`);
  });
  page.on('pageerror', err => events.pageErrors.push(err.message));

  await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle', timeout: 30000 });
  await page.screenshot({ path: path.join(outDir, '01-home.png'), fullPage: true });
  await page.getByText('Revive tus recuerdos').waitFor({ timeout: 10000 });
  await page.locator('input[type="file"]').setInputFiles(imgPath);
  await page.getByAltText('Tu recuerdo').waitFor({ timeout: 10000 });
  await page.getByText(/Lectura de la foto|Ajustaré la playlist/i).waitFor({ timeout: 12000 });
  await page.screenshot({ path: path.join(outDir, '02-form-filled.png'), fullPage: true });
  await page.getByRole('button', { name: /Crear playlist/i }).click();
  await page.getByText(/canciones/).waitFor({ timeout: 15000 });
  await page.getByRole('button', { name: /YouTube/i }).waitFor({ timeout: 5000 });
  await page.getByRole('button', { name: /Spotify/i }).waitFor({ timeout: 5000 });
  await page.screenshot({ path: path.join(outDir, '03-playlist-result.png'), fullPage: true });

  const [ytPopup] = await Promise.all([
    context.waitForEvent('page', { timeout: 10000 }),
    page.getByRole('button', { name: /YouTube/i }).click(),
  ]);
  await ytPopup.waitForLoadState('domcontentloaded', { timeout: 15000 }).catch(() => {});
  const ytUrl = ytPopup.url();
  await ytPopup.close().catch(() => {});

  const [spPopup] = await Promise.all([
    context.waitForEvent('page', { timeout: 10000 }),
    page.getByRole('button', { name: /Spotify/i }).click(),
  ]);
  await spPopup.waitForLoadState('domcontentloaded', { timeout: 15000 }).catch(() => {});
  const spUrl = spPopup.url();
  await spPopup.close().catch(() => {});

  if (!/youtube\.com\/(watch|watch_videos|results)/.test(ytUrl)) throw new Error(`Unexpected YouTube popup URL: ${ytUrl}`);
  if (!/open\.spotify\.com\/search\//.test(spUrl)) throw new Error(`Unexpected Spotify popup URL: ${spUrl}`);
  const resultText = (await page.locator('body').innerText()).slice(0, 1000);
  if (!/Nueva experiencia/.test(resultText)) throw new Error('Playlist result did not render expected navigation');
  if (events.pageErrors.length) throw new Error(`Page errors: ${events.pageErrors.join(' | ')}`);

  console.log(JSON.stringify({ ok: true, youtubeUrl: ytUrl, spotifyUrl: spUrl, screenshots: ['test-artifacts/01-home.png','test-artifacts/02-form-filled.png','test-artifacts/03-playlist-result.png'], console: events.console.slice(0, 10) }, null, 2));
  await browser.close();
})().catch(async (err) => {
  console.error(err);
  process.exit(1);
});
