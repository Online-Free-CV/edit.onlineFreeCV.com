#!/bin/bash

# Color codes for echo
RED='\033[0;31m'
GREEN='\033[0;32m'
VIOLET='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print info message
print_info() {
    echo -e "${CYAN}$1${NC}"
}

# Function to print error message
print_error() {
    echo -e "${RED}Error: $1${NC}" >&2
}

# Function to print success message
print_success() {
    echo -e "${GREEN}$1${NC}"
}

# Access the JSON string argument passed to the script
CLIENT_PAYLOAD_JSON=$1

# Get the directory path of the script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Path to the data.json file
DATA_JSON_FILE="$SCRIPT_DIR/src/public/data.json"

# Echo the current content of data.json (if it exists)
print_info "Current content of data.json:"
if [ -f "$DATA_JSON_FILE" ]; then
    cat "$DATA_JSON_FILE"
else
    print_info "data.json does not exist or is empty."
fi

# Overwrite the content of data.json with the new JSON payload
echo "$CLIENT_PAYLOAD_JSON" > "$DATA_JSON_FILE"

# Check if the write operation was successful
if [ $? -eq 0 ]; then
    print_success "JSON payload successfully overwritten in data.json"
else
    print_error "Failed to overwrite JSON payload in data.json"
fi

# Echo the updated content of data.json
print_info "Updated content of data.json:"
cat "$DATA_JSON_FILE"

# Retrieve the value of "website_name" from data.json
PARAM_GITHUB_REPO_NAME=$(sed -n 's/.*"website_name": "\(.*\)".*/\1/p' "$DATA_JSON_FILE")

print_success "wEbsite name is: $PARAM_GITHUB_REPO_NAME"

# Update the value of GITHUB_REPO_NAME in the .env file
if [[ "$(uname)" == "Darwin" ]]; then
    # macOS
    sed -i '' "s|^GITHUB_REPO_NAME=.*|GITHUB_REPO_NAME=\"$PARAM_GITHUB_REPO_NAME\"|" .env || { print_error "Failed to update .env file"; exit 1; }
else
    # Linux
    sed -i "s|^GITHUB_REPO_NAME=.*|GITHUB_REPO_NAME=\"$PARAM_GITHUB_REPO_NAME\"|" .env || { print_error "Failed to update .env file"; exit 1; }
fi

# Source the .env file to apply the changes
source .env || { print_error "Failed to source .env file"; exit 1; }

# Echo the updated value of GITHUB_REPO_NAME
print_success "Updated GITHUB_REPO_NAME: $GITHUB_REPO_NAME"

# Check if the repository name is provided
if [ -z "$GITHUB_REPO_NAME" ]; then
    print_error "Repository name cannot be empty."
    exit 1
fi

# Set up variables
# Determine the parent directory based on the operating system
print_info "Setting up local environment..."

if [[ "$(uname)" == "Darwin" ]]; then
    # macOS
    PARENT_DIR="$(dirname "$(pwd)")"
else
    # Other operating systems
    PARENT_DIR="/__w"
fi
CURRENT_DIR=$(pwd)
GITHUB_USERNAME="LiaqatSaeed"
GITHUB_ORG_NAME="Online-Free-CV"
DESTINATION_DIR="$PARENT_DIR/$GITHUB_REPO_NAME"

# Write the JSON payload to a file
echo "$CLIENT_PAYLOAD_JSON" >  $CURRENT_DIR/src/public/data.json

print_success "JSON payload written to src/public/data.json"

# Step 1: Build the Next.js project in the source repository
print_info "Building Next.js project..."
if ! pnpm install --no-frozen-lockfile || ! pnpm run build; then
    print_error "Failed to build Next.js project."
    exit 1
fi
print_success "Next.js project built successfully."

# Read the personal access token from the .env file
source .env
TOKEN_GITHUB="$GITHUB_TOKEN"

