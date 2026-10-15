insert into public.services (
  slug,
  category,
  title,
  summary,
  description,
  sort_order,
  status
)
values
  (
    'residential-cleaning',
    'residential',
    'Residential cleaning',
    'A home-cleaning service option. Confirm service details with the business.',
    'This demo listing is sample content only. Final cleaning scope, availability, and details must be confirmed with the business.',
    1,
    'published'
  ),
  (
    'commercial-cleaning',
    'commercial',
    'Commercial cleaning',
    'A workplace-cleaning service option. Confirm service details with the business.',
    'This demo listing is sample content only. Final cleaning scope, availability, and details must be confirmed with the business.',
    2,
    'published'
  ),
  (
    'deep-cleaning',
    'deep',
    'Deep cleaning',
    'A detailed cleaning service option. Confirm service details with the business.',
    'This demo listing is sample content only. Final cleaning scope, availability, and details must be confirmed with the business.',
    3,
    'published'
  ),
  (
    'move-in-cleaning',
    'move_in',
    'Move-in cleaning',
    'A move-in cleaning service option. Confirm service details with the business.',
    'This demo listing is sample content only. Final cleaning scope, availability, and details must be confirmed with the business.',
    4,
    'published'
  )
on conflict (slug) do nothing;
