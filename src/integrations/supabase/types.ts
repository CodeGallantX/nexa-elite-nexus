export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      access_codes: {
        Row: {
          code: string
          created_at: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          requested_by: string | null
          used: boolean | null
        }
        Insert: {
          code: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          requested_by?: string | null
          used?: boolean | null
        }
        Update: {
          code?: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          requested_by?: string | null
          used?: boolean | null
        }
        Relationships: []
      }
      announcements: {
        Row: {
          content: string
          created_at: string | null
          created_by: string | null
          expires_at: string | null
          id: string
          is_pinned: boolean | null
          is_published: boolean | null
          scheduled_for: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_pinned?: boolean | null
          is_published?: boolean | null
          scheduled_for?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_pinned?: boolean | null
          is_published?: boolean | null
          scheduled_for?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "announcements_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance: {
        Row: {
          attendance_type: Database["public"]["Enums"]["event_type"]
          created_at: string | null
          date: string
          event_id: string | null
          event_kills: number | null
          id: string
          marked_by: string | null
          player_id: string | null
          status: Database["public"]["Enums"]["attendance_status"]
        }
        Insert: {
          attendance_type: Database["public"]["Enums"]["event_type"]
          created_at?: string | null
          date?: string
          event_id?: string | null
          event_kills?: number | null
          id?: string
          marked_by?: string | null
          player_id?: string | null
          status: Database["public"]["Enums"]["attendance_status"]
        }
        Update: {
          attendance_type?: Database["public"]["Enums"]["event_type"]
          created_at?: string | null
          date?: string
          event_id?: string | null
          event_kills?: number | null
          id?: string
          marked_by?: string | null
          player_id?: string | null
          status?: Database["public"]["Enums"]["attendance_status"]
        }
        Relationships: [
          {
            foreignKeyName: "attendance_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_marked_by_fkey"
            columns: ["marked_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          attachment_name: string | null
          attachment_type: string | null
          attachment_url: string | null
          channel: string
          created_at: string | null
          id: string
          message: string
          reply_to_id: string | null
          user_id: string | null
        }
        Insert: {
          attachment_name?: string | null
          attachment_type?: string | null
          attachment_url?: string | null
          channel?: string
          created_at?: string | null
          id?: string
          message: string
          reply_to_id?: string | null
          user_id?: string | null
        }
        Update: {
          attachment_name?: string | null
          attachment_type?: string | null
          attachment_url?: string | null
          channel?: string
          created_at?: string | null
          id?: string
          message?: string
          reply_to_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_reply_to_id_fkey"
            columns: ["reply_to_id"]
            isOneToOne: false
            referencedRelation: "chat_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      event_groups: {
        Row: {
          created_at: string | null
          event_id: string | null
          id: string
          max_players: number | null
          name: string
        }
        Insert: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          max_players?: number | null
          name: string
        }
        Update: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          max_players?: number | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_groups_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_participants: {
        Row: {
          created_at: string | null
          event_id: string | null
          group_id: string | null
          id: string
          kills: number | null
          player_id: string | null
          role: string | null
          verified: boolean | null
        }
        Insert: {
          created_at?: string | null
          event_id?: string | null
          group_id?: string | null
          id?: string
          kills?: number | null
          player_id?: string | null
          role?: string | null
          verified?: boolean | null
        }
        Update: {
          created_at?: string | null
          event_id?: string | null
          group_id?: string | null
          id?: string
          kills?: number | null
          player_id?: string | null
          role?: string | null
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "event_participants_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_participants_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "event_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_participants_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string | null
          created_by: string | null
          date: string
          description: string | null
          end_time: string | null
          id: string
          name: string
          status: string | null
          time: string
          type: Database["public"]["Enums"]["event_type"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          date: string
          description?: string | null
          end_time?: string | null
          id?: string
          name: string
          status?: string | null
          time: string
          type: Database["public"]["Enums"]["event_type"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          date?: string
          description?: string | null
          end_time?: string | null
          id?: string
          name?: string
          status?: string | null
          time?: string
          type?: Database["public"]["Enums"]["event_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      loadouts: {
        Row: {
          attachments: Json | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          is_featured: boolean | null
          is_public: boolean | null
          mode: string
          player_id: string
          updated_at: string | null
          weapon_name: string
          weapon_type: string
        }
        Insert: {
          attachments?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          is_public?: boolean | null
          mode: string
          player_id: string
          updated_at?: string | null
          weapon_name: string
          weapon_type: string
        }
        Update: {
          attachments?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          is_public?: boolean | null
          mode?: string
          player_id?: string
          updated_at?: string | null
          weapon_name?: string
          weapon_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "loadouts_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_data: Json | null
          created_at: string | null
          data: Json | null
          expires_at: string | null
          id: string
          message: string
          read: boolean | null
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          action_data?: Json | null
          created_at?: string | null
          data?: Json | null
          expires_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          action_data?: Json | null
          created_at?: string | null
          data?: Json | null
          expires_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          attendance: number | null
          avatar_url: string | null
          banking_info: Json | null
          best_gun: string | null
          br_class: string | null
          created_at: string | null
          date_joined: string | null
          device: string | null
          grade: string | null
          id: string
          ign: string
          kills: number | null
          mp_class: string | null
          player_uid: string | null
          preferred_mode: string | null
          role: Database["public"]["Enums"]["user_role"]
          social_links: Json | null
          tier: string | null
          tiktok_handle: string | null
          updated_at: string | null
          username: string
        }
        Insert: {
          attendance?: number | null
          avatar_url?: string | null
          banking_info?: Json | null
          best_gun?: string | null
          br_class?: string | null
          created_at?: string | null
          date_joined?: string | null
          device?: string | null
          grade?: string | null
          id: string
          ign?: string
          kills?: number | null
          mp_class?: string | null
          player_uid?: string | null
          preferred_mode?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          social_links?: Json | null
          tier?: string | null
          tiktok_handle?: string | null
          updated_at?: string | null
          username: string
        }
        Update: {
          attendance?: number | null
          avatar_url?: string | null
          banking_info?: Json | null
          best_gun?: string | null
          br_class?: string | null
          created_at?: string | null
          date_joined?: string | null
          device?: string | null
          grade?: string | null
          id?: string
          ign?: string
          kills?: number | null
          mp_class?: string | null
          player_uid?: string | null
          preferred_mode?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          social_links?: Json | null
          tier?: string | null
          tiktok_handle?: string | null
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      push_subscriptions: {
        Row: {
          auth_key: string
          created_at: string
          endpoint: string
          id: string
          p256dh_key: string
          updated_at: string
          user_id: string
        }
        Insert: {
          auth_key: string
          created_at?: string
          endpoint: string
          id?: string
          p256dh_key: string
          updated_at?: string
          user_id: string
        }
        Update: {
          auth_key?: string
          created_at?: string
          endpoint?: string
          id?: string
          p256dh_key?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      weapon_layouts: {
        Row: {
          created_at: string | null
          id: string
          image_name: string | null
          image_url: string | null
          is_featured: boolean | null
          mode: string
          player_id: string
          updated_at: string | null
          view_count: number | null
          weapon_name: string
          weapon_type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          image_name?: string | null
          image_url?: string | null
          is_featured?: boolean | null
          mode: string
          player_id: string
          updated_at?: string | null
          view_count?: number | null
          weapon_name: string
          weapon_type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          image_name?: string | null
          image_url?: string | null
          is_featured?: boolean | null
          mode?: string
          player_id?: string
          updated_at?: string | null
          view_count?: number | null
          weapon_name?: string
          weapon_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "weapon_layouts_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      admin_dashboard_stats: {
        Row: {
          avg_attendance: number | null
          total_events: number | null
          total_kills: number | null
          total_loadouts: number | null
          total_players: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      delete_user_completely: {
        Args: { user_id_to_delete: string }
        Returns: boolean
      }
      get_public_profiles: {
        Args: Record<PropertyKey, never>
        Returns: {
          attendance: number
          avatar_url: string
          best_gun: string
          br_class: string
          created_at: string
          date_joined: string
          device: string
          grade: string
          id: string
          ign: string
          kills: number
          mp_class: string
          player_uid: string
          preferred_mode: string
          role: Database["public"]["Enums"]["user_role"]
          tier: string
          tiktok_handle: string
          updated_at: string
          username: string
        }[]
      }
      get_user_role: {
        Args: { user_id: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
      mark_access_code_used: {
        Args: { code_input: string; email_input: string }
        Returns: boolean
      }
      update_event_status: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      validate_access_code: {
        Args: { code_input: string; email_input: string }
        Returns: boolean
      }
    }
    Enums: {
      attendance_status: "present" | "absent"
      event_type: "MP" | "BR" | "Mixed" | "Tournament" | "Scrims"
      user_role: "admin" | "player" | "moderator" | "clan_master"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      attendance_status: ["present", "absent"],
      event_type: ["MP", "BR", "Mixed", "Tournament", "Scrims"],
      user_role: ["admin", "player", "moderator", "clan_master"],
    },
  },
} as const
