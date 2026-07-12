import re

file_path = 'c:\\Project\\LMS Toeic\\backend\\src\\main\\resources\\db\\migration\\V3__consolidated_course_data.sql'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Remove UPDATE exercises SET slug ... lines
content = re.sub(r'UPDATE exercises SET slug.*?;', '', content, flags=re.IGNORECASE)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
