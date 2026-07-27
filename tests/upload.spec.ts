// Test suite cho tính năng File Upload
// Target: https://the-internet.herokuapp.com/upload

const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');
const { FileUploadPage } = require('../pages/FileUploadPage');

test.describe('File Upload Feature', () => {
  let uploadPage;
  // Đường dẫn đến file test — dùng path.resolve để tránh vấn đề OS path
  const testFilePath = path.resolve(__dirname, '../test-data/sample-upload.txt');

  test.beforeAll(async () => {
    // Tạo file test-data nếu chưa tồn tại
    const testDataDir = path.resolve(__dirname, '../test-data');
    if (!fs.existsSync(testDataDir)) {
      fs.mkdirSync(testDataDir, { recursive: true });
    }
    if (!fs.existsSync(testFilePath)) {
      fs.writeFileSync(testFilePath, 'Đây là file test cho Playwright automation.');
    }
  });

  test.beforeEach(async ({ page }) => {
    uploadPage = new FileUploadPage(page);
    await uploadPage.goto();
  });

  test('TC09 — Upload file thành công', async () => {
    // Upload file đã chuẩn bị
    await uploadPage.uploadFile(testFilePath);
    
    // Verify trang hiện thị "File Uploaded!"
    const isSuccess = await uploadPage.isUploadSuccessful();
    expect(isSuccess).toBe(true);
  });

  test('TC10 — Verify tên file được hiển thị sau khi upload', async () => {
    // Upload file
    await uploadPage.uploadFile(testFilePath);
    
    // Lấy tên file được hiển thị
    const uploadedFileName = await uploadPage.getUploadedFileName();
    
    // Verify tên file khớp với file đã upload
    expect(uploadedFileName).toContain('sample-upload.txt');
  });

  test.skip('TC13 — Click upload mà không chọn file', async ({ page }) => {
    // Click upload ngay mà không chọn file
    await uploadPage.clickUploadWithoutFile();

    // Verify vẫn ở trang upload
    await expect(page).toHaveURL(/.*upload/);

    // Verify hiển thị message cảnh báo
    const pageMessage = await uploadPage.getPageMessage();
    expect(pageMessage).toContain('Choose file before click upload');
  });
});