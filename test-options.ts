import { test as base } from '@playwright/test'
import { PageManager } from "../pw-practice-app/page-objects/pageManager"

// create our own fixture
export type TestOptions = {
    globalQAUrl: string
    formLayourPages: string
    pageManager: PageManager
}

export const test = base.extend<TestOptions>({
    globalQAUrl: ['', { option: true }],
    // formLayourPages: [async ({ page }, use) => {
    //     await page.goto('/')
    //     await page.getByText("Forms").click()
    //     await page.getByText("Form Layouts").click()
    //     await use('')
    // }, { auto: true }],

    formLayourPages: async ({ page }, use) => {
        await page.goto('/')
        await page.getByText("Forms").click()
        await page.getByText("Form Layouts").click()
        await use('')
    },

    pageManager: async ({ page, formLayourPages }, use) => {
        const pm = new PageManager(page)
        await use(pm)
    }
}) 