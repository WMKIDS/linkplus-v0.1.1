import asyncio
from playwright.async_api import async_playwright
import time

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        # Test Login
        await page.goto("http://localhost:5000/login")
        time.sleep(1)
        await page.fill("input[name='username']", "omar")
        await page.fill("input[name='password']", "omar123")
        await page.click("button[type='submit']")
        time.sleep(2)

        # Merchant Dashboard
        await page.screenshot(path="/home/jules/verification/merchant_dashboard_auth.png")

        # Add Product Modal
        await page.evaluate("switchMerchantTab('inventory')")
        time.sleep(1)
        await page.evaluate("document.getElementById('add-product-modal').classList.remove('hidden')")
        time.sleep(1)
        await page.screenshot(path="/home/jules/verification/merchant_add_product.png")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
