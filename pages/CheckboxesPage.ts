// Page Object cho trang Checkboxes
// URL: https://the-internet.herokuapp.com/checkboxes

class CheckboxesPage {
  constructor(page) {
    this.page = page;

    // Trang có 2 checkboxes — lấy theo index
    this.checkbox1 = page.locator('input[type="checkbox"]').nth(0); // Checkbox đầu tiên
    this.checkbox2 = page.locator('input[type="checkbox"]').nth(1); // Checkbox thứ hai
  }

  // Điều hướng đến trang checkboxes
  async goto() {
    await this.page.goto('/checkboxes');
  }

  // Kiểm tra trạng thái checkbox (true = checked, false = unchecked)
  async isChecked(checkboxLocator) {
    return await checkboxLocator.isChecked();
  }

  // Check một checkbox (chỉ check nếu chưa được check)
  async check(checkboxLocator) {
    const checked = await checkboxLocator.isChecked();
    if (!checked) {
      await checkboxLocator.click();
    }
  }

  // Uncheck một checkbox (chỉ uncheck nếu đang được check)
  async uncheck(checkboxLocator) {
    const checked = await checkboxLocator.isChecked();
    if (checked) {
      await checkboxLocator.click();
    }
  }
}

module.exports = { CheckboxesPage };