#!/bin/bash
# Quick test script for Ollama setup
# How to Use:
#   brew install jq   <-- OR -->  sudo apt-get install jq 
#   chmod +x test-ollama.sh
#   ./test-ollama.sh llama3.2

MODEL=${1:-llama3.2}
BASE_URL=${OLLAMA_BASE_URL:-http://127.0.0.1:11434}

echo "🔍 Testing Ollama server at $BASE_URL with model: $MODEL"
echo

# Health check
echo "➡️ Checking server health..."
curl -s -i $BASE_URL/ | head -n 5
echo

# List installed models
echo "➡️ Listing installed models..."
ollama list
echo

# Quick CLI test
echo "➡️ Running quick CLI test..."
ollama run $MODEL "Say hi in one sentence." || {
  echo "⚠️ Model not found locally. Try: ollama pull $MODEL"
  exit 1
}
echo

# Test /api/chat
echo "➡️ Testing /api/chat endpoint..."
curl -s -X POST $BASE_URL/api/chat \
  -H "Content-Type: application/json" \
  -d "{
    \"model\": \"$MODEL\",
    \"messages\": [{\"role\":\"user\",\"content\":\"Hello, where should I travel in October?\"}],
    \"stream\": false
  }" | jq .
echo

# Test /api/generate
echo "➡️ Testing /api/generate endpoint..."
curl -s -X POST $BASE_URL/api/generate \
  -H "Content-Type: application/json" \
  -d "{
    \"model\":\"$MODEL\",
    \"prompt\":\"Suggest 3 budget-friendly travel destinations in India.\",
    \"max_tokens\":200
  }" | jq .
echo

echo "✅ Test complete!"


