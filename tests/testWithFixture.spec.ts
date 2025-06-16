//import { expect, test } from "@playwright/test"
import { faker } from '@faker-js/faker'
import { test } from "../test-options"

test("parametrized method ", async ({ pageManager }) => {
    const randomFullName = faker.person.fullName()
    const randomEmail = `${randomFullName.replace(" ", "")}${faker.number.int(1000)}@test.com`
    //  await pm.navigateTo().formLayoutPage()
    await pageManager.onFormLayoutPage().submitLoginField("test@mail.com", "123RQFQF", "Option 2")
    await pageManager.onFormLayoutPage().submitInlineForm(randomFullName, randomEmail, true)
})