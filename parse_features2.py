import re
import sys

def parse_features(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    tasks = []
    task_id = 1

    i = 0
    while i < len(lines):
        line = lines[i]
        # Look for feature start
        if line.strip().startswith('### Feature'):
            # Extract feature ID from subsequent lines
            feature_id = None
            for j in range(i, min(i+15, len(lines))):
                if '- **Feature ID**:' in lines[j]:
                    match = re.search(r'F\d+', lines[j])
                    if match:
                        feature_id = match.group()
                    break
            if not feature_id:
                i += 1
                continue

            # Initialize section flags
            in_acceptance = False
            in_definition = False
            j = i + 1
            # Process lines until next feature or end of file
            while j < len(lines):
                # Stop if we hit another feature
                if lines[j].strip().startswith('### Feature') and j > i+1:
                    break
                # Check for section headers
                if '- **Acceptance Criteria**:' in lines[j]:
                    in_acceptance = True
                    in_definition = False
                    j += 1
                    continue
                if '- **Definition of Done**:' in lines[j]:
                    in_acceptance = False
                    in_definition = True
                    j += 1
                    continue
                # If we are in a section, look for bullet points
                if in_acceptance or in_definition:
                    stripped = lines[j].lstrip()
                    # Check if it's a bullet point (starts with '- ' after whitespace)
                    if stripped.startswith('- '):
                        content = stripped[2:].strip()  # Remove '- ' and strip
                        if content:  # ignore empty
                            if in_acceptance:
                                tasks.append({
                                    'id': f'T{task_id:03d}',
                                    'parent_feature': feature_id,
                                    'description': content,
                                    'type': 'acceptance'
                                })
                            else:
                                tasks.append({
                                    'id': f'T{task_id:03d}',
                                    'parent_feature': feature_id,
                                    'description': content,
                                    'type': 'definition'
                                })
                            task_id += 1
                    # If we hit another section header (starting with '- **'), break out of current section
                    elif stripped.startswith('- **') and ':**' in stripped:
                        # This is another section like '- **Dependencies**:'
                        in_acceptance = False
                        in_definition = False
                j += 1
            i = j
        else:
            i += 1
    return tasks

def escape_md(text):
    # Escape pipe and newline for markdown table
    text = text.replace('|', '\\|')
    text = text.replace('\n', ' ')
    return text

if __name__ == '__main__':
    tasks = parse_features('knowledge_base/project/FEATURES.md')
    out_file = 'knowledge_base/project/TASKS.md'
    with open(out_file, 'w', encoding='utf-8') as f:
        # Write header
        f.write('| Task ID | Parent feature | Task description | Priority | Estimated effort | Dependencies | Files to create | Files to modify | Database changes | API changes | Frontend changes | Testing requirements | Documentation updates | Acceptance criteria | Status |\n')
        f.write('|---------|----------------|------------------|----------|------------------|--------------|-----------------|-----------------|------------------|-------------|------------------|----------------------|-----------------------|---------------------|--------|\n')
        for t in tasks:
            parent = t['parent_feature']
            # Determine priority based on epic (first digit after F)
            if len(parent) >= 2:
                epic_num = parent[1]
            else:
                epic_num = '0'
            if epic_num in ['0', '1']:
                priority = 'High'
            elif epic_num in ['2', '3', '4', '7']:
                priority = 'Medium'
            else:
                priority = 'Low'
            effort = 4  # default hours
            deps = ''
            files_create = 'TBD'
            files_modify = 'TBD'
            db_changes = ''
            api_changes = ''
            frontend_changes = ''
            testing = ''
            doc_updates = ''
            acc_criteria = t['description']
            status = 'To Do'
            # Escape fields
            desc_escaped = escape_md(t['description'])
            acc_escaped = escape_md(acc_criteria)
            f.write(f"| {t['id']} | {parent} | {desc_escaped} | {priority} | {effort} | {deps} | {files_create} | {files_modify} | {db_changes} | {api_changes} | {frontend_changes} | {testing} | {doc_updates} | {acc_escaped} | {status} |\n")
    print(f'Generated {len(tasks)} tasks in {out_file}')