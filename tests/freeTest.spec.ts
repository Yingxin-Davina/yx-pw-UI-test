import { expect, test } from "@playwright/test"
import { PageManager } from "../page-objects/pageManager"


test.beforeEach(async ({ page }) => {
    await page.goto('/')
})
test('new self test free', async ({ page }) => {
    const pm = new PageManager(page)
    await pm.navigateTo().tableAndDataToTree()
    await pm.treeGridToPage().checkTreeGrid()
})

test("slider", async ({ page }) => {


    // by simulate mouse mouvement
    const tempBox = page.locator("[tabtitle='Temperature'] ngx-temperature-dragger")
    await tempBox.scrollIntoViewIfNeeded()
    const box = await tempBox.boundingBox()
    const x = box.x + box.width / 2
    const y = box.y + box.height / 2
    await page.mouse.move(x, y)
    await page.mouse.down()
    await page.mouse.move(x + 100, y)
    await page.mouse.move(x + 100, y + 100)
    await page.mouse.up()
    await expect(tempBox).toContainText("30")

    // by update attribute
    await page.getByText('Humidity').click()
    // await page.locator("nb-tabset span", { hasText: 'Humidity' }).click()
    const tempGet = page.locator("[tabtitle='Temperature'] ngx-temperature-dragger circle")
    await tempGet.evaluate(node => {
        node.setAttribute('cx', "262.814")
        node.setAttribute('cy', "112.822")
    })
    await expect(tempGet).toBeVisible()
    await tempGet.click()
    const tempGetShow = page.locator("[tabtitle='Temperature'] ngx-temperature-dragger")
    await expect(tempGetShow).toContainText("80")
})


test('上传用户头像', async ({ page }) => {
    await page.goto('/profile');

    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.locator('input[type="file"]').click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles('./test-data/avatar.png');

    await expect(page.locator('.avatar-preview')).toBeVisible();
    await expect(page.locator('.avatar-preview img')).toHaveAttribute(
        'src',
        /avatar\.png/
    );
});


test('在新标签页打开隐私政策', async ({ page, context }) => {
    await page.goto('/');

    const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        page.click('a[target="_blank"]')
    ]);

    await newPage.waitForLoadState();
    await expect(newPage).toHaveURL(/privacy/);
    await expect(newPage.locator('h1')).toHaveText('隐私政策');
});


test('拖放排序功能', async ({ page }) => {
    await page.goto('/sortable');

    const item1 = page.locator('.item').first();
    const dropzone = page.locator('.dropzone');

    await item1.dragTo(dropzone);

    await expect(dropzone.locator('.item')).toHaveCount(1);
    await expect(page.locator('.item').first()).toHaveAttribute('data-id', '2');
});

test('商品列表API Mock', async ({ page }) => {
    // 拦截API请求
    await page.route('/api/products', route => {
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([{ id: 1, name: '测试商品' }])
        });
    });

    await page.goto('/products');
    page.getAttribute


    // 验证mock数据
    await expect(page.locator('.product-name')).toHaveText('测试商品');

    // 验证请求发生
    const request = await page.waitForRequest('/api/products');
    expect(request.method()).toBe('GET');
});


test('上传 PDF 文件', async ({ page }) => {
    // 1. 打开上传页面
    await page.goto('https://www.ilovepdf.com/fr/pdf_en_jpg');

    // 2. 选择文件（文件需放在测试目录下，如 `./test-files/sample.pdf`）
    const filePath = './APPRENTI.pdf';
    await page.locator('#pickfiles').setInputFiles(filePath);

    // 3. 点击上传按钮
    await page.click('#upload-button');

    // 4. 验证上传成功（如提示消息或文件名显示）
    await expect(page.locator('.upload-success')).toHaveText('上传成功');
    await expect(page.locator('.file-name')).toContainText('sample.pdf');
});






