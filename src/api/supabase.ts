import { createClient } from "@supabase/supabase-js";
import type { SectionProp } from "../libs/types";
import type { PostgrestError } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

function showError(error: PostgrestError | null, group = "") {
  if (error) {
    console.log(`Error fetching ${group} sections:`, error);
    throw new Error(error.message);
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
