import { createClient } from "@supabase/supabase-js";
import type { SectionProp } from "../libs/types";
import type { PostgrestError } from "@supabase/supabase-js";

const superBaseURL = "https://cioerpzwuxotdvvimjva.supabase.co";
const superBaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpb2VycHp3dXhvdGR2dmltanZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzMDE1MTMsImV4cCI6MjA4NDg3NzUxM30.mAnTYfIXq3_isahsKzdIEdz80OUo1eg-w-00X-ktKCk";

export const supabase = createClient(superBaseURL, superBaseAnonKey);

function showError(error: PostgrestError | null, group = "") {
  if (error) {
    console.log(`Error fetching ${group} sections:`, error);
    throw error;
  }
}

//Read

export async function fetchSections(): Promise<SectionProp[]> {
  const { data, error } = await supabase
    .from("sections")
    .select("*")
    .order("created_at", { ascending: true });

  showError(error);

  return data || [];
}

//create

export async function createSection(
  section: Omit<SectionProp, "id">,
): Promise<SectionProp> {
  const { data, error } = await supabase
    .from("sections")
    .insert([
      { name: section.name, color: section.color, details: section.details },
    ])
    .select()
    .single();

  showError(error, "creating");

  return data;
}

//update

export async function updateSection(
  id: string,
  updates: Partial<SectionProp>,
): Promise<SectionProp> {
  const { data, error } = await supabase
    .from("sections")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  showError(error, "updating");

  return data;
}

//delete

export async function deleteSections(id: string): Promise<void> {
  const { error } = await supabase.from("sections").delete().eq("id", id);

  showError(error, "deleting");
}
