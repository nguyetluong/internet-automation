// Page Object cho trang Drag and Drop
// URL: https://the-internet.herokuapp.com/drag_and_drop

class DragAndDropPage {
  constructor(page) {
    this.page = page;

    // Hai container A và B
    this.columnA = page.locator('#column-a');
    this.columnB = page.locator('#column-b');
    
    // Header bên trong mỗi column
    this.columnAHeader = page.locator('#column-a header');
    this.columnBHeader = page.locator('#column-b header');
  }

  // Điều hướng đến trang drag and drop
  async goto() {
    await this.page.goto('/drag_and_drop');
  }

  // Lấy text của header column A
  async getColumnAText() {
    return await this.columnAHeader.innerText();
  }

  // Lấy text của header column B
  async getColumnBText() {
    return await this.columnBHeader.innerText();
  }

  // Thực hiện drag column A sang column B
  // Lưu ý: the-internet dùng HTML5 drag API khá khó test — dùng dragTo() của Playwright
  async dragAtoB() {
    await this.columnA.dragTo(this.columnB);
  }

  // Thực hiện drag bằng mouse events (fallback nếu dragTo() không hoạt động)
  async dragAToBWithMouse() {
    const sourceBox = await this.columnA.boundingBox();
    const targetBox = await this.columnB.boundingBox();

    // Di chuyển chuột đến giữa element nguồn
    await this.page.mouse.move(
      sourceBox.x + sourceBox.width / 2,
      sourceBox.y + sourceBox.height / 2
    );
    
    // Nhấn giữ chuột trái
    await this.page.mouse.down();
    
    // Chờ một chút để trigger drag event
    await this.page.waitForTimeout(500);
    
    // Di chuyển đến element đích
    await this.page.mouse.move(
      targetBox.x + targetBox.width / 2,
      targetBox.y + targetBox.height / 2,
      { steps: 10 }  // Di chuyển 10 bước nhỏ để simulate drag tốt hơn
    );
    
    // Thả chuột
    await this.page.mouse.up();
    
    // Chờ animation hoàn tất
    await this.page.waitForTimeout(500);
  }

  // Thực hiện drag column B sang column A
  async dragBToAWithMouse() {
    const sourceBox = await this.columnB.boundingBox();
    const targetBox = await this.columnA.boundingBox();

    await this.page.mouse.move(
      sourceBox.x + sourceBox.width / 2,
      sourceBox.y + sourceBox.height / 2
    );

    await this.page.mouse.down();
    await this.page.waitForTimeout(500);

    await this.page.mouse.move(
      targetBox.x + targetBox.width / 2,
      targetBox.y + targetBox.height / 2,
      { steps: 10 }
    );

    await this.page.mouse.up();
    await this.page.waitForTimeout(500);
  }
}

module.exports = { DragAndDropPage };