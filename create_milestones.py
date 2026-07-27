import os
import json
import urllib.request
import urllib.error

# Configuration
GITHUB_TOKEN = os.environ.get('GITHUB_TOKEN')
if not GITHUB_TOKEN:
    raise ValueError("GITHUB_TOKEN environment variable not set")

REPO_OWNER = "zuber-surya"
REPO_NAME = "ai-prop-claude-v2"
API_BASE_URL = f"https://api.github.com/repos/{REPO_OWNER}/{REPO_NAME}"

def make_request(url, method="GET", data=None, headers=None):
    """Make an HTTP request and return (response_body, status_code, headers)."""
    if headers is None:
        headers = {}
    # Add authorization
    headers["Authorization"] = f"token {GITHUB_TOKEN}"
    headers["Accept"] = "application/vnd.github.v3+json"
    if data is not None and isinstance(data, (dict, list)):
        data = json.dumps(data).encode('utf-8')
        headers["Content-Type"] = "application/json"
    
    req = urllib.request.Request(url, data=data, method=method, headers=headers)
    try:
        with urllib.request.urlopen(req) as response:
            response_body = response.read().decode('utf-8')
            status = response.status
            response_headers = dict(response.getheaders())
            return response_body, status, response_headers
    except urllib.error.HTTPError as e:
        response_body = e.read().decode('utf-8') if e.read() else ''
        status = e.code
        response_headers = dict(e.headers)
        return response_body, status, response_headers
    except urllib.error.URLError as e:
        return str(e), 0, {}

def get_existing_milestones():
    """Fetch all milestones (open and closed) for the repository."""
    url = f"{API_BASE_URL}/milestones?state=all&per_page=100"
    all_milestones = []
    page = 1
    while True:
        paginated_url = f"{url}&page={page}"
        response_body, status, headers = make_request(paginated_url, method="GET")
        if status != 200:
            print(f"Error fetching milestones: {status}")
            print(response_body)
            break
        try:
            data = json.loads(response_body)
        except json.JSONDecodeError:
            print("Failed to parse JSON response")
            print(response_body)
            break
        if not data:
            break
        all_milestones.extend(data)
        # Check if there's another page (GitHub uses Link header)
        link_header = headers.get('Link', '')
        if 'rel="next"' not in link_header:
            break
        page += 1
    return all_milestones

def extract_sections_from_markdown(filepath):
    """Extract sections from a markdown file.
    Returns a list of tuples: (title, content)
    """
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    sections = []
    current_title = None
    current_content = []
    
    for line in lines:
        # Check for header (starting with ## )
        if line.startswith('## '):
            # Save previous section
            if current_title is not None:
                sections.append((current_title, ''.join(current_content).strip()))
            # Start new section
            current_title = line[3:].strip()  # Remove '## ' and strip
            current_content = []
        else:
            if current_title is not None:
                current_content.append(line)
    
    # Don't forget the last section
    if current_title is not None:
        sections.append((current_title, ''.join(current_content).strip()))
    
    return sections

def main():
    # Get existing milestones
    print("Fetching existing milestones...")
    existing_milestones = get_existing_milestones()
    existing_titles = {m['title'] for m in existing_milestones}
    print(f"Found {len(existing_titles)} existing milestones.")
    
    # Read the SPRINT_PLAN.md file
    sprint_plan_path = "knowledge_base/project/SPRINT_PLAN.md"
    if not os.path.exists(sprint_plan_path):
        print(f"Error: File not found: {sprint_plan_path}")
        return
    
    print(f"Reading {sprint_plan_path}...")
    sections = extract_sections_from_markdown(sprint_plan_path)
    
    # We are interested in sections that start with "Phase X: "
    phases = []
    for title, content in sections:
        if title.startswith("Phase ") and ":" in title:
            phases.append((title, content))
    
    print(f"Found {len(phases)} phases in the sprint plan.")
    
    # For each phase, create a milestone if it doesn't exist
    for title, content in phases:
        if title in existing_titles:
            print(f"Milestone '{title}' already exists. Skipping.")
            continue
        
        # Prepare the payload
        # Use the first line of content as description, or the title if content is empty
        description = content.strip().split('\n')[0] if content.strip() else title
        # Limit description to 255 characters (GitHub limit)
        if len(description) > 255:
            description = description[:255]
        
        payload = {
            "title": title,
            "description": description
        }
        data = json.dumps(payload).encode('utf-8')
        
        url = f"{API_BASE_URL}/milestones"
        response_body, status, headers = make_request(url, method="POST", data=data)
        
        if status == 201:
            print(f"Created milestone: {title}")
        else:
            print(f"Failed to create milestone '{title}': {status}")
            print(response_body)

if __name__ == "__main__":
    main()
