import os

file_path = 'c:\\Project\\LMS Toeic\\backend\\src\\main\\resources\\db\\migration\\V3__consolidated_course_data.sql'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add SET FOREIGN_KEY_CHECKS=0; at the beginning
if 'SET FOREIGN_KEY_CHECKS=0;' not in content:
    content = 'SET FOREIGN_KEY_CHECKS=0;\n' + content

# Add SET FOREIGN_KEY_CHECKS=1; at the end
if 'SET FOREIGN_KEY_CHECKS=1;' not in content:
    content = content + '\nSET FOREIGN_KEY_CHECKS=1;\n'

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
