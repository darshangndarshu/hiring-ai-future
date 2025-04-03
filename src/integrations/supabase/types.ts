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
      ai_hiring_recommendations: {
        Row: {
          alternative_roles: string | null
          candidate_id: number | null
          cultural_fit_score: number | null
          diversity_tracker: Json | null
          hiring_potential: string | null
          job_id: number | null
          recommendation_id: number
          recommended_training: string | null
        }
        Insert: {
          alternative_roles?: string | null
          candidate_id?: number | null
          cultural_fit_score?: number | null
          diversity_tracker?: Json | null
          hiring_potential?: string | null
          job_id?: number | null
          recommendation_id?: number
          recommended_training?: string | null
        }
        Update: {
          alternative_roles?: string | null
          candidate_id?: number | null
          cultural_fit_score?: number | null
          diversity_tracker?: Json | null
          hiring_potential?: string | null
          job_id?: number | null
          recommendation_id?: number
          recommended_training?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_hiring_recommendations_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "ai_hiring_recommendations_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "job_postings"
            referencedColumns: ["job_id"]
          },
        ]
      }
      ai_interviews: {
        Row: {
          candidate_id: number | null
          chatbot_responses: Json | null
          gamified_assessment_score: number | null
          interview_id: number
          job_id: number | null
          language_proficiency: string | null
          sentiment_score: number | null
          video_analysis: Json | null
        }
        Insert: {
          candidate_id?: number | null
          chatbot_responses?: Json | null
          gamified_assessment_score?: number | null
          interview_id?: number
          job_id?: number | null
          language_proficiency?: string | null
          sentiment_score?: number | null
          video_analysis?: Json | null
        }
        Update: {
          candidate_id?: number | null
          chatbot_responses?: Json | null
          gamified_assessment_score?: number | null
          interview_id?: number
          job_id?: number | null
          language_proficiency?: string | null
          sentiment_score?: number | null
          video_analysis?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_interviews_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "ai_interviews_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "job_postings"
            referencedColumns: ["job_id"]
          },
        ]
      }
      ai_screening_scores: {
        Row: {
          bias_free_score: number | null
          candidate_id: number | null
          job_id: number | null
          predictive_fit_score: number | null
          resume_match_score: number | null
          score_id: number
          skill_match_score: number | null
          total_score: number | null
        }
        Insert: {
          bias_free_score?: number | null
          candidate_id?: number | null
          job_id?: number | null
          predictive_fit_score?: number | null
          resume_match_score?: number | null
          score_id?: number
          skill_match_score?: number | null
          total_score?: number | null
        }
        Update: {
          bias_free_score?: number | null
          candidate_id?: number | null
          job_id?: number | null
          predictive_fit_score?: number | null
          resume_match_score?: number | null
          score_id?: number
          skill_match_score?: number | null
          total_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_screening_scores_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "ai_screening_scores_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "job_postings"
            referencedColumns: ["job_id"]
          },
        ]
      }
      blockchain_verification: {
        Row: {
          candidate_id: number | null
          credential_status: string | null
          resume_hash: string | null
          smart_contract_status: string | null
          verification_id: number
          verification_timestamp: string | null
        }
        Insert: {
          candidate_id?: number | null
          credential_status?: string | null
          resume_hash?: string | null
          smart_contract_status?: string | null
          verification_id?: number
          verification_timestamp?: string | null
        }
        Update: {
          candidate_id?: number | null
          credential_status?: string | null
          resume_hash?: string | null
          smart_contract_status?: string | null
          verification_id?: number
          verification_timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blockchain_verification_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["candidate_id"]
          },
        ]
      }
      candidates: {
        Row: {
          candidate_id: number
          created_at: string | null
          email: string | null
          first_name: string | null
          last_name: string | null
          linkedin_profile: string | null
          location: string | null
          phone: string | null
          portfolio_url: string | null
        }
        Insert: {
          candidate_id?: number
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          last_name?: string | null
          linkedin_profile?: string | null
          location?: string | null
          phone?: string | null
          portfolio_url?: string | null
        }
        Update: {
          candidate_id?: number
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          last_name?: string | null
          linkedin_profile?: string | null
          location?: string | null
          phone?: string | null
          portfolio_url?: string | null
        }
        Relationships: []
      }
      future_ai_features: {
        Row: {
          ai_career_mentor_feedback: string | null
          ai_hiring_coach_suggestions: string | null
          attrition_prediction: number | null
          behavioral_analysis: Json | null
          blockchain_verification_status: string | null
          candidate_id: number | null
          feature_id: number
          job_id: number | null
          market_insights: Json | null
          skill_gap_analysis: string | null
        }
        Insert: {
          ai_career_mentor_feedback?: string | null
          ai_hiring_coach_suggestions?: string | null
          attrition_prediction?: number | null
          behavioral_analysis?: Json | null
          blockchain_verification_status?: string | null
          candidate_id?: number | null
          feature_id?: number
          job_id?: number | null
          market_insights?: Json | null
          skill_gap_analysis?: string | null
        }
        Update: {
          ai_career_mentor_feedback?: string | null
          ai_hiring_coach_suggestions?: string | null
          attrition_prediction?: number | null
          behavioral_analysis?: Json | null
          blockchain_verification_status?: string | null
          candidate_id?: number | null
          feature_id?: number
          job_id?: number | null
          market_insights?: Json | null
          skill_gap_analysis?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "future_ai_features_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "future_ai_features_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "job_postings"
            referencedColumns: ["job_id"]
          },
        ]
      }
      job_postings: {
        Row: {
          company_name: string | null
          experience_level: string | null
          job_description: string | null
          job_id: number
          job_title: string | null
          location: string | null
          posted_at: string | null
          required_skills: string | null
        }
        Insert: {
          company_name?: string | null
          experience_level?: string | null
          job_description?: string | null
          job_id?: number
          job_title?: string | null
          location?: string | null
          posted_at?: string | null
          required_skills?: string | null
        }
        Update: {
          company_name?: string | null
          experience_level?: string | null
          job_description?: string | null
          job_id?: number
          job_title?: string | null
          location?: string | null
          posted_at?: string | null
          required_skills?: string | null
        }
        Relationships: []
      }
      resumes: {
        Row: {
          achievements: string | null
          candidate_id: number | null
          certifications: string | null
          education: string | null
          experience: string | null
          parsed_data: Json | null
          resume_id: number
          skills: string | null
        }
        Insert: {
          achievements?: string | null
          candidate_id?: number | null
          certifications?: string | null
          education?: string | null
          experience?: string | null
          parsed_data?: Json | null
          resume_id?: number
          skills?: string | null
        }
        Update: {
          achievements?: string | null
          candidate_id?: number | null
          certifications?: string | null
          education?: string | null
          experience?: string | null
          parsed_data?: Json | null
          resume_id?: number
          skills?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resumes_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["candidate_id"]
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
      [_ in never]: never
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
