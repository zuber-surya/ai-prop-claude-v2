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
            # Look ahead a few lines for the Feature ID
            for j in range(i, min(i+10, len(lines))):
                if '- **Feature ID**:' in lines[j]:
                    match = re.search(r'F\d+', lines[j])
                    if match:
                        feature_id = match.group()
                    break
            if not feature_id:
                i += 1
                continue

            # Now find Acceptance Criteria and Definition of Done sections
            # We'll search from current line to next feature or end
            j = i
            in_acceptance = False
            in_definition = False
            acceptance_lines = []
            definition_lines = []
            while j < len(lines):
                # Stop if we hit another feature
                if lines[j].strip().startswith('### Feature') and j > i:
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
                # If we are in a section, collect bullet points
                if in_acceptance or in_definition:
                    # Check if line is a bullet point (starts with whitespace and then '- ')
                    stripped = lines[j].lstrip()
                    if stripped.startswith('- ') and not stripped.startswith('--'):
                        # This is a bullet point
                        content = stripped[2:].strip()  # Remove '- ' and strip
                        if in_acceptance:
                            acceptance_lines.append(content)
                        else:
                            definition_lines.append(content)
                    else:
                        # If line is not a bullet and not empty, we might have left the section
                        # But we'll continue until we hit another section or feature
                        # For simplicity, we'll break if line is not empty and not a bullet?
                        # Instead, we'll just continue and rely on section headers to toggle.
                        pass
                j += 1

            # Create tasks for acceptance criteria
            for desc in acceptance_lines:
                tasks.append({
                    'id': f'T{task_id:03d}',
                    'parent_feature': feature_id,
                    'description': desc,
                    'type': 'acceptance'
                })
                task_id += 1
            # Create tasks for definition of done
            for desc in definition_lines:
                tasks.append({
                    'id': f'T{task_id:03d}',
                    'parent_feature': feature_id,
                    'description': desc,
                    'type': 'definition'
                })
                task_id += 1

            i = j
        else:
            i += 1

    return tasks

if __name__ == '__main__':
    tasks = parse_features('knowledge_base/project/FEATURES.md')
    # Print as markdown table
    print('| Task ID | Parent feature | Task description | Priority | Estimated effort | Dependencies | Files to create | Files to modify | Database changes | API changes | Frontend changes | Testing requirements | Documentation updates | Acceptance criteria | Status |')
    print('|---------|----------------|------------------|----------|------------------|--------------|-----------------|-----------------|------------------|-------------|------------------|----------------------|-----------------------|---------------------|--------|')
    for t in tasks:
        # Determine priority based on parent feature epic
        parent = t['parent_feature']
        epic = parent[0]  # F0 -> epic 0, F1 -> epic 1, etc.
        # Actually parent is like F001, F101, etc.
        # Extract the first digit after F
        if len(parent) >= 2:
            epic_num = parent[1]  # second character
        else:
            epic_num = '0'
        # Map epic to priority
        if epic_num in ['0', '1']:
            priority = 'High'
        elif epic_num in ['2', '3', '4', '7']:
            priority = 'Medium'
        else:
            priority = 'Low'

        # Estimated effort: default 4 hours
        effort = 4

        # Dependencies: empty for now
        deps = ''

        # Files to create/modify: placeholder
        files_create = 'TBD'
        files_modify = 'TBD'

        # Database changes: empty
        db_changes = ''
        api_changes = ''
        frontend_changes = ''

        # Testing requirements: empty
        testing = ''
        # Documentation updates: empty
        doc_updates = ''

        # Acceptance criteria: the description itself
        acc_criteria = t['description']

        status = 'To Do'

        # Escape any pipe characters in description
        desc_escaped = t['description'].replace('|', '\\|')
        acc_criteria_escaped = acc_criteria.replace('|', '\\|')

        print(f"| {t['id']} | {parent} | {desc_escaped} | {priority} | {effort} | {deps} | {files_create} | {files_modify} | {db_changes} | {api_changes} | {frontend_changes} | {testing} | {doc_updates} | {acc_criteria_escaped} | {status} |")