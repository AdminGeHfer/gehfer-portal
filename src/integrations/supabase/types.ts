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
      ai_agents: {
        Row: {
          chain_type: Database["public"]["Enums"]["chain_type_enum"]
          chunk_overlap: number
          chunk_size: number
          created_at: string
          description: string | null
          embedding_model: string
          id: string
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
          tools: string[] | null
          top_k: number
          top_p: number
          updated_at: string
          use_knowledge_base: boolean
          user_id: string
        }
        Insert: {
          chain_type?: Database["public"]["Enums"]["chain_type_enum"]
          chunk_overlap?: number
          chunk_size?: number
          created_at?: string
          description?: string | null
          embedding_model?: string
          id?: string
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
          tools?: string[] | null
          top_k?: number
          top_p?: number
          updated_at?: string
          use_knowledge_base?: boolean
          user_id: string
        }
        Update: {
          chain_type?: Database["public"]["Enums"]["chain_type_enum"]
          chunk_overlap?: number
          chunk_size?: number
          created_at?: string
          description?: string | null
          embedding_model?: string
          id?: string
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
      documents: {
        Row: {
          content: string | null
          created_at: string | null
          created_by: string | null
          embedding: string | null
          id: string
          metadata: Json | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          embedding?: string | null
          id?: string
          metadata?: Json | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          embedding?: string | null
          id?: string
          metadata?: Json | null
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
          email: string
          id: string
          name: string
          phone: string
          rnc_id: string
        }
        Insert: {
          email: string
          id?: string
          name: string
          phone: string
          rnc_id: string
        }
        Update: {
          email?: string
          id?: string
          name?: string
          phone?: string
          rnc_id?: string
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
          description: string
          id: string
          rnc_id: string
          title: string
          type: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description: string
          id?: string
          rnc_id: string
          title: string
          type: string
        }
        Update: {
          created_at?: string
          created_by?: string
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
      rnc_workflow_transitions: {
        Row: {
          created_at: string
          created_by: string
          from_status:
            | Database["public"]["Enums"]["rnc_workflow_status_enum"]
            | null
          id: string
          notes: string | null
          rnc_id: string
          to_status: Database["public"]["Enums"]["rnc_workflow_status_enum"]
        }
        Insert: {
          created_at?: string
          created_by: string
          from_status?:
            | Database["public"]["Enums"]["rnc_workflow_status_enum"]
            | null
          id?: string
          notes?: string | null
          rnc_id: string
          to_status: Database["public"]["Enums"]["rnc_workflow_status_enum"]
        }
        Update: {
          created_at?: string
          created_by?: string
          from_status?:
            | Database["public"]["Enums"]["rnc_workflow_status_enum"]
            | null
          id?: string
          notes?: string | null
          rnc_id?: string
          to_status?: Database["public"]["Enums"]["rnc_workflow_status_enum"]
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
          closed_at: string | null
          cnpj: string
          company: string
          created_at: string
          created_by: string
          department: string
          description: string
          id: string
          order_number: string | null
          priority: string
          return_number: string | null
          rnc_number: number | null
          type: string
          updated_at: string
          workflow_status: Database["public"]["Enums"]["rnc_workflow_status_enum"]
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          assigned_to?: string | null
          closed_at?: string | null
          cnpj: string
          company: string
          created_at?: string
          created_by: string
          department?: string
          description: string
          id?: string
          order_number?: string | null
          priority?: string
          return_number?: string | null
          rnc_number?: number | null
          type: string
          updated_at?: string
          workflow_status?: Database["public"]["Enums"]["rnc_workflow_status_enum"]
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          assigned_to?: string | null
          closed_at?: string | null
          cnpj?: string
          company?: string
          created_at?: string
          created_by?: string
          department?: string
          description?: string
          id?: string
          order_number?: string | null
          priority?: string
          return_number?: string | null
          rnc_number?: number | null
          type?: string
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
      [_ in never]: never
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
      chain_type_enum: "conversation" | "qa" | "conversational_qa"
      collection_status_enum:
        | "pending"
        | "in_progress"
        | "completed"
        | "cancelled"
      memory_type_enum: "buffer" | "window" | "summary"
      message_role: "system" | "assistant" | "user"
      output_format_enum: "text" | "structured" | "markdown"
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
