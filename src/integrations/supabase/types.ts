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
      profiles: {
        Row: {
          active: boolean | null
          created_at: string
          department: string | null
          email: string | null
          id: string
          modules: string[] | null
          name: string | null
          password_reset_needed: boolean | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          department?: string | null
          email?: string | null
          id: string
          modules?: string[] | null
          name?: string | null
          password_reset_needed?: boolean | null
        }
        Update: {
          active?: boolean | null
          created_at?: string
          department?: string | null
          email?: string | null
          id?: string
          modules?: string[] | null
          name?: string | null
          password_reset_needed?: boolean | null
        }
        Relationships: []
      }
      rnc_attachments: {
        Row: {
          content_type: string
          created_at: string
          created_by: string
          filename: string
          filesize: number
          id: string
          rnc_id: string
        }
        Insert: {
          content_type: string
          created_at?: string
          created_by: string
          filename: string
          filesize: number
          id?: string
          rnc_id: string
        }
        Update: {
          content_type?: string
          created_at?: string
          created_by?: string
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
      rncs: {
        Row: {
          assigned_to: string | null
          closed_at: string | null
          cnpj: string
          company: string
          created_at: string
          created_by: string
          department: Database["public"]["Enums"]["department_enum"]
          description: string
          id: string
          order_number: string | null
          priority: string
          return_number: string | null
          rnc_number: number | null
          status: Database["public"]["Enums"]["status_enum"]
          type: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          closed_at?: string | null
          cnpj: string
          company: string
          created_at?: string
          created_by: string
          department: Database["public"]["Enums"]["department_enum"]
          description: string
          id?: string
          order_number?: string | null
          priority?: string
          return_number?: string | null
          rnc_number?: number | null
          status?: Database["public"]["Enums"]["status_enum"]
          type: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          closed_at?: string | null
          cnpj?: string
          company?: string
          created_at?: string
          created_by?: string
          department?: Database["public"]["Enums"]["department_enum"]
          description?: string
          id?: string
          order_number?: string | null
          priority?: string
          return_number?: string | null
          rnc_number?: number | null
          status?: Database["public"]["Enums"]["status_enum"]
          type?: string
          updated_at?: string
        }
        Relationships: [
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_modules: {
        Args: Record<PropertyKey, never>
        Returns: string[]
      }
    }
    Enums: {
      department_enum:
        | "Expedição"
        | "Logistica"
        | "Comercial"
        | "Qualidade"
        | "Produção"
      status_enum:
        | "open"
        | "in_progress"
        | "closed"
        | "Coletar"
        | "Coleta Programada"
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
