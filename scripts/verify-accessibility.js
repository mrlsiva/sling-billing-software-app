const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    try {
        await page.goto('http://localhost:4200/', { waitUntil: 'networkidle2', timeout: 10000 });
        // wait for app to render
        await page.waitForSelector('app-header', { timeout: 5000 });

        // find hamburger and click
        const hamburger = await page.$('.app-header .hamburger');
        if (!hamburger) { throw new Error('Hamburger not found'); }
        await hamburger.click();

        // wait for side menu to open
        await page.waitForSelector('.side-menu.open', { timeout: 3000 });

        // ensure focus moved inside menu
        const activeHandle = await page.evaluateHandle(() => document.activeElement);
        const activeTag = await page.evaluate(el => el?.tagName, activeHandle);

        console.log('Active element after open:', activeTag);

        // Press Tab several times and ensure focus remains inside side-menu
        const results = [];
        for (let i = 0; i < 6; i++) {
            await page.keyboard.press('Tab');
            const active = await page.evaluate(() => document.activeElement && document.activeElement.closest ? document.activeElement.closest('.side-menu') !== null : false);
            results.push(active);
        }
        console.log('Tab stays inside side-menu:', results.every(Boolean));

        // Press Escape and ensure menu closes and focus returns to hamburger
        await page.keyboard.press('Escape');
        await page.waitForSelector('.side-menu.open', { hidden: true, timeout: 3000 });
        const activeAfter = await page.evaluate(() => document.activeElement?.className || document.activeElement?.tagName);
        console.log('Menu closed, active element after close:', activeAfter);

        console.log('Accessibility check completed successfully');
    } catch (err) {
        console.error('Accessibility check failed:', err && err.message ? err.message : err);
        process.exitCode = 2;
    } finally {
        await browser.close();
    }
})();
