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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      order_items: {
        Row: {
          id: string
          length_meters: number | null
          order_id: string | null
          product_id: string | null
          quantity: number | null
          selected_color: string | null
          selected_finish: string | null
          selected_gauge: number | null
          subtotal: number
          unit_price: number
        }
        Insert: {
          id?: string
          length_meters?: number | null
          order_id?: string | null
          product_id?: string | null
          quantity?: number | null
          selected_color?: string | null
          selected_finish?: string | null
          selected_gauge?: number | null
          subtotal: number
          unit_price: number
        }
        Update: {
          id?: string
          length_meters?: number | null
          order_id?: string | null
          product_id?: string | null
          quantity?: number | null
          selected_color?: string | null
          selected_finish?: string | null
          selected_gauge?: number | null
          subtotal?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          admin_notes: string | null
          created_at: string | null
          customer_name: string
          id: string
          location: string
          order_number: string
          payment_method: Database["public"]["Enums"]["payment_method"] | null
          payment_preference:
            | Database["public"]["Enums"]["payment_preference"]
            | null
          phone: string
          status: Database["public"]["Enums"]["order_status"] | null
          updated_at: string | null
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string | null
          customer_name: string
          id?: string
          location: string
          order_number: string
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          payment_preference?:
            | Database["public"]["Enums"]["payment_preference"]
            | null
          phone: string
          status?: Database["public"]["Enums"]["order_status"] | null
          updated_at?: string | null
        }
        Update: {
          admin_notes?: string | null
          created_at?: string | null
          customer_name?: string
          id?: string
          location?: string
          order_number?: string
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          payment_preference?:
            | Database["public"]["Enums"]["payment_preference"]
            | null
          phone?: string
          status?: Database["public"]["Enums"]["order_status"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          available_colors: string[] | null
          available_finishes: string[] | null
          available_gauges: number[] | null
          base_unit: string | null
          category: string
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          price_per_gauge: Json | null
          slug: string
        }
        Insert: {
          available_colors?: string[] | null
          available_finishes?: string[] | null
          available_gauges?: number[] | null
          base_unit?: string | null
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          price_per_gauge?: Json | null
          slug: string
        }
        Update: {
          available_colors?: string[] | null
          available_finishes?: string[] | null
          available_gauges?: number[] | null
          base_unit?: string | null
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          price_per_gauge?: Json | null
          slug?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          full_name: string
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"] | null
        }
        Insert: {
          created_at?: string | null
          full_name: string
          id: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
        }
        Update: {
          created_at?: string | null
          full_name?: string
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
        }
        Relationships: []
      }
      quote_items: {
        Row: {
          description: string
          id: string
          length_meters: number | null
          product_id: string | null
          quantity: number | null
          quote_id: string | null
          selected_color: string | null
          selected_finish: string | null
          selected_gauge: number | null
          subtotal: number
          unit_price: number
        }
        Insert: {
          description: string
          id?: string
          length_meters?: number | null
          product_id?: string | null
          quantity?: number | null
          quote_id?: string | null
          selected_color?: string | null
          selected_finish?: string | null
          selected_gauge?: number | null
          subtotal: number
          unit_price: number
        }
        Update: {
          description?: string
          id?: string
          length_meters?: number | null
          product_id?: string | null
          quantity?: number | null
          quote_id?: string | null
          selected_color?: string | null
          selected_finish?: string | null
          selected_gauge?: number | null
          subtotal?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "quote_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_items_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          balance_amount: number | null
          created_at: string | null
          customer_name: string
          customer_notes: string | null
          date_issued: string | null
          delivery_fee: number | null
          deposit_amount: number | null
          discount_amount: number | null
          email: string | null
          grand_total: number | null
          id: string
          internal_notes: string | null
          location: string | null
          order_id: string | null
          payment_instructions: string | null
          payment_preference:
            | Database["public"]["Enums"]["payment_preference"]
            | null
          pdf_url: string | null
          phone: string
          quote_number: string
          status: Database["public"]["Enums"]["quote_status"] | null
          subtotal: number | null
          terms_and_conditions: string | null
          updated_at: string | null
          valid_until: string | null
          vat_amount: number | null
        }
        Insert: {
          balance_amount?: number | null
          created_at?: string | null
          customer_name: string
          customer_notes?: string | null
          date_issued?: string | null
          delivery_fee?: number | null
          deposit_amount?: number | null
          discount_amount?: number | null
          email?: string | null
          grand_total?: number | null
          id?: string
          internal_notes?: string | null
          location?: string | null
          order_id?: string | null
          payment_instructions?: string | null
          payment_preference?:
            | Database["public"]["Enums"]["payment_preference"]
            | null
          pdf_url?: string | null
          phone: string
          quote_number: string
          status?: Database["public"]["Enums"]["quote_status"] | null
          subtotal?: number | null
          terms_and_conditions?: string | null
          updated_at?: string | null
          valid_until?: string | null
          vat_amount?: number | null
        }
        Update: {
          balance_amount?: number | null
          created_at?: string | null
          customer_name?: string
          customer_notes?: string | null
          date_issued?: string | null
          delivery_fee?: number | null
          deposit_amount?: number | null
          discount_amount?: number | null
          email?: string | null
          grand_total?: number | null
          id?: string
          internal_notes?: string | null
          location?: string | null
          order_id?: string | null
          payment_instructions?: string | null
          payment_preference?:
            | Database["public"]["Enums"]["payment_preference"]
            | null
          pdf_url?: string | null
          phone?: string
          quote_number?: string
          status?: Database["public"]["Enums"]["quote_status"] | null
          subtotal?: number | null
          terms_and_conditions?: string | null
          updated_at?: string | null
          valid_until?: string | null
          vat_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "quotes_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      finish_type: "matte" | "gloss" | "aluzinc"
      order_status:
        | "new"
        | "contacted"
        | "confirmed"
        | "in_transit"
        | "delivered"
        | "cancelled"
      payment_method: "mpesa" | "bank_transfer" | "cash" | "not_specified"
      payment_preference: "full_payment" | "lipa_pole_pole"
      quote_status: "draft" | "sent" | "accepted" | "rejected" | "expired"
      user_role: "admin"
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
      finish_type: ["matte", "gloss", "aluzinc"],
      order_status: [
        "new",
        "contacted",
        "confirmed",
        "in_transit",
        "delivered",
        "cancelled",
      ],
      payment_method: ["mpesa", "bank_transfer", "cash", "not_specified"],
      payment_preference: ["full_payment", "lipa_pole_pole"],
      quote_status: ["draft", "sent", "accepted", "rejected", "expired"],
      user_role: ["admin"],
    },
  },
} as const
