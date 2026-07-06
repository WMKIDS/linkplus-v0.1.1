import asyncio
from playwright.async_api import async_playwright
import time

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        # Navigate to the app
        await page.goto("http://localhost:5000")
        time.sleep(2) # let it settle

        # Admin View (Add modal open)
        await page.evaluate("document.getElementById('add-merchant-modal').classList.remove('hidden')")
        time.sleep(1)
        await page.screenshot(path="/home/jules/verification/admin_modal.png")
        await page.reload()
        time.sleep(1)

        # Merchant View (Inventory Tab)
        await page.evaluate("switchView('merchant-view')")
        time.sleep(1)
        await page.evaluate("switchMerchantTab('inventory')")
        time.sleep(1)
        await page.screenshot(path="/home/jules/verification/merchant_inventory.png")

        # Shop View (Cart Open)
        await page.evaluate("switchView('shop-view')")
        time.sleep(1)

        # Open Cart
        await page.evaluate("toggleShopCart()")
        time.sleep(1)
        await page.screenshot(path="/home/jules/verification/shop_cart.png")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
