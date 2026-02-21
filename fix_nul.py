import os
import shutil

path = r"C:\Users\rabit\OneDrive\Desktop\Nextjs Projects\Full Stack ecommerce app -2\classifieds-platform\convex"
nul_file = os.path.join(path, "nul")

print(f"Checking for {nul_file}...")
if os.path.exists(nul_file):
    print("Found it! Attempting to delete...")
    try:
        # On Windows, deleting 'nul' can be tricky.
        # We try standard remove first.
        os.remove(nul_file)
        print("Successfully removed.")
    except Exception as e:
        print(f"Failed to remove normally: {e}")
        try:
            # Try with extended path syntax
            ext_path = "\\\\?\\" + nul_file
            os.remove(ext_path)
            print("Successfully removed with extended path.")
        except Exception as e2:
            print(f"Failed to remove with extended path: {e2}")
else:
    print("Not found via os.path.exists.")

# List all files with their full names to see if any are weirdly named
print("\nListing all files in convex/:")
try:
    for f in os.listdir(path):
        print(f" - {f!r}")
except Exception as e:
    print(f"Error listing directory: {e}")
