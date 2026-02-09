/**
 * Supabase Database type definitions.
 * These match the schema defined in supabase/schema.sql.
 */
export interface Database {
  public: {
    Tables: {
      gallery_items: {
        Row: {
          id: string;
          title: string | null;
          description: string | null;
          image_url: string;
          display_order: number;
          size: 'large' | 'medium' | 'small';
          column_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title?: string | null;
          description?: string | null;
          image_url: string;
          display_order?: number;
          size?: 'large' | 'medium' | 'small';
          column_index?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string | null;
          description?: string | null;
          image_url?: string;
          display_order?: number;
          size?: 'large' | 'medium' | 'small';
          column_index?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      site_content: {
        Row: {
          id: string;
          key: string;
          value: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          value: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          key?: string;
          value?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      commission_sections: {
        Row: {
          id: string;
          section_type: 'status' | 'intro' | 'services' | 'pricing' | 'steps' | 'faq' | 'links';
          title: string;
          content: Record<string, unknown>;
          display_order: number;
          visible: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          section_type: 'status' | 'intro' | 'services' | 'pricing' | 'steps' | 'faq' | 'links';
          title: string;
          content: Record<string, unknown>;
          display_order?: number;
          visible?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          section_type?: 'status' | 'intro' | 'services' | 'pricing' | 'steps' | 'faq' | 'links';
          title?: string;
          content?: Record<string, unknown>;
          display_order?: number;
          visible?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

/** Convenience type aliases */
export type GalleryItem = Database['public']['Tables']['gallery_items']['Row'];
export type GalleryItemInsert = Database['public']['Tables']['gallery_items']['Insert'];
export type GalleryItemUpdate = Database['public']['Tables']['gallery_items']['Update'];

export type SiteContent = Database['public']['Tables']['site_content']['Row'];
export type SiteContentInsert = Database['public']['Tables']['site_content']['Insert'];
export type SiteContentUpdate = Database['public']['Tables']['site_content']['Update'];

export type CommissionSection = Database['public']['Tables']['commission_sections']['Row'];
export type CommissionSectionInsert = Database['public']['Tables']['commission_sections']['Insert'];
export type CommissionSectionUpdate = Database['public']['Tables']['commission_sections']['Update'];
