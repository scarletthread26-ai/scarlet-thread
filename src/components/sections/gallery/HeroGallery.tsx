"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Star, Heart } from "lucide-react";

export function HeroGallery() {
  return (
    <section className="relative overflow-hidden bg-[#fce8ec]">
      {/* ── Full-bleed background image ── */}
      <Image
        src="/images/gallery-hero.png"
        alt="Personalized gifts for her — premium embroidered set"
        fill
        priority
        className="object-cover object-center"
      />

      {/* Gradient overlay so left text stays readable */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, #fce8ec 0%, #fce8eccc 38%, #fce8ec88 40%, transparent 50%)",
        }}
      />

      {/* ── Content row ── */}
      <div className="relative flex min-h-[240px] flex-col md:flex-row md:min-h-[280px] lg:min-h-[300px]">
        {/* ── Left Content ── */}
        <div className="relative z-10 flex flex-[1.3] flex-col justify-center px-8 py-23 md:pl-14 md:pr-6 lg:pl-20 md:max-w-[60%]">
          {/* Badge */}
          <div className="mb-3 flex items-center gap-1.5">
            <span
              className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#8059BB]"
              style={{ fontFamily: "Pacifico, cursive" }}
            >
              {" "}
              A Gallery of Love
            </span>
            <Heart className="h-3 w-3 fill-[##8059BB] text-[#8059BB]" />
          </div>

          {/* Headline */}
          <h1 className="mb-3 font-sans text-[1.75rem] font-extrabold leading-[1.18] text-[#111] md:text-[2.2rem] lg:text-[2.6rem]">
            Real Gifts.<br />
            Real Smiles.<br />
            Real <span className="text-[#4b0082]">Memories.</span>
          </h1>

          {/* Sub-text */}
          <p className="mb-6 max-w-[360px] text-[0.78rem] leading-relaxed text-[#666] md:text-[0.82rem]">
            Every gift has a story. and every stitch holds a memory. Here&apos;s a glimpse of the love we&apos;ve helped create.
          </p>

          {/* CTA Buttons */}
          <div className="mb-6 flex flex-wrap items-center gap-2.5">
            <Link
              href="/products"
              className="inline-flex h-9 items-center rounded-[5px] border border-[#8059BB]/60  px-5 text-[0.78rem] bg-[#4b0082] text-white backdrop-blur-sm transition-all duration-200 hover:bg-[#996cdc] hover:-translate-y-px active:translate-y-0"
            >
              Explore Our Collection
              <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Helper ── */
function TrustBadge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-1.5 rounded-full bg-white/55 px-3 py-1 text-[0.7rem] font-medium text-[#444] shadow-sm backdrop-blur-sm">
      <span className="text-[#8059BB]">{icon}</span>
      <span dangerouslySetInnerHTML={{ __html: label }} />
    </div>
  );
}
