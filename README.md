# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/2e86b18c-d088-4661-b139-289dcfcfea24

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/2e86b18c-d088-4661-b139-289dcfcfea24) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

**Frontend:**
- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

**Backend:**
- FastAPI (Python)
- Ollama (Local LLM)

## How to Run (Full Stack)

### 1. Start Ollama

```bash
# Pull the model (first time only)
ollama pull llama3.1

# Make sure Ollama server is running
ollama serve
```

### 2. Start the Backend

```bash
# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the backend server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Start the Frontend

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

### 4. Test the Chat

1. Open http://localhost:5173 in your browser
2. Type a question like "Hello, who are you?"
3. You should see a response from the Ollama model

See `backend-README.md` for detailed backend documentation.

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/2e86b18c-d088-4661-b139-289dcfcfea24) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
