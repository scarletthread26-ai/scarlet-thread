import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { HeroSlide, Banner, Testimonial, CMSPage } from "@/types";
import { toast } from "sonner";

// 1. Hero Slides Hooks
export function useHeroSlides() {
  return useQuery<HeroSlide[]>({
    queryKey: ["cms", "hero-slides"],
    queryFn: async () => {
      const res = await fetch("/api/admin/cms/hero-slides");
      if (!res.ok) throw new Error("Failed to fetch hero slides");
      return res.json();
    },
  });
}

export function useSaveHeroSlides() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (slides: any[]) => {
      const res = await fetch("/api/admin/cms/hero-slides", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(slides),
      });
      if (!res.ok) throw new Error("Failed to save hero slides");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cms", "hero-slides"] });
      toast.success("Hero slides updated successfully!");
    },
  });
}

// 2. Banners Hooks
export function useBanners() {
  return useQuery<Banner[]>({
    queryKey: ["cms", "banners"],
    queryFn: async () => {
      const res = await fetch("/api/admin/cms/banners");
      if (!res.ok) throw new Error("Failed to fetch banners");
      return res.json();
    },
  });
}

export function useSaveBanners() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (banners: any[]) => {
      const res = await fetch("/api/admin/cms/banners", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(banners),
      });
      if (!res.ok) throw new Error("Failed to save banners");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cms", "banners"] });
      toast.success("Banners updated successfully!");
    },
  });
}

// 3. Testimonials Hooks
export function useTestimonials() {
  return useQuery<Testimonial[]>({
    queryKey: ["cms", "testimonials"],
    queryFn: async () => {
      const res = await fetch("/api/admin/cms/testimonials");
      if (!res.ok) throw new Error("Failed to fetch testimonials");
      return res.json();
    },
  });
}

export function useCreateTestimonial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/admin/cms/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create testimonial");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cms", "testimonials"] });
      toast.success("Testimonial added successfully!");
    },
  });
}

export function useUpdateTestimonial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await fetch(`/api/admin/cms/testimonials/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update testimonial");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cms", "testimonials"] });
      toast.success("Testimonial updated successfully!");
    },
  });
}

export function useDeleteTestimonial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/cms/testimonials/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete testimonial");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cms", "testimonials"] });
      toast.success("Testimonial deleted successfully!");
    },
  });
}

// 4. Static Pages Hooks
export function useCMSPages() {
  return useQuery<CMSPage[]>({
    queryKey: ["cms", "pages"],
    queryFn: async () => {
      const res = await fetch("/api/admin/cms/pages");
      if (!res.ok) throw new Error("Failed to fetch legal pages");
      return res.json();
    },
  });
}

export function useCMSPage(slug: string) {
  return useQuery<CMSPage>({
    queryKey: ["cms", "pages", slug],
    queryFn: async () => {
      const res = await fetch(`/api/admin/cms/pages/${slug}`);
      if (!res.ok) throw new Error("Failed to fetch page details");
      return res.json();
    },
    enabled: !!slug,
  });
}

export function useUpdateCMSPage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ slug, data }: { slug: string; data: any }) => {
      const res = await fetch(`/api/admin/cms/pages/${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update page");
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["cms", "pages"] });
      queryClient.invalidateQueries({ queryKey: ["cms", "pages", data.slug] });
      toast.success("Static page saved successfully!");
    },
  });
}
