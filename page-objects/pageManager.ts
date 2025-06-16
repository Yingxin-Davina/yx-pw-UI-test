import { Page, expect } from "@playwright/test";
import { NavigationPage } from "../page-objects/navigationPage";
import { FormLayoutPage } from "../page-objects/formLayoutPage";
import { DatePickerPage } from "../page-objects/datePickerPage"
import { TreeGridPage } from "./treeGridPage";


export class PageManager {

    readonly page: Page
    readonly navigationPage: NavigationPage
    readonly formlayoutPage: FormLayoutPage
    readonly datePickerPage: DatePickerPage
    readonly tableTreeGridPage: TreeGridPage

    constructor(page: Page) {
        this.page = page
        this.navigationPage = new NavigationPage(this.page)
        this.formlayoutPage = new FormLayoutPage(this.page)
        this.datePickerPage = new DatePickerPage(this.page)
        this.tableTreeGridPage = new TreeGridPage(this.page)

    }
    navigateTo() {
        return this.navigationPage
    }

    onFormLayoutPage() {
        return this.formlayoutPage
    }

    dateToPage() {
        return this.datePickerPage
    }

    treeGridToPage() {
        return this.tableTreeGridPage
    }

}