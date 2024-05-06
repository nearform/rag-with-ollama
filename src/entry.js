import path from 'path'
import { OllamaEmbeddings } from '@langchain/community/embeddings/ollama'
import { ChatOllama } from '@langchain/community/chat_models/ollama'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'
import { pull } from 'langchain/hub'
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { createRetrievalChain } from 'langchain/chains/retrieval'
import { PPTXLoader } from 'langchain/document_loaders/fs/pptx'

const ollamaModel = 'llama3'
const ollamaLlm = new ChatOllama({ model: ollamaModel })
const ollamaEmbeddings = new OllamaEmbeddings({ model: ollamaModel })

// Asking the question without RAG
const withoutRagResponse = await ollamaLlm.invoke(
  'What fonts are used by Nearform?'
)

console.log(withoutRagResponse.content)

// Computing file path
const filePath = path.join(
  path.resolve(),
  '/sources/Nearform New Brand Playbook _ 2024.pptx'
)
// Initializating langchain textloader
const textLoader = new PPTXLoader(filePath)
// Using langchain to extrapolate documents from txt file
const loadedDocuments = await textLoader.load()

// Initializating a splitter
const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 2000,
  chunkOverlap: 0
})
// Split the documents into smaller ones
const splitDocuments = await textSplitter.splitDocuments(loadedDocuments)

// Storing the split documents using embeddings into a in-memory vector store
const vectorStore = await MemoryVectorStore.fromDocuments(
  splitDocuments,
  ollamaEmbeddings
)
// Defining a retriever based on the in-memory vector store
const vectorStoreRetriever = vectorStore.asRetriever()

// Defining a prompt using a pre-defined one from LangChain Hub
const ragPrompt = await pull('langchain-ai/retrieval-qa-chat')

// Defining a stuff documents chain
const ragChain = await createStuffDocumentsChain({
  llm: ollamaLlm,
  prompt: ragPrompt
})
// Defining a retrieval chain
const retrievalChain = await createRetrievalChain({
  retriever: vectorStoreRetriever,
  combineDocsChain: ragChain
})

// Asking the question
const withRagResponse = await retrievalChain.invoke({
  input: 'What fonts are used by Nearform?'
})

console.log(withRagResponse.answer)
