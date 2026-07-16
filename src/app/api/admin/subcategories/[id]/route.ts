import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { deleteFromCloudinary } from "@/lib/cloudinary";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const body = await request.json();

    // If image_url is provided, clean up the old image from Cloudinary if it has changed
    if (body.image_url !== undefined) {
      const { data: oldSubcategory } = await supabase
        .from("categories")
        .select("image_url")
        .eq("id", id)
        .single();

      if (oldSubcategory && oldSubcategory.image_url && oldSubcategory.image_url !== body.image_url) {
        try {
          await deleteFromCloudinary(oldSubcategory.image_url);
        } catch (e) {
          console.error("Failed to delete subcategory image from Cloudinary during update:", e);
        }
      }
    }

    const { data, error } = await supabase
      .from("categories")
      .update(body)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Supabase subcategory update failed:", error.message || error);
    return NextResponse.json(
      { error: "Failed to update subcategory" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Fetch the subcategory image_url to delete it from Cloudinary
    const { data: subcategory } = await supabase
      .from("categories")
      .select("image_url")
      .eq("id", id)
      .single();

    if (subcategory && subcategory.image_url) {
      try {
        await deleteFromCloudinary(subcategory.image_url);
      } catch (e) {
        console.error("Failed to delete subcategory image from Cloudinary:", e);
      }
    }

    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    console.error("Supabase subcategory deletion failed:", error.message || error);
    return NextResponse.json(
      { error: "Failed to delete subcategory" },
      { status: 500 }
    );
  }
}
