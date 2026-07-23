// Page Object cho trang File Upload
// URL: https://the-internet.herokuapp.com/upload

class FileUploadPage {
  constructor(page) {
    this.page = page;

    // Input file ẩn (type="file")
    this.fileInput = page.locator('#file-upload');
    
    // Nút submit để upload
    this.uploadButton = page.locator('#file-submit');
    
    // Hiển thị tên file đã upload (sau khi submit)
    this.uploadedFileName = page.locator('#uploaded-files');
    
    // Tiêu đề trang confirm upload thành công
    this.successHeading = page.locator('h3');
  }

  // Điều hướng đến trang upload
  async goto() {
    await this.page.goto('/upload');
  }

  // Upload file theo đường dẫn tuyệt đối
  async uploadFile(filePath) {
    // setInputFiles cho phép upload file mà không cần mở dialog
    await this.fileInput.setInputFiles(filePath);
    await this.uploadButton.click();
  }

  // Click upload mà không chọn file nào
  async clickUploadWithoutFile() {
    await this.uploadButton.click({ force: true, noWaitAfter: true });
    await this.page.waitForTimeout(1000);
  }

  // Lấy nội dung text hiển thị trên page để verify message
  async getPageMessage() {
    await this.page.locator('body').waitFor({ state: 'visible' });
    return await this.page.locator('body').innerText();
  }

  // Lấy tên file đã upload thành công
  async getUploadedFileName() {
    await this.uploadedFileName.waitFor({ state: 'visible' });
    return await this.uploadedFileName.innerText();
  }

  // Kiểm tra upload có thành công không (dựa vào heading)
  async isUploadSuccessful() {
    const headingCount = await this.successHeading.count();

    if (headingCount === 0) {
      return false;
    }

    const heading = await this.successHeading.innerText();
    return heading.includes('File Uploaded');
  }
}

module.exports = { FileUploadPage };