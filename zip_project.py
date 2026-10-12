import os
import zipfile

def zip_project(source_dir, output_path):
    with zipfile.ZipFile(output_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(source_dir):
            # Exclude node_modules and .git
            dirs[:] = [d for d in dirs if d not in ('node_modules', '.git')]
            for file in files:
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, source_dir)
                zipf.write(file_path, arcname)

source_dir = r'C:\Users\surface\.gemini\antigravity\scratch\tuvi'
output_path = r'C:\Users\surface\.gemini\antigravity\brain\ffce7b33-c355-4ae9-af16-8a9f36d485f0\dangnam1010.zip'

print(f"Creating zip file at {output_path}...")
zip_project(source_dir, output_path)
print("Done!")
