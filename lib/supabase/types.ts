export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.5';
  };
  public: {
    Tables: {
      consultoras: {
        Row: {
          bio: string | null;
          created_at: string;
          email: string | null;
          foto_url: string | null;
          id: string;
          instagram: string | null;
          marcas: Database['public']['Enums']['marca_revenda'][];
          nome: string;
          slug: string;
          telefone: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          bio?: string | null;
          created_at?: string;
          email?: string | null;
          foto_url?: string | null;
          id?: string;
          instagram?: string | null;
          marcas?: Database['public']['Enums']['marca_revenda'][];
          nome: string;
          slug: string;
          telefone: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          bio?: string | null;
          created_at?: string;
          email?: string | null;
          foto_url?: string | null;
          id?: string;
          instagram?: string | null;
          marcas?: Database['public']['Enums']['marca_revenda'][];
          nome?: string;
          slug?: string;
          telefone?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      pedido_items: {
        Row: {
          created_at: string;
          id: string;
          nome_snapshot: string;
          pedido_id: string;
          preco_unitario_centavos: number;
          produto_id: string | null;
          quantidade: number;
        };
        Insert: {
          created_at?: string;
          id?: string;
          nome_snapshot: string;
          pedido_id: string;
          preco_unitario_centavos: number;
          produto_id?: string | null;
          quantidade: number;
        };
        Update: {
          created_at?: string;
          id?: string;
          nome_snapshot?: string;
          pedido_id?: string;
          preco_unitario_centavos?: number;
          produto_id?: string | null;
          quantidade?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'pedido_items_pedido_id_fkey';
            columns: ['pedido_id'];
            isOneToOne: false;
            referencedRelation: 'pedidos';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'pedido_items_produto_id_fkey';
            columns: ['produto_id'];
            isOneToOne: false;
            referencedRelation: 'produtos';
            referencedColumns: ['id'];
          },
        ];
      };
      pedidos: {
        Row: {
          cliente_endereco: string | null;
          cliente_nome: string;
          cliente_whatsapp: string;
          consultora_id: string;
          created_at: string;
          id: string;
          observacoes: string | null;
          status: Database['public']['Enums']['pedido_status'];
          total_centavos: number;
          updated_at: string;
        };
        Insert: {
          cliente_endereco?: string | null;
          cliente_nome: string;
          cliente_whatsapp: string;
          consultora_id: string;
          created_at?: string;
          id?: string;
          observacoes?: string | null;
          status?: Database['public']['Enums']['pedido_status'];
          total_centavos: number;
          updated_at?: string;
        };
        Update: {
          cliente_endereco?: string | null;
          cliente_nome?: string;
          cliente_whatsapp?: string;
          consultora_id?: string;
          created_at?: string;
          id?: string;
          observacoes?: string | null;
          status?: Database['public']['Enums']['pedido_status'];
          total_centavos?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'pedidos_consultora_id_fkey';
            columns: ['consultora_id'];
            isOneToOne: false;
            referencedRelation: 'consultoras';
            referencedColumns: ['id'];
          },
        ];
      };
      produtos: {
        Row: {
          ativo: boolean;
          consultora_id: string;
          created_at: string;
          descricao: string | null;
          foto_url: string | null;
          id: string;
          marca: Database['public']['Enums']['marca_revenda'] | null;
          nome: string;
          posicao: number;
          preco_centavos: number;
          updated_at: string;
        };
        Insert: {
          ativo?: boolean;
          consultora_id: string;
          created_at?: string;
          descricao?: string | null;
          foto_url?: string | null;
          id?: string;
          marca?: Database['public']['Enums']['marca_revenda'] | null;
          nome: string;
          posicao?: number;
          preco_centavos: number;
          updated_at?: string;
        };
        Update: {
          ativo?: boolean;
          consultora_id?: string;
          created_at?: string;
          descricao?: string | null;
          foto_url?: string | null;
          id?: string;
          marca?: Database['public']['Enums']['marca_revenda'] | null;
          nome?: string;
          posicao?: number;
          preco_centavos?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'produtos_consultora_id_fkey';
            columns: ['consultora_id'];
            isOneToOne: false;
            referencedRelation: 'consultoras';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      email_por_telefone: { Args: { p_telefone: string }; Returns: string };
      is_consultora_owner: {
        Args: { consultora_uuid: string };
        Returns: boolean;
      };
      slug_disponivel: { Args: { p_slug: string }; Returns: boolean };
    };
    Enums: {
      marca_revenda:
        | 'natura'
        | 'avon'
        | 'hinode'
        | 'jequiti'
        | 'boticario'
        | 'mary_kay'
        | 'eudora'
        | 'racco'
        | 'outra';
      pedido_status: 'novo' | 'confirmado' | 'pago' | 'entregue' | 'cancelado';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  'public'
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      marca_revenda: [
        'natura',
        'avon',
        'hinode',
        'jequiti',
        'boticario',
        'mary_kay',
        'eudora',
        'racco',
        'outra',
      ],
      pedido_status: ['novo', 'confirmado', 'pago', 'entregue', 'cancelado'],
    },
  },
} as const;
