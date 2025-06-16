import { Locator, Page } from "@playwright/test";
import { HelperBase } from "./helperBase";


export class NavigationPage extends HelperBase {

    readonly formMenuLocator: Locator
    readonly datePickerLocator: Locator
    readonly treeGridLocator: Locator

    constructor(page: Page) {
        super(page)
        this.formMenuLocator = page.getByText("Form Layouts")
        this.datePickerLocator = page.getByText("Datepicker")
        this.treeGridLocator = page.getByText('Tree Grid')
    }

    async formLayoutPage() {
        await this.selectGroupMenuItem("Forms")
        await this.formMenuLocator.click()
        await this.waitforNumberOfSecond(1)
    }

    async datePicker() {
        await this.selectGroupMenuItem("Forms")
        await this.datePickerLocator.click()
    }

    async tableAndDataToTree() {
        await this.selectGroupMenuItem("Tables & Data")
        await this.treeGridLocator.click()
    }

    private async selectGroupMenuItem(groupItemTitle: string) {
        const groupMenuItem = this.page.getByTitle(groupItemTitle)
        const expandedState = await groupMenuItem.getAttribute("aria-expanded")
        if (expandedState == "false") {
            groupMenuItem.click()
        }
    }
}