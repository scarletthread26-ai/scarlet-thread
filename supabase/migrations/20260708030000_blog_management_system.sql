-- =========================================================================
-- Scarlet Thread Blog Management System Migration
-- =========================================================================

-- 1. Table: blog_categories
CREATE TABLE IF NOT EXISTS public.blog_categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name varchar(100) NOT NULL,
  slug varchar(100) UNIQUE NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Table: blogs
CREATE TABLE IF NOT EXISTS public.blogs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title varchar(255) NOT NULL,
  slug varchar(255) UNIQUE NOT NULL,
  excerpt text,
  content text NOT NULL,
  featured_image text,
  featured_image_alt text,
  author varchar(100) NOT NULL,
  category_id uuid REFERENCES public.blog_categories(id) ON DELETE SET NULL,
  status varchar(50) DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  featured boolean DEFAULT false,
  reading_time integer DEFAULT 0,
  seo_title varchar(255),
  seo_description text,
  seo_keywords text,
  published_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Table: blog_tags
CREATE TABLE IF NOT EXISTS public.blog_tags (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name varchar(100) UNIQUE NOT NULL,
  slug varchar(100) UNIQUE NOT NULL
);

-- 4. Table: blog_tag_relations
CREATE TABLE IF NOT EXISTS public.blog_tag_relations (
  blog_id uuid REFERENCES public.blogs(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES public.blog_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (blog_id, tag_id)
);

-- Enable RLS
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_tag_relations ENABLE ROW LEVEL SECURITY;

-- =========================================================================
-- Row Level Security (RLS) Policies
-- =========================================================================

-- Select policies (Public select access)
CREATE POLICY "Public can view blog categories" ON public.blog_categories
  FOR SELECT USING (true);

CREATE POLICY "Public can view published blogs" ON public.blogs
  FOR SELECT USING (status = 'published');

CREATE POLICY "Public can view blog tags" ON public.blog_tags
  FOR SELECT USING (true);

CREATE POLICY "Public can view blog tag relations" ON public.blog_tag_relations
  FOR SELECT USING (true);

-- Admin SELECT policy to view drafts
CREATE POLICY "Admins can view all blogs" ON public.blogs
  FOR SELECT TO authenticated USING (public.is_admin());

-- Admin CRUD write policies (All access for authenticated admins)
CREATE POLICY "Admins have full access to blog categories" ON public.blog_categories
  FOR ALL TO authenticated USING (public.is_admin());

CREATE POLICY "Admins have full access to blogs" ON public.blogs
  FOR ALL TO authenticated USING (public.is_admin());

CREATE POLICY "Admins have full access to blog tags" ON public.blog_tags
  FOR ALL TO authenticated USING (public.is_admin());

CREATE POLICY "Admins have full access to blog tag relations" ON public.blog_tag_relations
  FOR ALL TO authenticated USING (public.is_admin());

-- =========================================================================
-- Initial Seed Data
-- =========================================================================

-- Seed Categories
INSERT INTO public.blog_categories (name, slug) VALUES
  ('Gift Ideas', 'gift-ideas'),
  ('Personalized Gifts', 'personalized-gifts'),
  ('Baby Gifts', 'baby-gifts'),
  ('Embroidery Tips', 'embroidery-tips'),
  ('Customer Stories', 'customer-stories'),
  ('Announcements', 'announcements')
ON CONFLICT (slug) DO NOTHING;

-- Seed Tags
INSERT INTO public.blog_tags (name, slug) VALUES
  ('Gift', 'gift'),
  ('Birthday', 'birthday'),
  ('Baby', 'baby'),
  ('Embroidery', 'embroidery'),
  ('Personalized', 'personalized'),
  ('Hoodie', 'hoodie'),
  ('Wedding', 'wedding'),
  ('UAE', 'uae')
ON CONFLICT (slug) DO NOTHING;
