import { Page, expect } from "@playwright/test";


export class HelperBase {

    readonly page: Page

    constructor(page: Page) {
        this.page = page

    }

    async waitforNumberOfSecond(timeInSecond: number) {
        await this.page.waitForTimeout(timeInSecond * 1000)
    }

}

//索引查询类型
type Props = { a: number; b: number; c: boolean }
type TypeA = Props['a' | 'b']
type TypeB = Props[keyof Props]
//类型声明文件
