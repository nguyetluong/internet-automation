# GitHub Issue

**Title:** [Login Test] Sửa expected URL sau khi đăng nhập thành công

## 🐛 Mô tả lỗi

Playwright test **TC01 — Login thành công với credentials hợp lệ** bị fail tại bước verify URL sau khi đăng nhập. Dựa trên log, ứng dụng đã điều hướng đến `https://the-internet.herokuapp.com/secure`, trong khi test lại mong đợi URL khớp với pattern `/.*secure123/`.

**Phân tích:** Đây **nhiều khả năng là lỗi của test automation** (expected URL sai) thay vì bug của application.

## 🔁 Steps to Reproduce

1. Chạy Playwright test `Login Feature > TC01 — Login thành công với credentials hợp lệ`.
2. Thực hiện đăng nhập.
3. Thực thi:
   `await expect(page).toHaveURL(/.*secure123/);`
4. Quan sát test fail.

## ✅ Expected

Assertion kiểm tra đúng URL mà application điều hướng tới.

## ❌ Actual

- Expected: `/.*secure123/`
- Actual: `https://the-internet.herokuapp.com/secure`

## 🌍 Environment

- Browser: Chromium
- OS: Không có trong CI output
- Test file: `tests/login.spec.ts`
- Commit: Không có trong CI output

## 📸 Evidence

- Screenshot: `test-results\login-Login-Feature-TC01-—-5ac75-công-với-credentials-hợp-lệ-chromium\test-failed-1.png`
- Error Context: `test-results\login-Login-Feature-TC01-—-5ac75-công-với-credentials-hợp-lệ-chromium\error-context.md`
- Trace: Không có trong CI output

## 💥 Impact

**Low** — Khả năng cao là false failure do expected URL trong test script không đúng.

## 🏷️ Labels

- bug
- test-automation
- playwright
- needs-investigation
