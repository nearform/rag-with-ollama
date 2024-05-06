![CI](https://github.com/nearform/hub-template/actions/workflows/ci.yml/badge.svg?event=push)

# RAG with Ollama
RAG (Retrieval Augmented Generation) implementation using LangChain and Ollama.

## Requirements
1. Download Ollama from the official [download page](https://ollama.com/download)
2. Install Ollama
3. Open a terminal and type `ollama pull llama3`

<br />

At this point, Ollama should be ready for use. To verify that everything has been set up correctly, you can:
1. Open the web page http://localhost:11434/, which should display `Ollama is running`
2. Execute the command **`ollama list`** in the terminal, which should return the `llama3:latest` record

## Setup & Run
1. Ensure Ollama is up and running
2. Run `npm ci`
3. Run `npm run start`

**Note:** As implemented, the AI-generated text in this example is non-deterministic; therefore, it is possible that the responses you receive may differ from those obtained by others. That said, if implemented well, the RAG algorithm should still consistently demonstrate the difference between a response generated without specific knowledge of the context and one with context-awareness.
