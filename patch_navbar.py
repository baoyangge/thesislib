import re
import os

files_to_patch = [
    "src/app/[locale]/app/papers/[id]/page.tsx",
    "src/app/[locale]/admin/papers/[id]/edit/page.tsx"
]

nav_block_pattern = r"      {/\* Top Navigation \*/}.*?      </nav>"

for file_path in files_to_patch:
    if not os.path.exists(file_path):
        continue
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    if "import Navbar from" not in content:
        content = content.replace("import { requireUser", "import Navbar from \"@/components/Navbar\";\nimport { requireUser")
        content = re.sub(nav_block_pattern, "      {/* Top Navigation */}\n      <Navbar user={user} />", content, flags=re.DOTALL)
        
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Patched {file_path}")

