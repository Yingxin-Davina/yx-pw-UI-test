import { expect, test } from "@playwright/test"
import { isArrayLike } from "rxjs/internal-compatibility"
import { ExpandOperator } from "rxjs/internal/operators/expand"

test.beforeEach(async ({ page }) => {
    await page.goto('/')
})


test.describe.only("form layout page", () => {
    // override
    //  test.describe.configure({ retries: 2 })
    test.beforeEach(async ({ page }) => {
        await page.getByText("forms").click()
        await page.getByText("Form Layouts").click()
    })

    test("input field", async ({ page }, testInfo) => {
        //  if(testInfo.retry){}
        const usingthegridInput = page.locator("nb-card", { hasText: 'Using the Grid' }).getByRole('textbox', { name: 'Email' })
        await usingthegridInput.fill("test@test.com")
        await usingthegridInput.clear()
        await usingthegridInput.pressSequentially('yingxindata@gmail.com')

        const inputValue = await usingthegridInput.inputValue()
        expect(inputValue).toEqual('yingxindata@gmail.com')

        await expect(usingthegridInput).toHaveValue('yingxindata@gmail.com')
    })

    test("radio button", async ({ page }) => {

        const usingTheGrid = page.locator("nb-card", { hasText: "Using the Grid" })
        await usingTheGrid.getByRole("radio", { name: "Option 2" }).check({ force: true })
        const radioState = await usingTheGrid.getByRole("radio", { name: "Option 1" }).isChecked()

        await expect(usingTheGrid.getByRole("radio", { name: "Option 1" })).toHaveScreenshot()
        // expect(radioState).toBeTruthy()
        // await expect(usingTheGrid.getByRole("radio", { name: "Option 2" })).toBeChecked()
        // expect(await usingTheGrid.getByRole("radio", { name: "Option 2" }).isChecked()).toBeTruthy()
        // expect(await usingTheGrid.getByRole("radio", { name: "Option 1" }).isChecked()).toBeFalsy()

    })
})


test("get checkbox", async ({ page }) => {
    await page.getByText("Modal & Overlays").click()
    await page.getByText("Toastr").click()

    await page.getByRole("checkbox", { name: "Hide on click" }).click({ force: true })
    await page.getByRole("checkbox", { name: "Hide on click" }).check({ force: true })
    await expect(page.getByRole("checkbox", { name: "Hide on click" })).toBeChecked()

    const allboxs = page.getByRole("checkbox")
    for (const box of await allboxs.all()) {
        await box.check({ force: true })
        expect(await box.isChecked()).toBeTruthy()
    }

})

test("list and dropdown", async ({ page }) => {
    const dropDown = page.locator('ngx-header nb-select')
    await dropDown.click()

    page.getByRole("list")      // has ul
    page.getByRole("listitem")  // has li

    const optionList = page.getByRole("list").locator("nb-option")
    //const optionList = page.locator("nb-option-list nb-option")
    await expect(optionList).toHaveText(["Light", "Dark", "Cosmic", "Corporate"])
    await optionList.filter({ hasText: "Cosmic" }).click()

    //see is the color is correct
    const header = page.locator("nb-layout-header")
    await expect(header).toHaveCSS("background-color", 'rgb(50, 50, 89)')

    const colors = {
        "Light": 'rgb(255, 255, 255)',
        "Dark": 'rgb(34, 43, 69)',
        "Cosmic": 'rgb(50, 50, 89)',
        "Corporate": 'rgb(255, 255, 255)',
    }
    await dropDown.click()
    for (const color in colors) {
        await optionList.filter({ hasText: color }).click()
        await expect(header).toHaveCSS("background-color", colors[color])

        if (color != "Corporate") {
            await dropDown.click()
        }
    }
})

test("tooltips", async ({ page }) => {
    await page.getByText("Modal & Overlays").click()
    await page.getByText("Tooltip").click()

    const tooltipcard = page.locator("nb-card", { hasText: "Tooltip Placements" })
    await tooltipcard.getByRole("button", { name: "Top" }).hover()
    // page.getByRole("tooltip")

    const tooltip = await page.locator('nb-tooltip').textContent()
    expect(tooltip).toEqual("This is a tooltip")
})


