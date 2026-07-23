// Cấu hình chính cho Playwright test suite
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  // Thư mục chứa tất cả test files
  testDir: './tests',

  // Chạy tối đa 2 tests song song để không overload trang demo
  workers: 2,

  // Retry 1 lần nếu test fail (tránh flaky test do network)
  retries: 1,

  // Timeout cho mỗi test: 30 giây
  timeout: 30000,

  // URL gốc — thay vì gõ full URL trong từng test, dùng baseURL
  use: {
    baseURL: 'https://the-internet.herokuapp.com',
    
    // Chụp screenshot khi test FAIL — giúp debug
    screenshot: 'only-on-failure',
    
    // Ghi video khi test FAIL
    video: 'on-first-retry',
    
    // Headless (không mở browser window) — set false để xem khi debug
    headless: true,
    
    // Viewport mặc định
    viewport: { width: 1280, height: 720 },
    
    // Thời gian chờ tối đa cho action (click, fill, v.v.)
    actionTimeout: 10000,
  },

  // Reporter — HTML report đẹp và có thể share
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list']  // Hiển thị kết quả ngay trong terminal
  ],

  // Chỉ chạy trên Chrome (Chromium) cho đơn giản
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});