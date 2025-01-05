export type Database = {
  public: {
    Tables: {
      resumes: {
        Row: {
          id: string
          user_id: string
          resume_data: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          resume_data: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          resume_data?: any
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
} 