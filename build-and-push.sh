#!/bin/bash

# Color codes for echo
RED='\033[0;31m'
GREEN='\033[0;32m'
VIOLET='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Functions for printing messages in different colors
print_info() {
    echo -e "${CYAN}$1${NC}"
}

print_error() {
    echo -e "${RED}Error: $1${NC}"
}

print_success() {
    echo -e "${GREEN}$1${NC}"
}

print_violet() {
    echo -e "${VIOLET}$1${NC}"
}

# Ensure the repository name is provided as a command-line argument
if [ $# -eq 0 ]; then
    print_error "Error: Repository name not provided."
    print_success "Usage: $0 <repository_name>"
    exit 1
fi

# Store the repository name passed as the first argument
PARAM_GITHUB_REPO_NAME=$1

# Update the value of GITHUB_REPO_NAME in the .env file
if [[ "$(uname)" == "Darwin" ]]; then
    # macOS
    sed -i '' "s|^GITHUB_REPO_NAME=.*|GITHUB_REPO_NAME=\"$PARAM_GITHUB_REPO_NAME\"|" .env
else
    # Linux
    sed -i "s|^GITHUB_REPO_NAME=.*|GITHUB_REPO_NAME=\"$PARAM_GITHUB_REPO_NAME\"|" .env
fi

# Source the .env file to apply the changes
source .env

# Echo the updated value of GITHUB_REPO_NAME
echo "Updated GITHUB_REPO_NAME: $GITHUB_REPO_NAME"

# Check if the repository name is provided
if [ -z "$GITHUB_REPO_NAME" ]; then
    print_error "Repository name cannot be empty."
    exit 1
fi

# Set up variables
PARENT_DIR=$(dirname "$(pwd)")
GITHUB_USERNAME="LiaqatSaeed"
GITHUB_EMAIL="liaqatsaeed007@gmail.com"
GITHUB_NAME="Liaqat Saeed"
GITHUB_ORG_NAME="Online-Free-CV"
DESTINATION_DIR="$PARENT_DIR/$GITHUB_REPO_NAME"

print_info "Setting up local environment..."

# Create a new directory for your local repository
mkdir -p "$DESTINATION_DIR" || { print_error "Failed to create directory for local repository."; exit 1; }
print_success "Directory created successfully: $DESTINATION_DIR"

# Step 1: Install PNPM
print_info "Installing PNPM..."
npm install -g pnpm || { print_error "Failed to install PNPM."; exit 1; }
print_success "PNPM installed successfully."

# Step 2: Build the Next.js project in the source repository
print_info "Building Next.js project..."
pnpm install --no-frozen-lockfile || { print_error "Failed to install dependencies."; exit 1; }
pnpm run build || { print_error "Failed to build Next.js project."; exit 1; }
print_success "Next.js project built successfully."

# Read the personal access token from the .env file
source .env
TOKEN_GITHUB="$GITHUB_TOKEN"

# Check if the repository already exists on GitHub
repo_exists_response=$(curl -s -o /dev/null -w "%{http_code}" -H "Authorization: token $TOKEN_GITHUB" -H "Accept: application/vnd.github.v3+json" https://api.github.com/repos/"$GITHUB_ORG_NAME"/"$GITHUB_REPO_NAME")

if [ "$repo_exists_response" -eq 200 ]; then
    print_success "Repository already exists on GitHub."
else
    print_info "Repository does not exist on GitHub. Creating..."
    create_repo_response=$(curl -s -X POST -H "Authorization: token $TOKEN_GITHUB" -H "Accept: application/vnd.github.v3+json" https://api.github.com/orgs/"$GITHUB_ORG_NAME"/repos -d "{\"name\":\"$GITHUB_REPO_NAME\"}")
    if [ $? -ne 0 ]; then
        print_error "Failed to create repository on GitHub."
        exit 1
    fi
    if [ "$(echo "$create_repo_response" | jq -r '.id')" == "null" ]; then
        print_error "Failed to create repository on GitHub. Please check your GitHub credentials and try again."
        exit 1
    fi
    print_success "Repository created successfully."
fi

print_info "Copying files to the destination repository... $DESTINATION_DIR"
# Copy the build folder contents to the destination directory
cp -r "./build/." "$DESTINATION_DIR"
if [ $? -ne 0 ]; then
    print_error "Failed to copy files to destination repository."
    exit 1
fi
print_success "Files successfully copied to destination folder"

# Check if .nojekyll file exists, if not, create it
if [ ! -f "$DESTINATION_DIR/.nojekyll" ]; then
    print_info ".nojekyll file not found. Creating..."
    touch "$DESTINATION_DIR/.nojekyll"
    if [ $? -ne 0 ]; then
        print_error "Failed to create .nojekyll file."
        exit 1
    fi
    print_success ".nojekyll file created successfully."
else
    print_info ".nojekyll file already exists."
fi

# Change directory into the newly created repository
cd "$DESTINATION_DIR" || { print_error "Failed to change directory to $DESTINATION_DIR"; exit 1; }

print_info "Now in directory: $(pwd)"
# List all files in this repository
ls -a

# Add README file, commit, and push to origin repository
echo "# $GITHUB_REPO_NAME" >> README.md
git init || { print_error "Failed to initialize Git repository."; exit 1; }
git config init.defaultBranch main  # Set default branch to 'main'
git config user.email "$GITHUB_EMAIL"
git config user.name "$GITHUB_NAME"
git add . || { print_error "Failed to add README.md to Git."; exit 1; }
git commit -m "Initial commit" || { print_error "Failed to commit changes."; exit 1; }
git branch -M gh-pages
git remote add origin https://github.com/$GITHUB_ORG_NAME/$GITHUB_REPO_NAME.git
git push -u origin gh-pages

print_success "README file added, committed, and pushed to origin repository."
