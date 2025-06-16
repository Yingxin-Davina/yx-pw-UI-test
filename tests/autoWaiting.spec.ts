import { expect, test } from "@playwright/test"
import { timeout } from "rxjs-compat/operator/timeout"

test.beforeEach(async ({ page }) => {
    await page.goto(process.env.URL)
    await page.getByText("Button Triggering AJAX Request").click()
    // add 2 seconds
    /// testInfo.setTimeout(testInfo.timeout + 2000);
})

test('auto wait', async ({ page }) => {
    const successButton = page.locator(".bg-success")
    // await clickb.click()
    // await successButton.waitFor({state: "attached"})
    //const text = await successButton.allTextContents()
    await expect(successButton).toHaveText('Data loaded with AJAX get request.', { timeout: 20000 })
})

test('altertive wait', async ({ page }) => {
    const successButton = page.locator(".bg-success")
    //   await page.waitForSelector(".bg-success")
    await page.waitForResponse("http://uitestingplayground.com/ajax")
    // await page.waitForLoadState('networkidle')  no recommande
    // await successButton.waitFor({state: "attached"})
    const text = await successButton.allTextContents()
    expect(text).toContain('Data loaded with AJAX get request.')
})

test('timeouts', async ({ page }) => {
    // test.setTimeout(10000) slow*3 times
    test.slow()
    const successButton = page.locator(".bg-success")
    await successButton.click()

})