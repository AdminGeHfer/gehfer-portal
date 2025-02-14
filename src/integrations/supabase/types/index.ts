import { Json } from './json';
import { DocumentTypes } from './documents';
import { AITablesSchema } from './ai';

export interface Database {
  public: {
    Tables: DocumentTypes & AITablesSchema & {
      ai_conversations: {
        Row: {
          created_at: string;
          id: string;
          title: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          title: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          title?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "ai_conversations_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      ai_messages: {
        Row: {
          content: string;
          conversation_id: string;
          created_at: string;
          id: string;
          role: Database["public"]["Enums"]["message_role"];
        };
        Insert: {
          content: string;
          conversation_id: string;
          created_at?: string;
          id?: string;
          role: Database["public"]["Enums"]["message_role"];
        };
        Update: {
          content?: string;
          conversation_id?: string;
          created_at?: string;
          id?: string;
          role?: Database["public"]["Enums"]["message_role"];
        };
        Relationships: [
          {
            foreignKeyName: "ai_messages_conversation_id_fkey";
            columns: ["conversation_id"];
            isOneToOne: false;
            referencedRelation: "ai_conversations";
            referencedColumns: ["id"];
          }
        ];
      };
      audit_logs: {
        Row: {
          action: string;
          created_at: string;
          details: Json | null;
          id: string;
          resource_id: string;
          resource_type: string;
          user_id: string;
        };
        Insert: {
          action: string;
          created_at?: string;
          details?: Json | null;
          id?: string;
          resource_id: string;
          resource_type: string;
          user_id: string;
        };
        Update: {
          action?: string;
          created_at?: string;
          details?: Json | null;
          id?: string;
          resource_id?: string;
          resource_type?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      collection_evidence: {
        Row: {
          collection_id: string;
          content_type: string;
          created_at: string;
          created_by: string;
          evidence_type: string;
          file_path: string;
          filename: string;
          filesize: number;
          id: string;
        };
        Insert: {
          collection_id: string;
          content_type: string;
          created_at?: string;
          created_by: string;
          evidence_type: string;
          file_path: string;
          filename: string;
          filesize: number;
          id?: string;
        };
        Update: {
          collection_id?: string;
          content_type?: string;
          created_at?: string;
          created_by?: string;
          evidence_type?: string;
          file_path?: string;
          filename?: string;
          filesize?: number;
          id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "collection_evidence_collection_id_fkey";
            columns: ["collection_id"];
            isOneToOne: false;
            referencedRelation: "collection_requests";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "collection_evidence_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      collection_requests: {
        Row: {
          arrival_date: string | null;
          collection_address: string;
          completed_at: string | null;
          completed_by: string | null;
          created_at: string;
          created_by: string;
          id: string;
          material_weight: number | null;
          notes: string | null;
          rnc_id: string;
          status: Database["public"]["Enums"]["collection_status_enum"] | null;
          updated_at: string;
        };
        Insert: {
          arrival_date?: string | null;
          collection_address: string;
          completed_at?: string | null;
          completed_by?: string | null;
          created_at?: string;
          created_by: string;
          id?: string;
          material_weight?: number | null;
          notes?: string | null;
          rnc_id: string;
          status?: Database["public"]["Enums"]["collection_status_enum"] | null;
          updated_at?: string;
        };
        Update: {
          arrival_date?: string | null;
          collection_address?: string;
          completed_at?: string | null;
          completed_by?: string | null;
          created_at?: string;
          created_by?: string;
          id?: string;
          material_weight?: number | null;
          notes?: string | null;
          rnc_id?: string;
          status?: Database["public"]["Enums"]["collection_status_enum"] | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "collection_requests_completed_by_fkey";
            columns: ["completed_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "collection_requests_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "collection_requests_rnc_id_fkey";
            columns: ["rnc_id"];
            isOneToOne: false;
            referencedRelation: "rncs";
            referencedColumns: ["id"];
          }
        ];
      };
      materials: {
        Row: {
          created_at: string;
          created_by: string | null;
          description: string | null;
          id: string;
          name: string;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          id?: string;
          name: string;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          id?: string;
          name?: string;
        };
        Relationships: [
          {
            foreignKeyName: "materials_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      notifications: {
        Row: {
          created_at: string | null;
          id: string;
          message: string;
          read: boolean | null;
          rnc_id: string | null;
          title: string;
          type: string;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          message: string;
          read?: boolean | null;
          rnc_id?: string | null;
          title: string;
          type: string;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          message?: string;
          read?: boolean | null;
          rnc_id?: string | null;
          title?: string;
          type?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "notifications_rnc_id_fkey";
            columns: ["rnc_id"];
            isOneToOne: false;
            referencedRelation: "rncs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "notifications_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      products: {
        Row: {
          active: boolean | null;
          created_at: string;
          created_by: string | null;
          description: string | null;
          id: string;
          internal_code: string;
          name: string;
        };
        Insert: {
          active?: boolean | null;
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          id?: string;
          internal_code: string;
          name: string;
        };
        Update: {
          active?: boolean | null;
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          id?: string;
          internal_code?: string;
          name?: string;
        };
        Relationships: [
          {
            foreignKeyName: "products_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      profiles: {
        Row: {
          active: boolean | null;
          avatar_url: string | null;
          created_at: string;
          email: string | null;
          id: string;
          modules: string[] | null;
          name: string | null;
          password_reset_needed: boolean | null;
          role: string | null;
        };
        Insert: {
          active?: boolean | null;
          avatar_url?: string | null;
          created_at?: string;
          email?: string | null;
          id: string;
          modules?: string[] | null;
          name?: string | null;
          password_reset_needed?: boolean | null;
          role?: string | null;
        };
        Update: {
          active?: boolean | null;
          avatar_url?: string | null;
          created_at?: string;
          email?: string | null;
          id?: string;
          modules?: string[] | null;
          name?: string | null;
          password_reset_needed?: boolean | null;
          role?: string | null;
        };
        Relationships: [];
      };
      return_items: {
        Row: {
          collection_id: string | null;
          created_at: string;
          created_by: string | null;
          id: string;
          product_id: string | null;
          weight: number;
        };
        Insert: {
          collection_id?: string | null;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          product_id?: string | null;
          weight: number;
        };
        Update: {
          collection_id?: string | null;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          product_id?: string | null;
          weight?: number;
        };
        Relationships: [
          {
            foreignKeyName: "return_items_collection_id_fkey";
            columns: ["collection_id"];
            isOneToOne: false;
            referencedRelation: "collection_requests";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "return_items_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "return_items_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          }
        ];
      };
      rnc_attachments: {
        Row: {
          content_type: string;
          created_at: string;
          created_by: string;
          file_path: string;
          filename: string;
          filesize: number;
          id: string;
          rnc_id: string;
        };
        Insert: {
          content_type: string;
          created_at?: string;
          created_by: string;
          file_path: string;
          filename: string;
          filesize: number;
          id?: string;
          rnc_id: string;
        };
        Update: {
          content_type?: string;
          created_at?: string;
          created_by?: string;
          file_path?: string;
          filename?: string;
          filesize?: number;
          id?: string;
          rnc_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "rnc_attachments_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "rnc_attachments_rnc_id_fkey";
            columns: ["rnc_id"];
            isOneToOne: false;
            referencedRelation: "rncs";
            referencedColumns: ["id"];
          }
        ];
      };
      rnc_contacts: {
        Row: {
          email: string;
          id: string;
          name: string;
          phone: string;
          rnc_id: string;
        };
        Insert: {
          email?: string;
          id?: string;
          name: string;
          phone: string;
          rnc_id: string;
        };
        Update: {
          email?: string;
          id?: string;
          name?: string;
          phone?: string;
          rnc_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "rnc_contacts_rnc_id_fkey";
            columns: ["rnc_id"];
            isOneToOne: false;
            referencedRelation: "rncs";
            referencedColumns: ["id"];
          }
        ];
      };
      rnc_events: {
        Row: {
          created_at: string;
          created_by: string;
          description: string;
          id: string;
          rnc_id: string;
          title: string;
          type: string;
        };
        Insert: {
          created_at?: string;
          created_by: string;
          description: string;
          id?: string;
          rnc_id: string;
          title: string;
          type: string;
        };
        Update: {
          created_at?: string;
          created_by?: string;
          description?: string;
          id?: string;
          rnc_id?: string;
          title?: string;
          type?: string;
        };
        Relationships: [
          {
            foreignKeyName: "rnc_events_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "rnc_events_rnc_id_fkey";
            columns: ["rnc_id"];
            isOneToOne: false;
            referencedRelation: "rncs";
            referencedColumns: ["id"];
          }
        ];
      };
      rnc_workflow_transitions: {
        Row: {
          created_at: string;
          created_by: string;
          from_status: Database["public"]["Enums"]["rnc_workflow_status_enum"] | null;
          id: string;
          notes: string | null;
          rnc_id: string;
          to_status: Database["public"]["Enums"]["rnc_workflow_status_enum"];
        };
        Insert: {
          created_at?: string;
          created_by: string;
          from_status?: Database["public"]["Enums"]["rnc_workflow_status_enum"] | null;
          id?: string;
          notes?: string | null;
          rnc_id: string;
          to_status: Database["public"]["Enums"]["rnc_workflow_status_enum"];
        };
        Update: {
          created_at?: string;
          created_by?: string;
          from_status?: Database["public"]["Enums"]["rnc_workflow_status_enum"] | null;
          id?: string;
          notes?: string | null;
          rnc_id?: string;
          to_status?: Database["public"]["Enums"]["rnc_workflow_status_enum"];
        };
        Relationships: [
          {
            foreignKeyName: "rnc_workflow_transitions_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "rnc_workflow_transitions_rnc_id_fkey";
            columns: ["rnc_id"];
            isOneToOne: false;
            referencedRelation: "rncs";
            referencedColumns: ["id"];
          }
        ];
      };
      rncs: {
        Row: {
          id: string;
          rnc_number?: number;
          company_code: string;
          company: string;
          document: string;
          description: string;
          type: Database["public"]["Enums"]["rnc_type_enum"];
          department: Database["public"]["Enums"]["rnc_department_enum"];
          responsible?: string;
          korp: string;
          nfv: string;
          nfd?: string;
          days_left?: number;
          city?: string;
          conclusion?: string;
          status: Database["public"]["Enums"]["rnc_status_enum"];
          workflow_status: Database["public"]["Enums"]["rnc_workflow_status_enum"];
          assigned_at?: string;
          closed_at?: string;
          collected_at?: string;
          created_by?: string;
          assigned_by?: string;
          assigned_to?: string;
          created_at: string;
          updated_at?: string;
        };
        Insert: {
          id?: string;
          rnc_number?: number;
          company_code: string;
          company: string;
          document: string;
          description: string;
          type: Database["public"]["Enums"]["rnc_type_enum"];
          department: Database["public"]["Enums"]["rnc_department_enum"];
          responsible?: string;
          korp: string;
          nfv: string;
          nfd?: string;
          days_left?: number;
          city?: string;
          conclusion?: string;
          status: Database["public"]["Enums"]["rnc_status_enum"];
          workflow_status: Database["public"]["Enums"]["rnc_workflow_status_enum"];
          assigned_at?: string;
          closed_at?: string;
          collected_at?: string;
          created_by?: string;
          assigned_by?: string;
          assigned_to?: string;
          created_at: string;
          updated_at?: string;
        };
        Update: {
          id: string;
          rnc_number?: number;
          company_code: string;
          company: string;
          document: string;
          description: string;
          type: Database["public"]["Enums"]["rnc_type_enum"];
          department: Database["public"]["Enums"]["rnc_department_enum"];
          responsible: string;
          korp: string;
          nfv: string;
          nfd?: string;
          days_left?: number;
          city?: string;
          conclusion?: string;
          status?: Database["public"]["Enums"]["rnc_status_enum"];
          workflow_status?: Database["public"]["Enums"]["rnc_workflow_status_enum"];
          assigned_at?: string;
          closed_at?: string;
          collected_at?: string;
          created_by?: string;
          assigned_by?: string;
          assigned_to?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "rncs_assigned_by_fkey";
            columns: ["assigned_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "rncs_assigned_to_fkey";
            columns: ["assigned_to"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "rncs_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      workflow_states: {
        Row: {
          assigned_to: string | null;
          created_at: string | null;
          notification_template: string | null;
          id: string;
          label: string;
          position_x: number;
          position_y: number;
          send_notification: boolean | null;
          state_type: Database["public"]["Enums"]["workflow_state_type"];
          workflow_id: string | null;
        };
        Insert: {
          assigned_to?: string | null;
          created_at?: string | null;
          notification_template?: string | null;
          id?: string;
          label: string;
          position_x: number;
          position_y: number;
          send_notification?: boolean | null;
          state_type: Database["public"]["Enums"]["workflow_state_type"];
          workflow_id?: string | null;
        };
        Update: {
          assigned_to?: string | null;
          created_at?: string | null;
          notification_template?: string | null;
          id?: string;
          label?: string;
          position_x?: number;
          position_y?: number;
          send_notification?: boolean | null;
          state_type?: Database["public"]["Enums"]["workflow_state_type"];
          workflow_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "workflow_states_assigned_to_fkey";
            columns: ["assigned_to"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "workflow_states_workflow_id_fkey";
            columns: ["workflow_id"];
            isOneToOne: false;
            referencedRelation: "workflow_templates";
            referencedColumns: ["id"];
          }
        ];
      };
      workflow_templates: {
        Row: {
          created_at: string | null;
          created_by: string | null;
          description: string | null;
          id: string;
          is_default: boolean | null;
          name: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          created_by?: string | null;
          description?: string | null;
          id?: string;
          is_default?: boolean | null;
          name: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          created_by?: string | null;
          description?: string | null;
          id?: string;
          is_default?: boolean | null;
          name?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "workflow_templates_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      workflow_transitions: {
        Row: {
          created_at: string | null;
          from_state_id: string | null;
          id: string;
          label: string;
          to_state_id: string | null;
          workflow_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          from_state_id?: string | null;
          id?: string;
          label: string;
          to_state_id?: string | null;
          workflow_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          from_state_id?: string | null;
          id?: string;
          label?: string;
          to_state_id?: string | null;
          workflow_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "workflow_transitions_from_state_id_fkey";
            columns: ["from_state_id"];
            isOneToOne: false;
            referencedRelation: "workflow_states";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "workflow_transitions_to_state_id_fkey";
            columns: ["to_state_id"];
            isOneToOne: false;
            referencedRelation: "workflow_states";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "workflow_transitions_workflow_id_fkey";
            columns: ["workflow_id"];
            isOneToOne: false;
            referencedRelation: "workflow_templates";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      binary_quantize: {
        Args: {
          "": string;
        };
        Returns: unknown;
      } | {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      get_user_modules: {
        Args: Record<PropertyKey, never>;
        Returns: string[];
      };
      halfvec_avg: {
        Args: {
          "": number[];
        };
        Returns: unknown;
      };
      halfvec_out: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      halfvec_send: {
        Args: {
          "": unknown;
        };
        Returns: string;
      };
      halfvec_typmod_in: {
        Args: {
          "": unknown[];
        };
        Returns: number;
      };
      hnsw_bit_support: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      hnsw_halfvec_support: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      hnsw_sparsevec_support: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      hnswhandler: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      ivfflat_bit_support: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      ivfflat_halfvec_support: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      ivfflathandler: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      l2_norm: {
        Args: {
          "": unknown;
        };
        Returns: number;
      } | {
        Args: {
          "": unknown;
        };
        Returns: number;
      };
      l2_normalize: {
        Args: {
          "": string;
        };
        Returns: string;
      } | {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      } | {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      match_documents: {
        Args: {
          query_embedding: string;
          match_count?: number;
        };
        Returns: {
          id: string;
          content: string;
          metadata: Json;
          similarity: number;
        }[];
      } | {
        Args: {
          query_embedding: string;
          match_threshold: number;
          match_count: number;
        };
        Returns: {
          id: string;
          content: string;
          metadata: Json;
          similarity: number;
        }[];
      };
      rollback_document_version: {
        Args: {
          p_version_id: string;
          p_document_id: string;
        };
        Returns: void;
      };
      sparsevec_out: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      sparsevec_send: {
        Args: {
          "": unknown;
        };
        Returns: string;
      };
      sparsevec_typmod_in: {
        Args: {
          "": unknown[];
        };
        Returns: number;
      };
      vector_avg: {
        Args: {
          "": number[];
        };
        Returns: string;
      };
      vector_dims: {
        Args: {
          "": string;
        };
        Returns: number;
      } | {
        Args: {
          "": unknown;
        };
        Returns: number;
      };
      vector_norm: {
        Args: {
          "": string;
        };
        Returns: number;
      };
      vector_out: {
        Args: {
          "": string;
        };
        Returns: unknown;
      };
      vector_send: {
        Args: {
          "": string;
        };
        Returns: string;
      };
      vector_typmod_in: {
        Args: {
          "": unknown[];
        };
        Returns: number;
      };
    };
    Enums: {
      collection_status_enum: "pending" | "in_progress" | "completed" | "cancelled";
      message_role: "system" | "assistant" | "user";
      rnc_workflow_status_enum: "open" | "analysis" | "resolution" | "solved" | "closing" | "closed";
      rnc_type_enum: "company_complaint" | "supplier" | "dispatch" | "logistics" | "deputy" | "driver" | "financial" | "commercial" | "financial_agreement";
      rnc_department_enum: "logistics" | "quality" | "financial" | "tax";
      rnc_status_enum: "not_created" | "pending" | "canceled" | "collect" | "concluded";
      status_enum: "open" | "in_progress" | "closed" | "Coletar" | "Coleta Programada" | "Coleta Solicitada";
      workflow_state_type: "open" | "analysis" | "resolution" | "solved" | "closing" | "closed";
      memory_type_enum: 'buffer' | 'window' | 'summary';
      chain_type_enum: 'conversation' | 'qa' | 'conversational_qa';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}