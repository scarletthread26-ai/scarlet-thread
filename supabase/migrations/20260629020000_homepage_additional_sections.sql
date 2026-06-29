-- Seeding homepage and category landing sections settings

INSERT INTO public.homepage_sections (section_key, title, subtitle, content, is_active)
VALUES (
  'about',
  'Discover The Scarlet Thread',
  'Bringing Your Gift Ideas To Life',
  '{
    "description": "At Scarlet, we believe the most meaningful gifts are the ones created with love, thought and personal touch. Whether it''s a heartfelt gift for him, a thoughtful gift for her, a precious keepsake for a new born, a surprise gift for a toddler or unforgettable baby shower gifts, we turn emotions into meaningful gifts that hold memories forever.",
    "button_text": "Read Our Story",
    "button_link": "/about",
    "images": [
      "/images/scarlet-about5.png",
      "/images/scarlet-about.png",
      "/images/scarlet-about1.png",
      "/images/scarlet-about2.png",
      "/images/scarlet-about3.png",
      "/images/scarlet-about4.png"
    ]
  }'::jsonb,
  true
), (
  'featured-products',
  'Our Most Loved Gifts',
  'Carefully selected and thoughtfully crafted to bring joy, create meaningful connections, and make every moment feel extra special.',
  '{
    "product_ids": []
  }'::jsonb,
  true
), (
  'gifts-for-him',
  'Make Every Gift Personal',
  'Thoughtfully embroidered gifts for husbands, boyfriends, fathers, brothers and best friends.',
  '{
    "image_desktop": "/images/forhimpage/scarlet-forhimbanner.png",
    "image_mobile": "/images/forhimpage/scarlet-mobilebanner.png"
  }'::jsonb,
  true
), (
  'gifts-for-her',
  'Made for Her, Personalized with Love',
  'Thoughtful, personalized & embroidered gifts that celebrate the most special women in your life.',
  '{
    "image_desktop": "/images/forher/scarlet-forherbanner-image.png",
    "image_mobile": "/images/forher/scarlet-forhermobile.png"
  }'::jsonb,
  true
), (
  'kids-babies',
  'Little Moments, Made Personal',
  'Adorable embroidered gifts for your little ones, stitched with love and care.',
  '{
    "image_desktop": "/images/scrlet-babiesbanne.png",
    "image_mobile": "/images/scrlet-babiesbanne.png"
  }'::jsonb,
  true
), (
  'cta',
  'Ready to Make Someone Smile?',
  'Create a gift that will be remembered forever',
  '{
    "button_text": "Start Personalizing Now",
    "button_link": "/products",
    "image_url": "/images/scarlet-couple.png"
  }'::jsonb,
  true
), (
  'google-reviews',
  'Google Business Reviews',
  'Real stories from real customers',
  '{
    "place_id": "",
    "api_key": ""
  }'::jsonb,
  true
), (
  'how-it-works',
  'Creating Your Perfect Custom Gift',
  'The simple path to personalized gifting excellence',
  '{
    "steps": [
      {
        "number": "1",
        "title": "Choose Your Product",
        "description": "Find your favorite base product and complete secure payment to lock in your order.",
        "image": "/images/heropage/scarlet-heartbag.png"
      },
      {
        "number": "2",
        "title": "WhatsApp Us Details",
        "description": "Check your email confirmation for your order details and share your design idea with us on WhatsApp.",
        "image": "/images/heropage/scarlet-phone.png"
      },
      {
        "number": "3",
        "title": "Mockup & Approval",
        "description": "We create a realistic digital mockup for your review. Give us your final thumbs up before we craft!",
        "image": "/images/heropage/scarlet-laptop.png"
      },
      {
        "number": "4",
        "title": "We Craft & Ship",
        "description": "Once approved, our team creates your unique gift with care and ships it straight to your doorstep.",
        "image": "/images/heropage/scarlet-delivery.png"
      }
    ]
  }'::jsonb,
  true
)
ON CONFLICT (section_key) DO UPDATE SET title = EXCLUDED.title, subtitle = EXCLUDED.subtitle, content = EXCLUDED.content;
