-- ============================================================
-- Supabase setup
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- 1. Create table
create table public.products (
  id           integer  primary key,
  slug         text     not null unique,
  title        text     not null,
  subtitle     text     not null default '',
  description  text     not null default '',
  note         text     not null default '',
  material     text     not null default '',
  image        text     not null default '',
  price        integer  not null default 0,
  "forSale"    boolean  not null default true,
  "stripeLink" text     not null default '',
  "externalLink" text,
  sold         boolean  not null default false
);

-- 2. Enable Row Level Security and allow public read-only access
alter table public.products enable row level security;

create policy "Public read access"
  on public.products
  for select
  using (true);

-- 3. Seed with sample data
insert into public.products
  (id, slug, title, subtitle, description, note, material, image, price, "forSale", "stripeLink", sold)
values
  (1, 'yggdrasil', 'Yggdrasil', 'The World Tree',
   'The World Tree Yggdrasil sustains the entire cosmos. The eagle Hræsvelgr perches at the crown, the squirrel Ratatöskr scurries along the trunk, and the dragon Níðhöggr gnaws at the roots. A runic band spirals around the entire piece, carrying text from the Elder Edda.',
   '', 'Acrylic on wood', '/images/01-yggdrasil.png', 360, true, '#stripe-yggdrasil', true),

  (2, 'tvenne-ormar', 'Two Serpents', 'Urnes style on green',
   'Two serpents in classic Urnes style coil around each other against a deep green background. The red and the golden serpent form an ever-returning flow – life and death as one. Runic inscription runs along the body.',
   '', 'Acrylic and pyrography on wood', '/images/02-tvenne-ormar.png', 210, true, '#stripe-tvenne-ormar', true),

  (3, 'drakrunsten', 'Dragon Runestone', 'Runestone in black',
   'A stylised runestone in black bearing a powerful dragon in red and gold. Inspired by authentic 11th-century runestones. The runic inscription winds along the dragon''s body in a complex Viking Age interlace pattern.',
   '', 'Acrylic on wood panel in runestone shape', '/images/03-drakrunsten.png', 430, true, '#stripe-drakrunsten', true),

  (4, 'hjartormar', 'Heart Serpents', 'Love in red and gold',
   'Two serpents intertwine to form a heart against a red background. The runic band carries a text on love and oath-binding drawn from the skaldic tradition. One of the more personal compositions in the collection.',
   '', 'Acrylic on wood', '/images/04-hjartormar.png', 170, true, '#stripe-hjartormar', true),

  (5, 'nidhogr', 'Níðhöggr', 'The serpent eye in the dark',
   'The great world-serpent rests in the darkness, its glowing eye fixed outward. The composition draws on Völuspá''s description of Níðhöggr at the end of time. The runic band encircles the piece in an unbroken ring.',
   '', 'Acrylic and pyrography on wood', '/images/05-nidhogr.png', 250, true, '#stripe-nidhogr', true),

  (6, 'tvahovdad', 'Twin-Headed', 'Dragon in red and gold on black',
   'A twin-headed dragon coils in classic Viking Age style against a jet-black background. The red and golden lines form a complex pattern of knots and loops. Runic inscription runs along the body.',
   '', 'Acrylic on wood', '/images/06-tvahovdad.png', 190, true, '#stripe-tvahovdad', true),

  (7, 'kosmiskt-oga', 'Cosmic Eye', 'From the blue depths',
   'A mystical composition in blue with a cosmic eye at its centre, surrounded by writhing forms and runes. The piece raises questions about sight, consciousness, and the hidden – themes deeply rooted in Norse mythology.',
   '', 'Acrylic on wood', '/images/07-kosmiskt-oga.png', 180, true, '#stripe-kosmiskt-oga', true),

  (8, 'stendrak', 'Stone Dragon', 'Serpent and stone on green',
   'A serpent coils around a grey-black stone against a dark green background. The knotwork at the edges evokes the great runestone monuments. Among the more intimate and contemplative pieces in the collection.',
   '', 'Acrylic and pyrography on wood', '/images/08-stendrak.png', 230, true, '#stripe-stendrak', true),

  (9, 'fenrir', 'Fenrir', 'The wolf on red',
   'Fenrir – the greatest foe of the Æsir and son of Loki – emerges in silver and grey against blood red. The shaped wooden panel reinforces the sense of a living creature breaking free from the frame. The runes carry his name and fate.',
   '', 'Acrylic on shaped wood panel', '/images/09-fenrir.png', 305, true, '#stripe-fenrir', true),

  (10, 'seidkona', 'Seiðkona', 'The völva''s vision',
   'A woman in a blue robe holds a staff, summoned forth by the serpent''s runes. The motif draws on the völva figure of Völuspá – the seeress who sees beyond the limits of time. The runic band carries her prophecy.',
   '', 'Pyrography and acrylic on wood', '/images/10-seidkona.png', 265, true, '#stripe-seidkona', true),

  (11, 'hjortdraken', 'The Antlered Dragon', 'Three bands in gold, red and blue',
   'A large composition in grey, red and blue featuring a dragon whose head bears antler-like horns. Three intertwined runic bands run through the piece. The motif alludes to the Celtic and Norse influences that converged during the Viking Age.',
   '', 'Acrylic on wood, large format', '/images/11-hjortdraken.png', 525, true, '#stripe-hjortdraken', true),

  (12, 'draupnir', 'Draupnir', 'The ring-serpent',
   'A serpent with a glowing blue eye coils around Odin''s gold ring Draupnir. The vivid red body against the black background creates a striking contrast. The runic band carries a text on eternal return.',
   '', 'Acrylic on wood', '/images/12-draupnir.png', 250, true, '#stripe-draupnir', true),

  (13, 'vikingataget', 'The Viking Journey', 'Frieze with beasts and runes',
   'A long horizontal frieze with animals, interlace and runes in deep green and gold. One of the most detailed pieces in the collection – it tells of a journey. The animals are drawn from Eddic symbolism and move left to right in an endless procession.',
   '', 'Acrylic and pyrography on wood, long format', '/images/13-vikingataget.png', 665, true, 'https://buy.stripe.com/test_eVq6oG54H5lG9440g64Vy00', false),

  (14, 'bla-ormflata', 'Blue Serpent Braid', 'Two serpents on royal blue',
   'Two serpents – one green, one bone-white – intertwine against a deep blue background. The knotwork in the corners and the red eyes give the piece life and movement. The encircling runic band carries text from Hávamál.',
   '', 'Acrylic on wood', '/images/14-bla-ormflata.png', 230, true, '#stripe-bla-ormflata', true);
