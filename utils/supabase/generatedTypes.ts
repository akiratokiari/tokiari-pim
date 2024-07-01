export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      orders: {
        Row: {
          building_name: string | null
          city: string
          company: string
          created_at: string
          deleted_at: string | null
          delivery_at: string | null
          delivery_code: string | null
          delivery_date: string | null
          delivery_time: string | null
          id: string
          is_delivered: boolean | null
          option: number | null
          payment_intent: string | null
          payment_status: number
          phone: string
          postal_code: string
          prefecture: string
          quantity: number
          remarks: string | null
          street_address: string
          total_price: number
          updated_at: string
          user_id: string
        }
        Insert: {
          building_name?: string | null
          city: string
          company: string
          created_at?: string
          deleted_at?: string | null
          delivery_at?: string | null
          delivery_code?: string | null
          delivery_date?: string | null
          delivery_time?: string | null
          id?: string
          is_delivered?: boolean | null
          option?: number | null
          payment_intent?: string | null
          payment_status: number
          phone: string
          postal_code: string
          prefecture: string
          quantity: number
          remarks?: string | null
          street_address: string
          total_price: number
          updated_at?: string
          user_id: string
        }
        Update: {
          building_name?: string | null
          city?: string
          company?: string
          created_at?: string
          deleted_at?: string | null
          delivery_at?: string | null
          delivery_code?: string | null
          delivery_date?: string | null
          delivery_time?: string | null
          id?: string
          is_delivered?: boolean | null
          option?: number | null
          payment_intent?: string | null
          payment_status?: number
          phone?: string
          postal_code?: string
          prefecture?: string
          quantity?: number
          remarks?: string | null
          street_address?: string
          total_price?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'orders_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      product_images: {
        Row: {
          created_at: string
          deleted_at: string | null
          id: string
          image_url: string
          product_variant_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          image_url: string
          product_variant_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          image_url?: string
          product_variant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'product_images_product_variant_id_fkey'
            columns: ['product_variant_id']
            isOneToOne: false
            referencedRelation: 'product_variants'
            referencedColumns: ['id']
          }
        ]
      }
      product_variants: {
        Row: {
          color: string
          created_at: string
          deleted_at: string | null
          id: string
          price: number
          product_id: string
          publish_status: number
          series_number: string
          updated_at: string
        }
        Insert: {
          color: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          price: number
          product_id: string
          publish_status?: number
          series_number: string
          updated_at?: string
        }
        Update: {
          color?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          price?: number
          product_id?: string
          publish_status?: number
          series_number?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'product_variants_product_id_fkey'
            columns: ['product_id']
            isOneToOne: false
            referencedRelation: 'products'
            referencedColumns: ['id']
          }
        ]
      }
      product_variants_size: {
        Row: {
          created_at: string
          deleted_at: string | null
          gtin_code: string
          id: string
          model_number: string
          product_size: string
          product_variant_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          gtin_code: string
          id?: string
          model_number: string
          product_size: string
          product_variant_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          gtin_code?: string
          id?: string
          model_number?: string
          product_size?: string
          product_variant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'product_variants_size_product_variant_id_fkey'
            columns: ['product_variant_id']
            isOneToOne: false
            referencedRelation: 'product_variants'
            referencedColumns: ['id']
          }
        ]
      }
      products: {
        Row: {
          category: string
          created_at: string
          deleted_at: string | null
          description: string
          gpc_code: string
          id: string
          jicfs_code: string
          kana: string
          product_code: string
          product_group_code: string
          publish_status: number
          sales_started_at: string
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          deleted_at?: string | null
          description: string
          gpc_code: string
          id?: string
          jicfs_code: string
          kana: string
          product_code: string
          product_group_code: string
          publish_status?: number
          sales_started_at: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          deleted_at?: string | null
          description?: string
          gpc_code?: string
          id?: string
          jicfs_code?: string
          kana?: string
          product_code?: string
          product_group_code?: string
          publish_status?: number
          sales_started_at?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      purchased_products: {
        Row: {
          created_at: string
          deleted_at: string | null
          id: string
          order_id: string
          payment_status: number
          price: number
          product_id: string
          product_variant_id: string
          product_variant_size_id: string
          quantity: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          order_id: string
          payment_status: number
          price: number
          product_id: string
          product_variant_id: string
          product_variant_size_id: string
          quantity: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          order_id?: string
          payment_status?: number
          price?: number
          product_id?: string
          product_variant_id?: string
          product_variant_size_id?: string
          quantity?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'purchased_products_order_id_fkey'
            columns: ['order_id']
            isOneToOne: false
            referencedRelation: 'orders'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'purchased_products_product_id_fkey'
            columns: ['product_id']
            isOneToOne: false
            referencedRelation: 'products'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'purchased_products_product_variant_id_fkey'
            columns: ['product_variant_id']
            isOneToOne: false
            referencedRelation: 'product_variants'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'purchased_products_product_variant_size_id_fkey'
            columns: ['product_variant_size_id']
            isOneToOne: false
            referencedRelation: 'product_variants_size'
            referencedColumns: ['id']
          }
        ]
      }
      users: {
        Row: {
          building_name: string | null
          cart_items: Json | null
          city: string
          company: string
          contact_kana: string
          contact_name: string
          created_at: string
          deleted_at: string | null
          email: string
          id: string
          permission_at: string | null
          phone: string
          plan: number | null
          postal_code: string
          prefecture: string
          site_url: string | null
          street_address: string
          updated_at: string
          user_role: number | null
        }
        Insert: {
          building_name?: string | null
          cart_items?: Json | null
          city: string
          company: string
          contact_kana: string
          contact_name: string
          created_at?: string
          deleted_at?: string | null
          email: string
          id?: string
          permission_at?: string | null
          phone: string
          plan?: number | null
          postal_code: string
          prefecture: string
          site_url?: string | null
          street_address: string
          updated_at?: string
          user_role?: number | null
        }
        Update: {
          building_name?: string | null
          cart_items?: Json | null
          city?: string
          company?: string
          contact_kana?: string
          contact_name?: string
          created_at?: string
          deleted_at?: string | null
          email?: string
          id?: string
          permission_at?: string | null
          phone?: string
          plan?: number | null
          postal_code?: string
          prefecture?: string
          site_url?: string | null
          street_address?: string
          updated_at?: string
          user_role?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_claim: {
        Args: {
          uid: string
          claim: string
        }
        Returns: string
      }
      get_claim: {
        Args: {
          uid: string
          claim: string
        }
        Returns: Json
      }
      get_claims: {
        Args: {
          uid: string
        }
        Returns: Json
      }
      get_my_claim: {
        Args: {
          claim: string
        }
        Returns: Json
      }
      get_my_claims: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      is_claims_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      set_claim: {
        Args: {
          uid: string
          claim: string
          value: Json
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, 'public'>]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views'])
  ? (PublicSchema['Tables'] & PublicSchema['Views'])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
  ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
  ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends keyof PublicSchema['Enums'] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
  ? PublicSchema['Enums'][PublicEnumNameOrOptions]
  : never
