import { expect } from "@playwright/test"
import { test } from '../test-options'

test("drag test", { tag: '@fast' }, async ({ page, globalQAUrl }) => {

  await page.goto(globalQAUrl)
  // await page.getByRole("button", {name: "Content"}).click()
  const button = page.locator('[class="fc-button fc-cta-consent fc-primary-button"]')
  await button.click();
  const frame = page.frameLocator("[rel-title='Photo Manager'] iframe")
  await frame.locator("li", { hasText: 'High Tatras 2' }).dragTo(frame.locator("#trash"))

  // more precise control
  await frame.locator("li", { hasText: 'High Tatras 4' }).hover()
  await page.mouse.down()
  await frame.locator("#trash").hover()
  await page.mouse.up()
  await expect(frame.locator("#trash li h5")).toHaveText(["High Tatras 2", "High Tatras 4"])
  // await page.keyboard.press('Enter'); // 模拟按下并释放 Enter 键
  // await page.keyboard.down('Control'); // 按下 Ctrl 键（不释放）
  // await page.keyboard.up('Control');   // 释放 Ctrl 键

})