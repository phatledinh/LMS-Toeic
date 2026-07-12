import re

with open('c:\\Project\\LMS Toeic\\backend\\src\\main\\resources\\db\\migration\\V3__consolidated_course_data.sql', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace "CREATE TABLE IF NOT EXISTS" back to "CREATE TABLE" so the regex catches it if we had modified it
content = content.replace('CREATE TABLE IF NOT EXISTS', 'CREATE TABLE')

# Remove CREATE TABLE blocks
content = re.sub(r'CREATE TABLE\s+.*?;', '', content, flags=re.IGNORECASE | re.DOTALL)

# Remove ALTER TABLE blocks
content = re.sub(r'ALTER TABLE\s+.*?;', '', content, flags=re.IGNORECASE | re.DOTALL)

# Remove CREATE INDEX blocks
content = re.sub(r'CREATE INDEX\s+.*?;', '', content, flags=re.IGNORECASE | re.DOTALL)

with open('c:\\Project\\LMS Toeic\\backend\\src\\main\\resources\\db\\migration\\V3__consolidated_course_data.sql', 'w', encoding='utf-8') as f:
    f.write(content)
