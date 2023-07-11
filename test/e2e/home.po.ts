import { Locator, Page, Response } from '@playwright/test';

export class Home {
    constructor(private _page: Page) {}

    public getHeadline(): Locator {
        return this._page.locator('vtm-app h1');
    }

    public getNextHeadline(): Locator {
        return this._page.locator('vtm-app h1').nth(1);
    }

    public navigateTo(): Promise<null | Response> {
        return this._page.goto('./');
    }
}
