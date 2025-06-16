import { expect, test, request } from "@playwright/test"
import { faker } from '@faker-js/faker';
import * as fs from 'fs';

test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByText("Auth").click()
    await page.getByText("Register").click()
})

test("mocking registation", async ({ }) => {

    const context = await request.newContext()
    const users: any[] = []
    for (let i = 0; i < 10; i++) {
        const password = faker.internet.password({ length: 20 })
        const user = {
            username: faker.internet.username(),
            email: faker.internet.email(),
            password: password,
            resetpassword: password
        }
        const response = await context.post('http://localhost:4200/auth/register/', {
            data: user,
            headers: {
                'Content-Type': 'application/json'
            }
        })
        expect(response.ok()).toBeTruthy();

        const responseBody = await response.json();
        users.push({
            ...user,
            userId: responseBody.userId // 根据实际 API 返回字段调整
        });

        fs.writeFileSync('user.json', JSON.stringify(users, null, 2));
    }


})

