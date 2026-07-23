// Page Object cho trang Dropdown
// URL: https://the-internet.herokuapp.com/dropdown

class DropdownPage {
  constructor(page) {
    this.page = page;

    // Dropdown select element
    this.dropdownSelect = page.locator('#dropdown');
  }

  // Điều hướng đến trang dropdown
  async goto() {
    await this.page.goto('/dropdown');
  }

  // Chọn option theo value attribute
  async selectByValue(value) {
    await this.dropdownSelect.selectOption({ value: value });
  }

  // Chọn option theo text hiển thị
  async selectByLabel(label) {
    await this.dropdownSelect.selectOption({ label: label });
  }

  // Lấy text của option đang được chọn
  async getSelectedOption() {
    return await this.dropdownSelect.inputValue();
  }

  // Lấy text hiển thị của option đang được chọn
  async getSelectedOptionText() {
    const selectedValue = await this.dropdownSelect.inputValue();
    // Lấy text của option có value tương ứng
    return await this.dropdownSelect.locator(`option[value="${selectedValue}"]`).innerText();
  }
}

module.exports = { DropdownPage };