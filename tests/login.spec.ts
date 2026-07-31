// Test suite cho tính năng Login
// Target: https://the-internet.herokuapp.com/login

const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');

// Credentials hợp lệ của trang demo
const VALID_USERNAME = 'tomsmith';
const VALID_PASSWORD = 'SuperSecretPassword!';

test.describe('Login Feature', () => {
  let loginPage;

  // Khởi tạo LoginPage object trước mỗi test
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('TC01 — Login thành công với credentials hợp lệ', async ({ page }) => {
    // Thực hiện login
    await loginPage.login(VALID_USERNAME, VALID_PASSWORD);
    
    // Verify redirect sang /secure
    await expect(page).toHaveURL(/.*secure1233/);
    
    // Verify flash message chứa thông báo thành công
    const flashText = await loginPage.getFlashMessage();
    expect(flashText).toContain('You logged into a secure area');
    
    // Verify heading trang Secure Area
    await expect(loginPage.pageHeading).toContainText('Secure Area');
  });

  test('TC02 — Login thất bại với password sai', async ({ page }) => {
    // Login với password không đúng
    await loginPage.login(VALID_USERNAME, 'wrong-password-123');
    
    // Verify vẫn ở trang login (không redirect)
    await expect(page).toHaveURL(/.*login/);
    
    // Verify flash message hiển thị lỗi
    const flashText = await loginPage.getFlashMessage();
    expect(flashText).toContain('Your password is invalid');
  });

  test('TC03 — Login thất bại với username sai', async ({ page }) => {
    // Login với username không tồn tại
    await loginPage.login('nonexistent_user', VALID_PASSWORD);
    
    // Verify vẫn ở trang login
    await expect(page).toHaveURL(/.*login/);
    
    // Verify flash message hiển thị lỗi username
    const flashText = await loginPage.getFlashMessage();
    expect(flashText).toContain('Your username is invalid');
  });

  test('TC03.1 — Login thất bại khi username và password đều rỗng', async ({ page }) => {
    // Login với dữ liệu rỗng
    await loginPage.login('', '');

    // Verify vẫn ở trang login
    await expect(page).toHaveURL(/.*login/);

    // Verify flash message hiển thị lỗi
    const flashText = await loginPage.getFlashMessage();
    expect(flashText).toContain('Your username is invalid');
  });
  // Thêm 1 test sai vào tests/login.spec.js
test('TC_INTENTIONAL_FAIL — Test để kiểm tra AI pipeline', async ({ page }) => {
  await loginPage.login(VALID_USERNAME, VALID_PASSWORD);
  // Selector không tồn tại — sẽ fail
  await expect(page.locator('#nonexistent-element-xyz')).toBeVisible();
});
});