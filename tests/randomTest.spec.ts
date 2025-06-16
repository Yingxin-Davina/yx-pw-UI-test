import { expect, test } from "@playwright/test"

test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByText("forms").click()
    await page.getByText("Form Layouts").click()
})

test("locator syntax rules", async ({ page }) => {
    // by tag name
    await page.locator("input").first().click()

    //by ID
    page.locator("#inputEmail1")

    // by class
    page.locator(".shape-rectangle")
    page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]')

    //by attribute
    page.locator('[placeholder="Email"]')
    page.locator('input.shape-rectangle[placeholder="Email"]')
    page.locator(":text('Using')")
    page.locator(":text-is('Using the Grid')")
})
test("locator textbox", async ({ page }) => {
    await page.getByRole('textbox', { name: "Email" }).first().click()
    // await page.getByRole('button', { name: 'Sign in' }).click();
    await page.getByLabel("Email").first().click()
    await page.getByPlaceholder('Jane Doe').click()
    await page.getByText("Using the Grid").click()
    await page.getByTestId("SignIn").click()
    //await page.getByTitle("IoT Dashboard").click()

})

test("locator child element ", async ({ page }) => {
    await page.locator('nb-card nb-radio :text-is("Option 1")').click()
    await page.locator('nb-card').getByRole('button', { name: 'Sign in' }).first().click()
    // await page.locator('nb-card').nth(3)
})

test("locator parent element ", async ({ page }) => {
    await page.locator("nb-card", { hasText: "Using the Grid" }).getByRole("textbox", { name: "Email" }).click()
    await page.locator('nb-card', { has: page.locator("#inputEmail1") }).getByRole("textbox", { name: "Email" }).click()
    await page.locator('nb-card').filter({ hasText: "Basic form" }).getByRole("textbox", { name: "Email" }).click()
    await page.locator('nb-card').filter({ has: page.locator(".status-danger") }).getByRole("textbox", { name: "Email" }).click()
    await page.locator(":text-is('Using the Grid')").locator('..').getByRole("textbox", { name: "Email" }).click()
    await page.locator('nb-card').filter({ has: page.locator("nb-checkbox") }).filter({ hasText: "Sign in" }).getByRole("textbox", { name: "Email" }).click()

})

test("Reusing the locator", async ({ page }) => {
    const basicForm = page.locator('nb-card').filter({ hasText: "Basic form" })
    const emailField = basicForm.getByRole("textbox", { name: "Email" })
    await emailField.fill('test@test.com')
    await basicForm.getByRole("textbox", { name: "Password" }).fill('welcome123')
    await basicForm.locator("nb-checkbox").click()
    await basicForm.getByRole("button").click()

    await expect(emailField).toHaveValue('test@test.com')

})

test("Extracting values", async ({ page }) => {
    const basicForm = page.locator('nb-card').filter({ hasText: "Basic form" })
    const buttonText = await basicForm.locator('button').textContent()
    expect(buttonText).toEqual("Submit")

    const allRadioButtonLabels = await page.locator("nb-radio").allTextContents()
    expect(allRadioButtonLabels).toContain("Option 1")
    //input value
    const emailField = basicForm.getByRole("textbox", { name: "Email" })
    await emailField.fill('test@test.com')
    const emailValue = await emailField.inputValue()
    expect(emailValue).toEqual("test@test.com")

    const placeholderValue = emailField.getAttribute("placeholder")
    expect(placeholderValue).toEqual('Email')
})

test("assertion", async ({ page }) => {

    const basicFormButton = page.locator('nb-card').filter({ hasText: "Basic form" }).locator('button')
    const textButton = await basicFormButton.textContent()
    expect(textButton).toEqual("Submit")

    await expect(basicFormButton).toHaveText("Submit")

    await expect.soft(basicFormButton).toHaveText("Submit3")
    await basicFormButton.click()
})


