import { redirect, type RequestHandler } from '@sveltejs/kit';
import { dev } from '$app/environment';
import chromium from '@sparticuz/chromium-min';
import puppeteer, { type PuppeteerLaunchOptions } from 'puppeteer-core';

export const GET = (async ({ url }) => {
    if (!dev) throw redirect(303, url.origin);

    const identifier = url.searchParams.get('identifier');
    const viewURL = new URL('api/v1/shape/view', url.origin);
    if (identifier)
        viewURL.searchParams.set('identifier', identifier);

    const options: PuppeteerLaunchOptions = dev ? {
        headless: 'new',
        channel: 'chrome'
    } : {
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath('https://github.com/Sparticuz/chromium/releases/download/v115.0.0/chromium-v115.0.0-pack.tar'),
        headless: chromium.headless,
        ignoreHTTPSErrors: true,
    };
    const browser = await puppeteer.launch(options);

    try {
        const size = 256;
        const page = await browser.newPage();
        console.error('test');
        await page.setViewport({ width: size, height: size });
        await page.goto(viewURL.href, {
            waitUntil: 'load'
        });

        const data = await page.screenshot({
            type: "png",
            omitBackground: true,
        });
        await browser.close();

        return new Response(data as Buffer);
    } catch (error) {
        return new Response((error as object).toString());
    }
}) satisfies RequestHandler;