# Check if the repository already exists on GitHub
repo_exists_response=$(curl -s -o /dev/null -w "%{http_code}" -H "Authorization: token $TOKEN_GITHUB" -H "Accept: application/vnd.github.v3+json" "https://api.github.com/repos/$GITHUB_ORG_NAME/$GITHUB_REPO_NAME")

if [ "$repo_exists_response" -eq 200 ]; then
    print_success "Repository already exists on GitHub."
else
    print_info "Repository does not exist on GitHub. Creating..."
    create_repo_response=$(curl -s -X POST -H "Authorization: token $TOKEN_GITHUB" -H "Accept: application/vnd.github.v3+json" "https://api.github.com/orgs/$GITHUB_ORG_NAME/repos" -d "{\"name\":\"$GITHUB_REPO_NAME\",\"auto_init\":true,\"private\":false}")
    if [ $? -ne 0 ] || [ "$(echo "$create_repo_response" | jq -r '.id')" == "null" ]; then
        print_error "Failed to create repository on GitHub. Please check your GitHub credentials and try again."
        exit 1
    fi
    print_success "Repository created successfully."
fi

# Clone the newly created repository
print_info "Cloning the repository..."
if git clone "https://github.com/$GITHUB_ORG_NAME/$GITHUB_REPO_NAME.git" "$DESTINATION_DIR"; then
    print_success "Repository cloned successfully."

    print_info "Copying files to the destination repository..."
    # Copy the build folder contents to the destination directory
    cp -r "$CURRENT_DIR/build/." "$DESTINATION_DIR"

    print_success "Files successfully copied to destination folder"

    # Check if .nojekyll file exists, if not, create it
    if [ ! -f "$DESTINATION_DIR/.nojekyll" ]; then
        print_info ".nojekyll file not found. Creating..."
        touch "$DESTINATION_DIR/.nojekyll"
        print_success ".nojekyll file created successfully."
    else
        print_info ".nojekyll file already exists."
    fi

    # Create a CNAME file
    print_info "Creating CNAME file..."
    handle=$(echo "$CLIENT_PAYLOAD_JSON" | jq -r '.website_name')
    if [ -z "$handle" ]; then
        print_error "Failed to create CNAME file. Handle cannot be empty."
        exit 1
    fi
    echo "$handle.onlinefreecv.com" > "$DESTINATION_DIR/CNAME"
    print_success "CNAME file created successfully."

    # Change directory to the destination directory
    cd "$DESTINATION_DIR" || { print_error "Failed to change directory."; exit 1; }
    print_success "Changed directory to: $DESTINATION_DIR"

    # List all the contents of this folder
    ls 

    # Initialize git repository only if it doesn't exist
    if [ ! -d ".git" ]; then
        print_info "Initializing git repository..."
        git init
        git add .
        git commit -m "first commit"
        git branch -M main
        git remote add origin "https://github.com/$GITHUB_ORG_NAME/$GITHUB_REPO_NAME.git"
        git config --global credential.helper store
        git push -u origin main || { print_error "Failed to push to GitHub repository"; exit 1; }
        print_success "Git commands executed successfully."
    else
        print_info "Git repository already exists in the directory. Skipping initialization."
        git checkout -b gh-pages || { print_error "Failed to checkout new branch"; exit 1; }

        # Set your Git identity
        git config --global credential.helper store  || { print_error "Failed to set credential helper"; exit 1; }
        git config --global user.email "liaqatsaeed007@gmail.com" || { print_error "Failed to set user email"; exit 1; }
        git config --global user.name "Liaqat Saeed" || { print_error "Failed to set username"; exit 1; }

        git add . || { print_error "Failed to stage changes"; exit 1; }
        git commit -m "Portfolio website" || { print_error "Failed to commit changes"; exit 1; }
        git push -u "https://$TOKEN_GITHUB@github.com/$GITHUB_ORG_NAME/$GITHUB_REPO_NAME.git" gh-pages || { print_error "Failed to push to GitHub repository"; exit 1; }

        print_success "Git commands executed successfully."

    fi
else
    print_error "Failed to clone the repository."
    exit 1
fi

print_success "Repo Successfully created and pushed to origin."

