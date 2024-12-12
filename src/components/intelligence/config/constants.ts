import { MemoryOption, ChainTypeOption, EmbeddingModel, AITool } from "@/types/ai";

export const MEMORY_OPTIONS: MemoryOption[] = [
  {
    id: "buffer",
    name: "Buffer Simples",
    description: "Armazena todas as mensagens na ordem"
  },
  {
    id: "window",
    name: "Janela de Contexto",
    description: "Mantém apenas as últimas N mensagens"
  },
  {
    id: "summary",
    name: "Sumário",
    description: "Mantém um resumo da conversa"
  }
];

export const CHAIN_TYPES: ChainTypeOption[] = [
  {
    id: "conversation",
    name: "Conversação",
    description: "Chain básica para diálogo"
  },
  {
    id: "qa",
    name: "Perguntas e Respostas",
    description: "Especializada em responder perguntas com base em documentos"
  },
  {
    id: "conversational_qa",
    name: "QA Conversacional",
    description: "Combina conversa com consulta a documentos"
  }
];

export const EMBEDDING_MODELS: EmbeddingModel[] = [
  {
    id: "openai",
    name: "OpenAI",
    description: "Modelo de embedding da OpenAI"
  },
  {
    id: "cohere",
    name: "Cohere",
    description: "Modelo de embedding da Cohere"
  }
];

export const SEARCH_TYPES = [
  {
    id: "similarity",
    name: "Similaridade",
    description: "Busca por similaridade coseno"
  },
  {
    id: "mmr",
    name: "MMR",
    description: "Maximum Marginal Relevance"
  }
];

export const AI_TOOLS: AITool[] = [
  {
    id: "web_search",
    name: "Busca Web",
    description: "Permite que o agente faça buscas na internet",
    category: "search"
  },
  {
    id: "calculator",
    name: "Calculadora",
    description: "Permite que o agente faça cálculos complexos",
    category: "math"
  },
  {
    id: "code_interpreter",
    name: "Interpretador de Código",
    description: "Permite que o agente execute e analise código",
    category: "development"
  },
  {
    id: "image_analysis",
    name: "Análise de Imagem",
    description: "Permite que o agente analise imagens",
    category: "vision"
  }
];