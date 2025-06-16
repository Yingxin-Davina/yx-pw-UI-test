import { expect, test } from "@playwright/test"
import { PageManager } from "../page-objects/pageManager"
import { faker } from '@faker-js/faker'


test.beforeEach(async ({ page }) => {
    await page.goto('/')
})

test("go to form", async ({ page }) => {
    const pm = new PageManager(page)
    await pm.navigateTo().formLayoutPage()
    await pm.navigateTo().datePicker()
})

test("parametrized method ", async ({ page }) => {
    const pm = new PageManager(page)
    const randomFullName = faker.person.fullName()
    const randomEmail = `${randomFullName.replace(" ", "")}${faker.number.int(1000)}@test.com`
    await pm.navigateTo().formLayoutPage()
    await pm.onFormLayoutPage().submitLoginField("test@mail.com", "123RQFQF", "Option 2")
    // await page.screenshot({ path: 'screenshots/formLayoutPage.png' })
    // const buffer = await page.screenshot()
    await pm.onFormLayoutPage().submitInlineForm(randomFullName, randomEmail, true)
    // page.locator("nb-card", { hasText: "Inline form" }).screenshot({ path: 'screenshots/formPage.png' })

})

test("datePciker long", async ({ page }) => {
    const pm = new PageManager(page)
    await pm.navigateTo().datePicker()
    // await dateToPage.selectCommeDateFromToday(7)
    await pm.dateToPage().selectDatePickerWithRangeFromToday(10, 20)
})


