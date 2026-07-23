// Test suite cho tính năng Checkboxes
// Target: https://the-internet.herokuapp.com/checkboxes

const { test, expect } = require('@playwright/test');
const { CheckboxesPage } = require('../pages/CheckboxesPage');

test.describe('Checkboxes Feature', () => {
  let checkboxesPage;

  test.beforeEach(async ({ page }) => {
    checkboxesPage = new CheckboxesPage(page);
    await checkboxesPage.goto();
  });

  test('TC04 — Verify trạng thái mặc định của checkboxes', async () => {
    // Theo spec của trang demo:
    // Checkbox 1 (index 0): unchecked
    // Checkbox 2 (index 1): checked
    const cb1Checked = await checkboxesPage.isChecked(checkboxesPage.checkbox1);
    const cb2Checked = await checkboxesPage.isChecked(checkboxesPage.checkbox2);
    
    expect(cb1Checked).toBe(false);  // Checkbox 1 mặc định unchecked
    expect(cb2Checked).toBe(true);   // Checkbox 2 mặc định checked
  });

  test('TC05 — Check checkbox 1 thành công', async () => {
    // Checkbox 1 mặc định unchecked — check nó
    await checkboxesPage.check(checkboxesPage.checkbox1);
    
    // Verify đã được check
    const isChecked = await checkboxesPage.isChecked(checkboxesPage.checkbox1);
    expect(isChecked).toBe(true);
  });

  test('TC06 — Uncheck checkbox 2 thành công', async () => {
    // Checkbox 2 mặc định checked — uncheck nó
    await checkboxesPage.uncheck(checkboxesPage.checkbox2);
    
    // Verify đã được uncheck
    const isChecked = await checkboxesPage.isChecked(checkboxesPage.checkbox2);
    expect(isChecked).toBe(false);
  });

  test('TC15 — Tick checkbox 1 rồi untick', async () => {
    // Bước 1: Tick checkbox 1
    await checkboxesPage.check(checkboxesPage.checkbox1);
    let isChecked = await checkboxesPage.isChecked(checkboxesPage.checkbox1);
    expect(isChecked).toBe(true);

    // Bước 2: Untick checkbox 1
    await checkboxesPage.uncheck(checkboxesPage.checkbox1);
    isChecked = await checkboxesPage.isChecked(checkboxesPage.checkbox1);
    expect(isChecked).toBe(false);
  });

  test('TC16 — Uncheck checkbox 2 rồi check lại', async () => {
    // Bước 1: Uncheck checkbox 2
    await checkboxesPage.uncheck(checkboxesPage.checkbox2);
    let isChecked = await checkboxesPage.isChecked(checkboxesPage.checkbox2);
    expect(isChecked).toBe(false);

    // Bước 2: Check lại checkbox 2
    await checkboxesPage.check(checkboxesPage.checkbox2);
    isChecked = await checkboxesPage.isChecked(checkboxesPage.checkbox2);
    expect(isChecked).toBe(true);
  });
});