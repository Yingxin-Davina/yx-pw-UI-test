import { Page, expect } from "@playwright/test";
import { HelperBase } from "./helperBase";


export class DatePickerPage extends HelperBase {

    constructor(page: Page) {
        super(page)
    }

    /**
     * 
     * @param numberDeDayFromToday 
     */
    async selectCommeDateFromToday(numberDeDayFromToday: number) {
        const calendarInputField = this.page.getByPlaceholder("Form Picker")
        await calendarInputField.click()
        const datetoAssert = await this.selectDateInCalendar(numberDeDayFromToday)
        await expect(calendarInputField).toHaveValue(datetoAssert)
    }

    async selectDatePickerWithRangeFromToday(startDayFromToday: number, endDatFromToday: number) {
        const calendarInputField = this.page.getByPlaceholder("Range Picker")
        await calendarInputField.click()
        const dateAssertStart = await this.selectDateInCalendar(startDayFromToday)
        const dateAssertEnd = await this.selectDateInCalendar(endDatFromToday)
        const datetoAssert = `${dateAssertStart} - ${dateAssertEnd}`
        await expect(calendarInputField).toHaveValue(datetoAssert)

    }

    private async selectDateInCalendar(numberDeDayFromToday: number) {
        let date = new Date()
        date.setDate(date.getDate() + numberDeDayFromToday)
        const expectDate = date.getDate().toString()
        const expectMonthShort = date.toLocaleString('En-US', { month: 'short' })
        const expectMonthLong = date.toLocaleString('En-US', { month: 'long' })
        const NowMonthNumber = 4
        const NowYear = 2025
        const expectYear = date.getFullYear()
        const expectMonth = date.getMonth() + 1
        const datetoAssert = `${expectMonthShort} ${expectDate}, ${expectYear}`

        let calendarMonthandYear = await this.page.locator("nb-calendar-view-mode").textContent()
        const expectMonthandYear = ` ${expectMonthLong} ${expectYear} `

        while (!calendarMonthandYear.includes(expectMonthandYear)) {

            if (NowYear > expectYear || (NowYear === expectYear && NowMonthNumber > expectMonth)) {
                await this.page.locator('nb-calendar-pageable-navigation [data-name="chevron-left"]').click();
            } else {
                await this.page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click();
            }
            calendarMonthandYear = await this.page.locator("nb-calendar-view-mode").textContent()
        }

        await this.page.locator('.day-cell.ng-star-inserted').getByText(expectDate, { exact: true }).click()
        return datetoAssert
    }
}