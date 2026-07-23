// Test suite cho tính năng Drag and Drop
// Target: https://the-internet.herokuapp.com/drag_and_drop

const { test, expect } = require('@playwright/test');
const { DragAndDropPage } = require('../pages/DragAndDropPage');

test.describe('Drag and Drop Feature', () => {
  let dragDropPage;

  test.beforeEach(async ({ page }) => {
    dragDropPage = new DragAndDropPage(page);
    await dragDropPage.goto();
  });

  test('TC11 — Drag column A sang column B và verify vị trí hoán đổi', async () => {
    // Verify trạng thái ban đầu: A ở trái, B ở phải
    const initialA = await dragDropPage.getColumnAText();
    const initialB = await dragDropPage.getColumnBText();
    expect(initialA).toBe('A');
    expect(initialB).toBe('B');

    // Thực hiện drag bằng mouse simulation
    // Dùng dragAToBWithMouse() vì HTML5 drag API không tương thích tốt với dragTo()
    await dragDropPage.dragAToBWithMouse();

    // Verify sau khi drag: vị trí đã hoán đổi
    // Column A bây giờ hiển thị "B", column B hiển thị "A"
    const afterDragA = await dragDropPage.getColumnAText();
    const afterDragB = await dragDropPage.getColumnBText();
    
    // Lưu ý: Trang này có behavior không nhất quán trên một số browser
    // Nếu test fail, thử chạy lại — trang demo đôi khi bị lag
    expect(afterDragA).toBe('B');
    expect(afterDragB).toBe('A');
  });

  test('TC12 — Drag column B sang column A và verify vị trí hoán đổi', async () => {
    const initialA = await dragDropPage.getColumnAText();
    const initialB = await dragDropPage.getColumnBText();
    expect(initialA).toBe('A');
    expect(initialB).toBe('B');

    await dragDropPage.dragBToAWithMouse();

    const afterDragA = await dragDropPage.getColumnAText();
    const afterDragB = await dragDropPage.getColumnBText();

    expect(afterDragA).toBe('B');
    expect(afterDragB).toBe('A');
  });
});