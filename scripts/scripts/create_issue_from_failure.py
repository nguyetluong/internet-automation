# scripts/create_issue_from_failure.py
# Chạy sau khi Playwright test fail trong CI

import json
import os
import subprocess

def parse_playwright_results(results_file: str) -> list[dict]:
    """Đọc test-results.json và trả về danh sách test failures."""
    with open(results_file) as f:
        data = json.load(f)

    failures = []
    
    def traverse_suites(suites):
        """Đệ quy duyệt nested suites structure."""
        for suite in suites:
            # Duyệt specs trực tiếp trong suite
            for spec in suite.get('specs', []):
                for test in spec.get('tests', []):
                    for result in test.get('results', []):
                        if result['status'] == 'failed':
                            failures.append({
                                'title': spec['title'],
                                'file': spec['file'],
                                'error': result.get('error', {}).get('message', ''),
                                'duration': result.get('duration', 0),
                                'browser': test.get('projectName', 'chromium'),
                            })
            
            # Duyệt nested suites
            if 'suites' in suite:
                traverse_suites(suite['suites'])
    
    traverse_suites(data.get('suites', []))
    return failures


def generate_issue_with_claude(failure: dict) -> dict:
    """Tạo GitHub Issue content từ test failure data (không dùng AI)."""
    # Parse error message để lấy thông tin chính
    error_msg = failure['error']
    
    # Tạo title từ test name
    title = f"[Test Failure] {failure['title'][:60]}"
    
    # Tạo body từ test failure info
    body = f"""## 🐛 Test Failure

**Test Name:** {failure['title']}
**File:** {failure['file']}
**Browser:** {failure['browser']}
**Duration:** {failure['duration']}ms

## ❌ Error
```
{error_msg[:500]}
```

## 📌 Details
- **Branch:** {os.environ.get('GITHUB_REF_NAME', 'unknown')}
- **Commit:** {os.environ.get('GITHUB_SHA', 'unknown')[:8]}

## ✅ Next Steps
1. Investigate the failure
2. Fix the test or code
3. Re-run workflow to verify
"""
    
    return {
        "title": title,
        "body": body
    }



def create_github_issue(title: str, body: str, labels: list[str]) -> str:
    """Dùng gh CLI để tạo GitHub Issue. Trả về URL của issue."""
    import re
    import tempfile
    
    # Strip ANSI escape sequences từ body
    ansi_escape = re.compile(r'\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])')
    body_clean = ansi_escape.sub('', body)
    
    # Viết body vào temp file để tránh escaping issues
    with tempfile.NamedTemporaryFile(mode='w', suffix='.md', delete=False) as f:
        f.write(body_clean)
        temp_file = f.name
    
    try:
        label_args = []
        for label in labels:
            label_args.extend(['--label', label])

        result = subprocess.run(
            ['gh', 'issue', 'create',
             '--title', title,
             '--body-file', temp_file,
             *label_args],
            capture_output=True,
            text=True,
            check=True
        )

        # gh trả về URL của issue vừa tạo
        return result.stdout.strip()
    finally:
        # Clean up temp file
        os.unlink(temp_file)



def main():
    results_file = 'test-results.json'

    if not os.path.exists(results_file):
        print("Không tìm thấy test-results.json")
        return

    failures = parse_playwright_results(results_file)

    if not failures:
        print("Không có test failure nào")
        return

    print(f"Tìm thấy {len(failures)} failures. Đang tạo GitHub Issues...")
    created_issues = []

    for failure in failures:
        print(f"  → Xử lý: {failure['title']}")

        # Gọi AI để tạo issue content
        issue_content = generate_issue_with_claude(failure)

        # Tạo issue trên GitHub
        issue_url = create_github_issue(
            title=issue_content['title'],
            body=issue_content['body'],
            labels=['bug', 'automated', 'ci-failure']
        )

        created_issues.append(issue_url)
        print(f"    ✅ Issue created: {issue_url}")

    # In summary
    print(f"\n✅ Đã tạo {len(created_issues)} GitHub Issues:")
    for url in created_issues:
        print(f"  {url}")


if __name__ == '__main__':
    main()