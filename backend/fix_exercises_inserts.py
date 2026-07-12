import re

file_path = 'c:\\Project\\LMS Toeic\\backend\\src\\main\\resources\\db\\migration\\V3__consolidated_course_data.sql'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the column list
content = content.replace(
    'INSERT IGNORE INTO exercises (topic_id, title, description, total_questions, order_index, is_active, exercise_type)',
    'INSERT IGNORE INTO exercises (topic_id, total_questions, order_index, is_active, exercise_type)'
)

# Replace the VALUES tuples
# We look for VALUES (@topic_id..., '...', '...', ...)
# Since some strings might contain escaped quotes or commas, it's safer to just match string literals properly
# But looking at the data, it's simple strings like 'Bài tập Ngữ pháp: Thì'
content = re.sub(
    r"VALUES \((@topic_id[a-zA-Z0-9_]*),\s*'[^']*',\s*'[^']*',\s*(.*?\))",
    r"VALUES (\1, \2",
    content
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
