import React from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { createClient } from "@/lib/supabase/server";

interface CategoryFAQProps {
  categorySlug: string;
}

export default async function CategoryFAQ({ categorySlug }: CategoryFAQProps) {
  const supabase = await createClient();
  
  const { data: faqs, error } = await supabase
    .from("faqs")
    .select("*")
    .eq("is_active", true)
    .eq("category", categorySlug)
    .order("display_order", { ascending: true });

  if (error || !faqs || faqs.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-slate-50 border-t border-slate-200/60">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-[22px] md:text-3xl font-heading font-bold text-slate-800 text-center mb-8">
          Frequently Asked <span className="text-primary">Questions</span>
        </h2>
        <Accordion className="w-full bg-white px-6 py-2 rounded-2xl shadow-sm border border-slate-100">
          {faqs.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id} className="text-primary py-2">
              <AccordionTrigger className="text-base font-semibold transition-colors hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 text-sm leading-relaxed pb-4 pt-1">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
