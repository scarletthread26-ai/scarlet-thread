"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

export default function AccountReviewsPlaceholder() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
          My Reviews
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Read or moderate feedback you've submitted for personalized product purchases.
        </p>
      </div>

      <Card className="shadow-sm border-border">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Star className="w-5 h-5 text-primary" /> Product Feedback
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-bold mb-2">No reviews submitted</h3>
            <p className="text-sm text-muted-foreground">You haven't reviewed any customized purchases yet.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
