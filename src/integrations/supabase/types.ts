export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      agent_adjustments: {
        Row: {
          adjustment_type: string
          agent_id: string
          applied_at: string | null
          created_at: string
          id: string
          metrics_snapshot: Json | null
          new_value: Json
          previous_value: Json
          reason: string
        }
        Insert: {
          adjustment_type: string
          agent_id: string
          applied_at?: string | null
          created_at?: string
          id?: string
          metrics_snapshot?: Json | null
          new_value: Json
          previous_value: Json
          reason: string
        }
        Update: {
          adjustment_type?: string
          agent_id?: string
          applied_at?: string | null
          created_at?: string
          id?: string
          metrics_snapshot?: Json | null
          new_value?: Json
          previous_value?: Json
          reason?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_adjustments_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "ai_agents"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_feedback: {
        Row: {
          agent_id: string
          conversation_id: string
          created_at: string
          created_by: string | null
          feedback_text: string | null
          feedback_type: string
          id: string
          message_id: string
          rating: number
        }
        Insert: {
          agent_id: string
          conversation_id: string
          created_at?: string
          created_by?: string | null
          feedback_text?: string | null
          feedback_type: string
          id?: string
          message_id: string
          rating: number
        }
        Update: {
          agent_id?: string
          conversation_id?: string
          created_at?: string
          created_by?: string | null
          feedback_text?: string | null
          feedback_type?: string
          id?: string
          message_id?: string
          rating?: number
        }
        Relationships: [
          {
            foreignKeyName: "agent_feedback_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "ai_agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_feedback_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "ai_conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_feedback_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_feedback_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "ai_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_metrics: {
        Row: {
          agent_id: string
          created_at: string
          id: string
          measured_at: string
          metadata: Json | null
          metric_type: string
          metric_value: number
        }
        Insert: {
          agent_id: string
          created_at?: string
          id?: string
          measured_at?: string
          metadata?: Json | null
          metric_type: string
          metric_value: number
        }
        Update: {
          agent_id?: string
          created_at?: string
          id?: string
          measured_at?: string
          metadata?: Json | null
          metric_type?: string
          metric_value?: number
        }
        Relationships: [
          {
            foreignKeyName: "agent_metrics_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "ai_agents"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_templates: {
        Row: {
          agent_type: Database["public"]["Enums"]["agent_type_enum"]
          configuration: Json | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_public: boolean | null
          name: string
        }
        Insert: {
          agent_type: Database["public"]["Enums"]["agent_type_enum"]
          configuration?: Json | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name: string
        }
        Update: {
          agent_type?: Database["public"]["Enums"]["agent_type_enum"]
          configuration?: Json | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_training_evaluations: {
        Row: {
          category: string | null
          correct_response: string | null
          created_at: string
          created_by: string | null
          feedback: string | null
          id: string
          message_id: string | null
          rating: number
          session_id: string | null
          tags: string[] | null
        }
        Insert: {
          category?: string | null
          correct_response?: string | null
          created_at?: string
          created_by?: string | null
          feedback?: string | null
          id?: string
          message_id?: string | null
          rating: number
          session_id?: string | null
          tags?: string[] | null
        }
        Update: {
          category?: string | null
          correct_response?: string | null
          created_at?: string
          created_by?: string | null
          feedback?: string | null
          id?: string
          message_id?: string | null
          rating?: number
          session_id?: string | null
          tags?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_training_evaluations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_training_evaluations_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "ai_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_training_evaluations_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "agent_training_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_training_sessions: {
        Row: {
          agent_id: string | null
          created_at: string
          created_by: string | null
          id: string
          metrics: Json | null
          score: number | null
          status: string | null
          updated_at: string
        }
        Insert: {
          agent_id?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          metrics?: Json | null
          score?: number | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          agent_id?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          metrics?: Json | null
          score?: number | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_training_sessions_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "ai_agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_training_sessions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_agent_documents: {
        Row: {
          agent_id: string | null
          created_at: string
          created_by: string | null
          document_id: string | null
          id: string
        }
        Insert: {
          agent_id?: string | null
          created_at?: string
          created_by?: string | null
          document_id?: string | null
          id?: string
        }
        Update: {
          agent_id?: string | null
          created_at?: string
          created_by?: string | null
          document_id?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_agent_documents_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "ai_agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_agent_documents_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_agent_documents_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_agent_logs: {
        Row: {
          agent_id: string | null
          configuration: Json | null
          conversation_id: string | null
          created_at: string
          details: string | null
          event_type: string
          id: string
        }
        Insert: {
          agent_id?: string | null
          configuration?: Json | null
          conversation_id?: string | null
          created_at?: string
          details?: string | null
          event_type: string
          id?: string
        }
        Update: {
          agent_id?: string | null
          configuration?: Json | null
          conversation_id?: string | null
          created_at?: string
          details?: string | null
          event_type?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_agent_logs_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "ai_agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_agent_logs_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "ai_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_agents: {
        Row: {
          agent_type: Database["public"]["Enums"]["agent_type_enum"] | null
          auth_token: string | null
          chain_type: Database["public"]["Enums"]["chain_type_enum"]
          chunk_overlap: number
          chunk_size: number
          color: string | null
          connection_status: string | null
          created_at: string
          description: string | null
          embedding_model: string
          external_url: string | null
          icon: string | null
          id: string
          last_tested: string | null
          max_tokens: number
          memory_type: Database["public"]["Enums"]["memory_type_enum"]
          model_id: string
          name: string
          output_format: Database["public"]["Enums"]["output_format_enum"]
          search_threshold: number
          search_type: Database["public"]["Enums"]["search_type_enum"]
          stop_sequences: string[] | null
          system_prompt: string | null
          temperature: number
          template_id: string | null
          tools: string[] | null
          top_k: number
          top_p: number
          updated_at: string
          use_knowledge_base: boolean
          user_id: string
        }
        Insert: {
          agent_type?: Database["public"]["Enums"]["agent_type_enum"] | null
          auth_token?: string | null
          chain_type?: Database["public"]["Enums"]["chain_type_enum"]
          chunk_overlap?: number
          chunk_size?: number
          color?: string | null
          connection_status?: string | null
          created_at?: string
          description?: string | null
          embedding_model?: string
          external_url?: string | null
          icon?: string | null
          id?: string
          last_tested?: string | null
          max_tokens?: number
          memory_type?: Database["public"]["Enums"]["memory_type_enum"]
          model_id: string
          name: string
          output_format?: Database["public"]["Enums"]["output_format_enum"]
          search_threshold?: number
          search_type?: Database["public"]["Enums"]["search_type_enum"]
          stop_sequences?: string[] | null
          system_prompt?: string | null
          temperature?: number
          template_id?: string | null
          tools?: string[] | null
          top_k?: number
          top_p?: number
          updated_at?: string
          use_knowledge_base?: boolean
          user_id: string
        }
        Update: {
          agent_type?: Database["public"]["Enums"]["agent_type_enum"] | null
          auth_token?: string | null
          chain_type?: Database["public"]["Enums"]["chain_type_enum"]
          chunk_overlap?: number
          chunk_size?: number
          color?: string | null
          connection_status?: string | null
          created_at?: string
          description?: string | null
          embedding_model?: string
          external_url?: string | null
          icon?: string | null
          id?: string
          last_tested?: string | null
          max_tokens?: number
          memory_type?: Database["public"]["Enums"]["memory_type_enum"]
          model_id?: string
          name?: string
          output_format?: Database["public"]["Enums"]["output_format_enum"]
          search_threshold?: number
          search_type?: Database["public"]["Enums"]["search_type_enum"]
          stop_sequences?: string[] | null
          system_prompt?: string | null
          temperature?: number
          template_id?: string | null
          tools?: string[] | null
          top_k?: number
          top_p?: number
          updated_at?: string
          use_knowledge_base?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_agents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_conversations: {
        Row: {
          agent_id: string
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          agent_id: string
          created_at?: string
          id?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          agent_id?: string
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_conversations_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "ai_agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_conversations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_memory_buffers: {
        Row: {
          content: string
          conversation_id: string | null
          created_at: string
          id: string
          metadata: Json | null
          token_count: number | null
          type: Database["public"]["Enums"]["memory_type"]
          updated_at: string
        }
        Insert: {
          content: string
          conversation_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          token_count?: number | null
          type: Database["public"]["Enums"]["memory_type"]
          updated_at?: string
        }
        Update: {
          content?: string
          conversation_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          token_count?: number | null
          type?: Database["public"]["Enums"]["memory_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_memory_buffers_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "ai_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          role: Database["public"]["Enums"]["message_role"]
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["message_role"]
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["message_role"]
        }
        Relationships: [
          {
            foreignKeyName: "ai_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "ai_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          resource_id: string
          resource_type: string
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          resource_id: string
          resource_type: string
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          resource_id?: string
          resource_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      collection_evidence: {
        Row: {
          collection_id: string
          content_type: string
          created_at: string
          created_by: string
          evidence_type: string
          file_path: string
          filename: string
          filesize: number
          id: string
        }
        Insert: {
          collection_id: string
          content_type: string
          created_at?: string
          created_by: string
          evidence_type: string
          file_path: string
          filename: string
          filesize: number
          id?: string
        }
        Update: {
          collection_id?: string
          content_type?: string
          created_at?: string
          created_by?: string
          evidence_type?: string
          file_path?: string
          filename?: string
          filesize?: number
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "collection_evidence_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collection_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_evidence_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      collection_requests: {
        Row: {
          arrival_date: string | null
          collection_address: string
          completed_at: string | null
          completed_by: string | null
          created_at: string
          created_by: string
          id: string
          material_weight: number | null
          notes: string | null
          rnc_id: string
          status: Database["public"]["Enums"]["collection_status_enum"] | null
          updated_at: string
        }
        Insert: {
          arrival_date?: string | null
          collection_address: string
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          created_by: string
          id?: string
          material_weight?: number | null
          notes?: string | null
          rnc_id: string
          status?: Database["public"]["Enums"]["collection_status_enum"] | null
          updated_at?: string
        }
        Update: {
          arrival_date?: string | null
          collection_address?: string
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          created_by?: string
          id?: string
          material_weight?: number | null
          notes?: string | null
          rnc_id?: string
          status?: Database["public"]["Enums"]["collection_status_enum"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "collection_requests_completed_by_fkey"
            columns: ["completed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_requests_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_requests_rnc_id_fkey"
            columns: ["rnc_id"]
            isOneToOne: false
            referencedRelation: "rncs"
            referencedColumns: ["id"]
          },
        ]
      }
      docling_poc_results: {
        Row: {
          cpu_usage: number | null
          created_at: string
          doc_size: number
          file: string
          id: string
          num_chunks: number
          processing_time: number
          ram_usage: number | null
        }
        Insert: {
          cpu_usage?: number | null
          created_at?: string
          doc_size: number
          file: string
          id?: string
          num_chunks: number
          processing_time: number
          ram_usage?: number | null
        }
        Update: {
          cpu_usage?: number | null
          created_at?: string
          doc_size?: number
          file?: string
          id?: string
          num_chunks?: number
          processing_time?: number
          ram_usage?: number | null
        }
        Relationships: []
      }
      document_chunks: {
        Row: {
          chunk_number: number | null
          coherence_score: number | null
          content: string
          created_at: string
          created_by: string | null
          document_id: string | null
          embedding: string | null
          id: string
          metadata: Json
          processing_time: number | null
          semantic_context: string | null
          token_count: number | null
          topic: string | null
          version_id: string | null
        }
        Insert: {
          chunk_number?: number | null
          coherence_score?: number | null
          content: string
          created_at?: string
          created_by?: string | null
          document_id?: string | null
          embedding?: string | null
          id?: string
          metadata?: Json
          processing_time?: number | null
          semantic_context?: string | null
          token_count?: number | null
          topic?: string | null
          version_id?: string | null
        }
        Update: {
          chunk_number?: number | null
          coherence_score?: number | null
          content?: string
          created_at?: string
          created_by?: string | null
          document_id?: string | null
          embedding?: string | null
          id?: string
          metadata?: Json
          processing_time?: number | null
          semantic_context?: string | null
          token_count?: number | null
          topic?: string | null
          version_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_chunks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_chunks_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_chunks_version_id_fkey"
            columns: ["version_id"]
            isOneToOne: false
            referencedRelation: "document_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      document_processing_metrics: {
        Row: {
          avg_coherence: number
          chunk_count: number
          created_at: string | null
          document_id: string | null
          embedding_time: number | null
          id: string
          metadata: Json | null
          processing_time: number
          token_count: number | null
          version: number | null
        }
        Insert: {
          avg_coherence: number
          chunk_count: number
          created_at?: string | null
          document_id?: string | null
          embedding_time?: number | null
          id?: string
          metadata?: Json | null
          processing_time: number
          token_count?: number | null
          version?: number | null
        }
        Update: {
          avg_coherence?: number
          chunk_count?: number
          created_at?: string | null
          document_id?: string | null
          embedding_time?: number | null
          id?: string
          metadata?: Json | null
          processing_time?: number
          token_count?: number | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "document_processing_metrics_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      document_search_cache: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          query_hash: string
          results: Json
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          query_hash: string
          results: Json
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          query_hash?: string
          results?: Json
        }
        Relationships: []
      }
      document_versions: {
        Row: {
          created_at: string
          created_by: string | null
          document_id: string | null
          id: string
          is_active: boolean | null
          metadata: Json | null
          version_number: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          document_id?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          version_number: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          document_id?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "document_versions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_versions_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          chunk_overlap: number | null
          chunk_size: number | null
          content: string | null
          created_at: string | null
          created_by: string | null
          embedding: string | null
          id: string
          metadata: Json | null
          processed: boolean | null
        }
        Insert: {
          chunk_overlap?: number | null
          chunk_size?: number | null
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          embedding?: string | null
          id?: string
          metadata?: Json | null
          processed?: boolean | null
        }
        Update: {
          chunk_overlap?: number | null
          chunk_size?: number | null
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          embedding?: string | null
          id?: string
          metadata?: Json | null
          processed?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      materials: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "materials_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          read: boolean | null
          rnc_id: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          rnc_id?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          rnc_id?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_rnc_id_fkey"
            columns: ["rnc_id"]
            isOneToOne: false
            referencedRelation: "rncs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      operations: {
        Row: {
          bay_number: number | null
          created_at: string | null
          dock_number: string | null
          entry_time: string | null
          estimated_time: number | null
          exit_time: string | null
          final_weight: number | null
          id: string
          initial_weight: number | null
          net_weight: number | null
          notes: string | null
          operation_type: string
          origin_destination: string | null
          priority: string | null
          status: string
          truck_id: string | null
          updated_at: string | null
        }
        Insert: {
          bay_number?: number | null
          created_at?: string | null
          dock_number?: string | null
          entry_time?: string | null
          estimated_time?: number | null
          exit_time?: string | null
          final_weight?: number | null
          id?: string
          initial_weight?: number | null
          net_weight?: number | null
          notes?: string | null
          operation_type: string
          origin_destination?: string | null
          priority?: string | null
          status: string
          truck_id?: string | null
          updated_at?: string | null
        }
        Update: {
          bay_number?: number | null
          created_at?: string | null
          dock_number?: string | null
          entry_time?: string | null
          estimated_time?: number | null
          exit_time?: string | null
          final_weight?: number | null
          id?: string
          initial_weight?: number | null
          net_weight?: number | null
          notes?: string | null
          operation_type?: string
          origin_destination?: string | null
          priority?: string | null
          status?: string
          truck_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "operations_truck_id_fkey"
            columns: ["truck_id"]
            isOneToOne: false
            referencedRelation: "trucks"
            referencedColumns: ["id"]
          },
        ]
      }
      pre_registered_vehicles: {
        Row: {
          blacklist_reason: string | null
          blacklisted: boolean | null
          created_at: string | null
          driver_name: string
          id: string
          plate: string
          recurring: boolean | null
          transport_company: string
          truck_type: string
          updated_at: string | null
          valid_until: string | null
        }
        Insert: {
          blacklist_reason?: string | null
          blacklisted?: boolean | null
          created_at?: string | null
          driver_name: string
          id?: string
          plate: string
          recurring?: boolean | null
          transport_company: string
          truck_type: string
          updated_at?: string | null
          valid_until?: string | null
        }
        Update: {
          blacklist_reason?: string | null
          blacklisted?: boolean | null
          created_at?: string | null
          driver_name?: string
          id?: string
          plate?: string
          recurring?: boolean | null
          transport_company?: string
          truck_type?: string
          updated_at?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          active: boolean | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          internal_code: string
          name: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          internal_code: string
          name: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          internal_code?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          active: boolean | null
          avatar_url: string | null
          created_at: string
          email: string | null
          id: string
          modules: string[] | null
          name: string | null
          password_reset_needed: boolean | null
          role: string | null
        }
        Insert: {
          active?: boolean | null
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id: string
          modules?: string[] | null
          name?: string | null
          password_reset_needed?: boolean | null
          role?: string | null
        }
        Update: {
          active?: boolean | null
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id?: string
          modules?: string[] | null
          name?: string | null
          password_reset_needed?: boolean | null
          role?: string | null
        }
        Relationships: []
      }
      return_items: {
        Row: {
          collection_id: string | null
          created_at: string
          created_by: string | null
          id: string
          product_id: string | null
          weight: number
        }
        Insert: {
          collection_id?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          product_id?: string | null
          weight: number
        }
        Update: {
          collection_id?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          product_id?: string | null
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "return_items_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collection_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "return_items_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "return_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      rnc_attachments: {
        Row: {
          content_type: string
          created_at: string
          created_by: string
          deleted_at: string | null
          file_path: string
          filename: string
          filesize: number
          id: string
          rnc_id: string
        }
        Insert: {
          content_type: string
          created_at?: string
          created_by: string
          deleted_at?: string | null
          file_path: string
          filename: string
          filesize: number
          id?: string
          rnc_id: string
        }
        Update: {
          content_type?: string
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          file_path?: string
          filename?: string
          filesize?: number
          id?: string
          rnc_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rnc_attachments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rnc_attachments_rnc_id_fkey"
            columns: ["rnc_id"]
            isOneToOne: false
            referencedRelation: "rncs"
            referencedColumns: ["id"]
          },
        ]
      }
      rnc_contacts: {
        Row: {
          created_at: string
          deleted_at: string | null
          email: string | null
          id: string
          name: string
          phone: string
          rnc_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          email?: string | null
          id?: string
          name: string
          phone: string
          rnc_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string
          rnc_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rnc_contacts_rnc_id_fkey"
            columns: ["rnc_id"]
            isOneToOne: false
            referencedRelation: "rncs"
            referencedColumns: ["id"]
          },
        ]
      }
      rnc_events: {
        Row: {
          created_at: string
          created_by: string
          deleted_at: string | null
          description: string
          id: string
          rnc_id: string
          title: string
          type: string
        }
        Insert: {
          created_at?: string
          created_by: string
          deleted_at?: string | null
          description: string
          id?: string
          rnc_id: string
          title: string
          type: string
        }
        Update: {
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          description?: string
          id?: string
          rnc_id?: string
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "rnc_events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rnc_events_rnc_id_fkey"
            columns: ["rnc_id"]
            isOneToOne: false
            referencedRelation: "rncs"
            referencedColumns: ["id"]
          },
        ]
      }
      rnc_products: {
        Row: {
          created_at: string
          deleted_at: string | null
          id: string
          name: string
          rnc_id: string
          updated_at: string | null
          weight: number
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          name: string
          rnc_id: string
          updated_at?: string | null
          weight: number
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          name?: string
          rnc_id?: string
          updated_at?: string | null
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "rnc_products_rnc_id_fkey"
            columns: ["rnc_id"]
            isOneToOne: false
            referencedRelation: "rncs"
            referencedColumns: ["id"]
          },
        ]
      }
      rnc_workflow_transitions: {
        Row: {
          created_at: string
          created_by: string
          deleted_at: string | null
          from_status:
            | Database["public"]["Enums"]["rnc_workflow_status_enum"]
            | null
          id: string
          notes: string | null
          rnc_id: string
          to_status: Database["public"]["Enums"]["rnc_workflow_status_enum"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          created_by: string
          deleted_at?: string | null
          from_status?:
            | Database["public"]["Enums"]["rnc_workflow_status_enum"]
            | null
          id?: string
          notes?: string | null
          rnc_id: string
          to_status: Database["public"]["Enums"]["rnc_workflow_status_enum"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          from_status?:
            | Database["public"]["Enums"]["rnc_workflow_status_enum"]
            | null
          id?: string
          notes?: string | null
          rnc_id?: string
          to_status?: Database["public"]["Enums"]["rnc_workflow_status_enum"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rnc_workflow_transitions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rnc_workflow_transitions_rnc_id_fkey"
            columns: ["rnc_id"]
            isOneToOne: false
            referencedRelation: "rncs"
            referencedColumns: ["id"]
          },
        ]
      }
      rncs: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          assigned_to: string | null
          city: string | null
          closed_at: string | null
          collected_at: string | null
          company: string
          company_code: string | null
          conclusion: string | null
          created_at: string
          created_by: string
          days_left: number | null
          deleted_at: string | null
          department: Database["public"]["Enums"]["rnc_department_enum"]
          description: string
          document: string
          id: string
          korp: string | null
          nfd: string | null
          nfv: string | null
          resolution: string | null
          responsible: string | null
          rnc_number: number | null
          status: Database["public"]["Enums"]["rnc_status_enum"]
          type: Database["public"]["Enums"]["rnc_type_enum"]
          updated_at: string
          workflow_status: Database["public"]["Enums"]["rnc_workflow_status_enum"]
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          assigned_to?: string | null
          city?: string | null
          closed_at?: string | null
          collected_at?: string | null
          company: string
          company_code?: string | null
          conclusion?: string | null
          created_at?: string
          created_by: string
          days_left?: number | null
          deleted_at?: string | null
          department?: Database["public"]["Enums"]["rnc_department_enum"]
          description: string
          document: string
          id?: string
          korp?: string | null
          nfd?: string | null
          nfv?: string | null
          resolution?: string | null
          responsible?: string | null
          rnc_number?: number | null
          status?: Database["public"]["Enums"]["rnc_status_enum"]
          type?: Database["public"]["Enums"]["rnc_type_enum"]
          updated_at?: string
          workflow_status?: Database["public"]["Enums"]["rnc_workflow_status_enum"]
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          assigned_to?: string | null
          city?: string | null
          closed_at?: string | null
          collected_at?: string | null
          company?: string
          company_code?: string | null
          conclusion?: string | null
          created_at?: string
          created_by?: string
          days_left?: number | null
          deleted_at?: string | null
          department?: Database["public"]["Enums"]["rnc_department_enum"]
          description?: string
          document?: string
          id?: string
          korp?: string | null
          nfd?: string | null
          nfv?: string | null
          resolution?: string | null
          responsible?: string | null
          rnc_number?: number | null
          status?: Database["public"]["Enums"]["rnc_status_enum"]
          type?: Database["public"]["Enums"]["rnc_type_enum"]
          updated_at?: string
          workflow_status?: Database["public"]["Enums"]["rnc_workflow_status_enum"]
        }
        Relationships: [
          {
            foreignKeyName: "rncs_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rncs_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rncs_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      scheduled_operations: {
        Row: {
          cargo_type: string | null
          created_at: string | null
          estimated_duration: number | null
          id: string
          notes: string | null
          operation_type: string
          pre_registered_vehicle_id: string | null
          priority: string | null
          scheduled_time: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          cargo_type?: string | null
          created_at?: string | null
          estimated_duration?: number | null
          id?: string
          notes?: string | null
          operation_type: string
          pre_registered_vehicle_id?: string | null
          priority?: string | null
          scheduled_time: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          cargo_type?: string | null
          created_at?: string | null
          estimated_duration?: number | null
          id?: string
          notes?: string | null
          operation_type?: string
          pre_registered_vehicle_id?: string | null
          priority?: string | null
          scheduled_time?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_operations_pre_registered_vehicle_id_fkey"
            columns: ["pre_registered_vehicle_id"]
            isOneToOne: false
            referencedRelation: "pre_registered_vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      secrets: {
        Row: {
          created_at: string
          id: string
          name: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          value?: string
        }
        Relationships: []
      }
      tachograph_records: {
        Row: {
          created_at: string | null
          final_mileage: number | null
          final_mileage_photo_url: string | null
          id: string
          image_url: string | null
          mileage: number
          operation_id: string | null
          record_type: string
        }
        Insert: {
          created_at?: string | null
          final_mileage?: number | null
          final_mileage_photo_url?: string | null
          id?: string
          image_url?: string | null
          mileage: number
          operation_id?: string | null
          record_type: string
        }
        Update: {
          created_at?: string | null
          final_mileage?: number | null
          final_mileage_photo_url?: string | null
          id?: string
          image_url?: string | null
          mileage?: number
          operation_id?: string | null
          record_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "tachograph_records_operation_id_fkey"
            columns: ["operation_id"]
            isOneToOne: false
            referencedRelation: "operations"
            referencedColumns: ["id"]
          },
        ]
      }
      truck_access_logs: {
        Row: {
          cargo_description: string | null
          created_at: string | null
          driver_document: string | null
          driver_photo: string | null
          entry_time: string | null
          exit_time: string | null
          id: string
          notes: string | null
          purpose: string
          truck_id: string | null
          truck_photo: string | null
          updated_at: string | null
        }
        Insert: {
          cargo_description?: string | null
          created_at?: string | null
          driver_document?: string | null
          driver_photo?: string | null
          entry_time?: string | null
          exit_time?: string | null
          id?: string
          notes?: string | null
          purpose: string
          truck_id?: string | null
          truck_photo?: string | null
          updated_at?: string | null
        }
        Update: {
          cargo_description?: string | null
          created_at?: string | null
          driver_document?: string | null
          driver_photo?: string | null
          entry_time?: string | null
          exit_time?: string | null
          id?: string
          notes?: string | null
          purpose?: string
          truck_id?: string | null
          truck_photo?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "truck_access_logs_truck_id_fkey"
            columns: ["truck_id"]
            isOneToOne: false
            referencedRelation: "trucks"
            referencedColumns: ["id"]
          },
        ]
      }
      trucks: {
        Row: {
          created_at: string | null
          driver_name: string
          id: string
          plate: string
          transport_company: string
          truck_type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          driver_name: string
          id?: string
          plate: string
          transport_company: string
          truck_type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          driver_name?: string
          id?: string
          plate?: string
          transport_company?: string
          truck_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      workflow_states: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          email_template: string | null
          id: string
          label: string
          position_x: number
          position_y: number
          send_email: boolean | null
          state_type: Database["public"]["Enums"]["workflow_state_type"]
          workflow_id: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          email_template?: string | null
          id?: string
          label: string
          position_x: number
          position_y: number
          send_email?: boolean | null
          state_type: Database["public"]["Enums"]["workflow_state_type"]
          workflow_id?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          email_template?: string | null
          id?: string
          label?: string
          position_x?: number
          position_y?: number
          send_email?: boolean | null
          state_type?: Database["public"]["Enums"]["workflow_state_type"]
          workflow_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_workflow_states_assigned_to"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_states_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_states_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflow_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_templates: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_default: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_default?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_default?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workflow_templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_transitions: {
        Row: {
          created_at: string | null
          from_state_id: string | null
          id: string
          label: string
          to_state_id: string | null
          workflow_id: string | null
        }
        Insert: {
          created_at?: string | null
          from_state_id?: string | null
          id?: string
          label: string
          to_state_id?: string | null
          workflow_id?: string | null
        }
        Update: {
          created_at?: string | null
          from_state_id?: string | null
          id?: string
          label?: string
          to_state_id?: string | null
          workflow_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workflow_transitions_from_state_id_fkey"
            columns: ["from_state_id"]
            isOneToOne: false
            referencedRelation: "workflow_states"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_transitions_to_state_id_fkey"
            columns: ["to_state_id"]
            isOneToOne: false
            referencedRelation: "workflow_states"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_transitions_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflow_templates"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      company_quality_dashboard_stats: {
        Row: {
          company: string | null
          count: number | null
        }
        Relationships: []
      }
      department_quality_dashboard_stats: {
        Row: {
          count: number | null
          department: Database["public"]["Enums"]["rnc_department_enum"] | null
        }
        Relationships: []
      }
      responsible_quality_dashboard_stats: {
        Row: {
          count: number | null
          responsible: string | null
        }
        Relationships: []
      }
      type_quality_dashboard_stats: {
        Row: {
          count: number | null
          type: Database["public"]["Enums"]["rnc_type_enum"] | null
        }
        Relationships: []
      }
    }
    Functions: {
      binary_quantize:
        | {
            Args: {
              "": string
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      calculate_agent_metrics: {
        Args: {
          p_agent_id: string
        }
        Returns: {
          metric_type: string
          avg_value: number
          total_count: number
        }[]
      }
      calculate_chunk_coherence: {
        Args: {
          chunk_text: string
          context: string
        }
        Returns: number
      }
      create_daily_rnc_events: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_user_modules: {
        Args: Record<PropertyKey, never>
        Returns: string[]
      }
      halfvec_avg: {
        Args: {
          "": number[]
        }
        Returns: unknown
      }
      halfvec_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      halfvec_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
      hnsw_bit_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnswhandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflathandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      l2_norm:
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
      l2_normalize:
        | {
            Args: {
              "": string
            }
            Returns: string
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      log_agent_event: {
        Args: {
          p_agent_id: string
          p_conversation_id: string
          p_event_type: string
          p_configuration?: Json
          p_details?: string
        }
        Returns: string
      }
      match_document_chunks: {
        Args: {
          query_embedding: string
          match_threshold: number
          match_count: number
        }
        Returns: {
          id: string
          content: string
          metadata: Json
          similarity: number
        }[]
      }
      match_documents:
        | {
            Args: {
              query_embedding: string
              match_count?: number
            }
            Returns: {
              id: string
              content: string
              metadata: Json
              similarity: number
            }[]
          }
        | {
            Args: {
              query_embedding: string
              match_threshold: number
              match_count: number
            }
            Returns: {
              id: string
              content: string
              metadata: Json
              similarity: number
            }[]
          }
        | {
            Args: {
              query_embedding: string
              match_threshold: number
              match_count: number
              p_agent_id: string
            }
            Returns: {
              id: string
              content: string
              metadata: Json
              similarity: number
            }[]
          }
      postgres_fdw_disconnect: {
        Args: {
          "": string
        }
        Returns: boolean
      }
      postgres_fdw_disconnect_all: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      postgres_fdw_get_connections: {
        Args: Record<PropertyKey, never>
        Returns: Record<string, unknown>[]
      }
      postgres_fdw_handler: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      rollback_document_version: {
        Args: {
          p_version_id: string
          p_document_id: string
        }
        Returns: undefined
      }
      sparsevec_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      sparsevec_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
      vector_avg: {
        Args: {
          "": number[]
        }
        Returns: string
      }
      vector_dims:
        | {
            Args: {
              "": string
            }
            Returns: number
          }
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
      vector_norm: {
        Args: {
          "": string
        }
        Returns: number
      }
      vector_out: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      vector_send: {
        Args: {
          "": string
        }
        Returns: string
      }
      vector_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
    }
    Enums: {
      agent_type_enum: "openai" | "n8n" | "flowise"
      chain_type_enum: "conversation" | "qa" | "conversational_qa"
      collection_status_enum:
        | "pending"
        | "in_progress"
        | "completed"
        | "cancelled"
      memory_type: "message" | "summary" | "system"
      memory_type_enum: "buffer" | "window" | "summary"
      message_role: "system" | "assistant" | "user"
      output_format_enum: "text" | "structured" | "markdown"
      rnc_department_enum: "logistics" | "quality" | "financial" | "tax"
      rnc_status_enum:
        | "not_created"
        | "pending"
        | "canceled"
        | "collect"
        | "concluded"
      rnc_type_enum:
        | "company_complaint"
        | "supplier"
        | "dispatch"
        | "logistics"
        | "deputy"
        | "driver"
        | "financial"
        | "commercial"
        | "financial_agreement"
      rnc_workflow_status_enum:
        | "open"
        | "analysis"
        | "resolution"
        | "solved"
        | "closing"
        | "closed"
      search_type_enum: "similarity" | "mmr"
      status_enum:
        | "open"
        | "in_progress"
        | "closed"
        | "Coletar"
        | "Coleta Programada"
        | "Coleta Solicitada"
      workflow_state_type:
        | "open"
        | "analysis"
        | "resolution"
        | "solved"
        | "closing"
        | "closed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
