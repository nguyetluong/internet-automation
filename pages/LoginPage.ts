// Page Object cho trang Login
// URL: https://the-internet.herokuapp.com/login

class LoginPage {
  constructor(page) {
    // Lưu reference đến Playwright page object
    this.page = page;

    // Định nghĩa tất cả selectors — giúp dễ maintain khi UI thay đổi
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
    this.flashMessage = page.locator('#flash');
    this.logoutButton = page.locator('a[href="/logout"]');
    this.pageHeading = page.locator('h2');
  }

  // Điều hướng đến trang login
  async goto() {
    await this.page.goto('/login');
  }

  // Thực hiện login với username và password
  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  // Lấy nội dung của flash message (thông báo thành công hoặc lỗi)
  async getFlashMessage() {
    await this.flashMessage.waitFor({ state: 'visible' });
    return await this.flashMessage.innerText();
  }

  // Kiểm tra xem đã login thành công chưa (dựa vào URL)
  async isLoggedIn() {
    return this.page.url().includes('/secure');
  }

  // Logout
  async logout() {
    await this.logoutButton.click();
  }
}

module.exports = { LoginPage };