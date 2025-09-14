# Install
brew install --cask ollama   # macOS

# Start server
ollama serve

# Pull a model
ollama pull llama3.2

# List models
ollama list

# Quick run
ollama run llama3.2 "Hello from Ollama!"

# Test chat API
curl -X POST http://127.0.0.1:11434/api/chat \
  -H "Content-Type: application/json" \
  -d '{"model":"llama3.2","messages":[{"role":"user","content":"hi"}],"stream":false}'

# Test generate API
curl -X POST http://127.0.0.1:11434/api/generate \
  -H "Content-Type: application/json" \
  -d '{"model":"llama3.2","prompt":"Say hi","max_tokens":100}'

# Remove model
ollama rm llama3.2
ollama system prune
