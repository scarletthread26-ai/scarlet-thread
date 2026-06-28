"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AccountWishlistPlaceholder() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
          My Wishlist
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Keep track of custom items and embroidery sets you'd like to purchase later.
        </p>
      </div>

      <Card className="shadow-sm border-border">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary" /> Saved Gifts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-bold mb-2">Your wishlist is empty</h3>
            <p className="text-sm text-muted-foreground mb-6">Save items you love to view them here later.</p>
            <Link href="/products">
              <Button size="sm" className="rounded-lg shadow bg-primary hover:bg-primary/95 text-white">
                Browse Products
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