test("dialog box", async ({ page }) => {
    await page.getByText("Tables & Data").click()
    await page.getByText("Smart Table").click()
    page.on("dialog", dialog => {
        expect(dialog.message()).toEqual("Are you sure you want to delete?")
        dialog.accept()
    })
    await page.getByRole("table").locator('tr', { hasText: "mdo@gmail.com" }).locator(".nb-trash").click()
    await expect(page.locator("table tr").first()).not.toHaveText("mdo@gmail.com")
})


test("web table", async ({ page }) => {
    await page.getByText("Tables & Data").click()
    await page.getByText("Smart Table").click()
    await page.getByRole("row", { name: "twitter@outlook.com" }).locator(".nb-edit").click()
    await page.locator("input-editor").getByPlaceholder("Age").clear()
    await page.locator("input-editor").getByPlaceholder("Age").fill('35')
    await page.locator(".nb-checkmark").click()

    await page.locator(".ng2-smart-pagination-nav").getByText('2').click()
    const tagetRowById = page.getByRole("row", { name: "11" }).filter({ has: page.locator('td').nth(1).getByText('11') })
    await tagetRowById.locator(".nb-edit").click()
    await page.locator("input-editor").getByPlaceholder("E-mail").clear()
    await page.locator("input-editor").getByPlaceholder("E-mail").fill('testTestTESTTTTTT@com.fr')
    await page.locator(".nb-checkmark").click()
    await expect(tagetRowById.locator('td').nth(5)).toHaveText("testTestTESTTTTTT@com.fr")

    const ages = ["20", "30", "40", "200"]
    for (let age of ages) {
        await page.locator("input-filter").getByPlaceholder("Age").clear()
        await page.locator("input-filter").getByPlaceholder("Age").fill(age)
        await page.waitForTimeout(500)
        const rowAges = page.locator("tbody tr")

        for (let row of await rowAges.all()) {
            const cellValue = await row.locator('td').last().textContent()
            if (age == "200") {
                expect(await page.getByRole("table").textContent()).toContain('No data found')
            } else {
                expect(cellValue).toEqual(age)
            }

        }
    }
})

test("date picker", async ({ page }) => {
    await page.getByText("forms").click()
    await page.getByText("Datepicker").click()

    const calendarInputField = page.getByPlaceholder("Form Picker")
    await calendarInputField.click()

    let date = new Date()
    date.setDate(date.getDate() + 365)
    const expectDate = date.getDate().toString()
    const expectMonthShort = date.toLocaleString('En-US', { month: 'short' })
    const expectMonthLong = date.toLocaleString('En-US', { month: 'long' })
    const NowMonthNumber = 4
    const NowYear = 2025
    const expectYear = date.getFullYear()
    const expectMonth = date.getMonth() + 1
    const datetoAssert = `${expectMonthShort} ${expectDate}, ${expectYear}`

    let calendarMonthandYear = await page.locator("nb-calendar-view-mode").textContent()
    const expectMonthandYear = ` ${expectMonthLong} ${expectYear} `

    while (!calendarMonthandYear.includes(expectMonthandYear)) {

        if (NowYear > expectYear || (NowYear === expectYear && NowMonthNumber > expectMonth)) {
            await page.locator('nb-calendar-pageable-navigation [data-name="chevron-left"]').click();
        } else {
            await page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click();
        }
        calendarMonthandYear = await page.locator("nb-calendar-view-mode").textContent()
    }

    await page.locator('[class="day-cell ng-star-inserted"]').getByText(expectDate, { exact: true }).click()
    await expect(calendarInputField).toHaveValue(datetoAssert)
})

// test('测试 WebSocket 消息', async ({ page }) => {
//     // 1. 设置 WebSocket 消息监听
//     const messages: any[] = [];
//     page.on('websocket', (ws) => {
//         ws.on('framereceived', (data) => messages.push(JSON.parse(data)));
//     });

//     // 2. 导航到页面
//     await page.goto('/chat-page');

//     // 3. 等待初始连接
//     const wsPromise = page.waitForEvent('websocket');
//     const ws = await wsPromise;

//     // 4. 发送测试消息（模拟服务器响应）
//     await ws.send(JSON.stringify({ user: 'bot', text: 'Hello from server' }));

//     // 5. 验证页面显示
//     await expect(page.locator('.message')).toHaveText('Hello from server');
// });



