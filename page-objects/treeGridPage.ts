import { Page, expect } from "@playwright/test";
import { HelperBase } from "./helperBase";

export class TreeGridPage extends HelperBase {

    constructor(page: Page) {
        super(page)
    }
    async checkTreeGrid() {
        // const rowsCount = await this.page.locator('tbody').evaluate(tbody =>
        //     tbody.querySelectorAll('tr').length
        // );
        const rowLocator = this.page.locator('.cdk-table.nb-tree-grid > tbody > tr')

        // await expect(rowLocator).toHaveCount(3);
        // const initRowTotal = await rowLocator.count()
        await rowLocator.first().waitFor({ state: 'visible' })
        const initRowTotal = await rowLocator.count()
        console.log(initRowTotal)

        let cellValue = 0
        let totalRowAfterClick = 0
        let totalRowBeforeClick = 3
        let index = 0

        for (let i = 0; i < initRowTotal; i++) {
            cellValue = Number(await rowLocator.nth(index).locator('td').last().textContent())
            await rowLocator.nth(index).getByRole('button', { exact: true }).click()
            totalRowAfterClick = await rowLocator.count()
            if (i == 0) {
                cellValue--
            }
            expect(totalRowBeforeClick + cellValue).toEqual(totalRowAfterClick)
            index = cellValue + index + 1
            totalRowBeforeClick = totalRowAfterClick
        }

    }

}



