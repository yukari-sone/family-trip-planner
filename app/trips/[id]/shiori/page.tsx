import { createClient } from "@/lib/supabase/server";
import { ShioriClient } from "./ShioriClient";
import { notFound } from "next/navigation";

export default async function ShioriPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const supabase = await createClient();
  
  const { data: trip } = await supabase
    .from("trips")
    .select("*")
    .eq("id", id)
    .single();

  if (!trip) {
    notFound();
  }

  const { data: spots } = await supabase
    .from("trip_spots")
    .select("*")
    .eq("trip_id", id)
    .order("order_index", { ascending: true });

  return <ShioriClient trip={trip} spots={spots || []} />;
}
