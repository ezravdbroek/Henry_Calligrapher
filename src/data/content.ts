/**
 * Copy for the site. Wording is the client's own, including her curly apostrophes and em
 * dashes — leave those alone.
 *
 * Images are stored as bare file names and resolved through `src/lib/images.ts`, so
 * `astro:assets` can optimise them.
 */

export const email = 'info@henrycalligraphy.com';
export const instagramUrl = 'https://www.instagram.com/henrycalligraphy/';
export const tagline = 'There’s a distinctive warmth, that only handwritten notes seem to deliver.';

export const mailto = {
  commission:
    'mailto:info@henrycalligraphy.com?subject=Commission%20inquiry&body=Hello%20Isha%2C%0A%0AI%20would%20like%20to%20inquire%20about%3A%0A%0AOccasion%3A%0ADate%3A%0AQuantity%3A%0A%0AKind%20regards%2C',
  service:
    'mailto:info@henrycalligraphy.com?subject=Service%20inquiry&body=Hello%20Isha%2C%0A%0AI%20would%20like%20to%20inquire%20about%20a%20service.%0A%0AService%20of%20interest%3A%0AEvent%20date%3A%0ADetails%3A%0A%0AKind%20regards%2C',
  product:
    'mailto:info@henrycalligraphy.com?subject=Product%20inquiry&body=Hello%20Isha%2C%0A%0AI%20would%20like%20to%20inquire%20about%20a%20product.%0A%0AProduct%20of%20interest%3A%0AQuantity%3A%0ADetails%3A%0A%0AKind%20regards%2C',
};

/** Main navigation. `match` is the path that marks the link as the current page. */
export const navLinks = [
  { href: '/services', label: 'Services', match: '/services' },
  { href: '/products', label: 'Products', match: '/products' },
  { href: '/previous-projects', label: 'Projects', match: '/previous-projects' },
  { href: '/about', label: 'About', match: '/about' },
  { href: '/contact', label: 'Contact', match: '/contact' },
];

const serviceItems = {
  calligraphy: [
    'Wedding invitations & envelopes',
    'Place cards and menus',
    'Vows, letters and poems',
  ],
  engraving: ['Glassware and bottles', 'Perfume flacons & leather', 'Jewellery and gifting'],
  hotFoil: ['Gold, silver and copper foil', 'Stationery and packaging', 'Branded event details'],
};

/** The three service cards on the home page. */
type HomeService = {
  file: string;
  alt: string;
  position: string;
  title: string;
  items: string[];
};

export const homeServices: HomeService[] = [
  {
    file: 'calligraphy-menu.jpg',
    alt: 'Service photograph — copperplate calligraphy menu card',
    position: 'object-[50%_55%]',
    title: 'Calligraphy',
    items: serviceItems.calligraphy,
  },
  {
    file: 'engraving-glass.jpg',
    alt: 'Service photograph — engraved glass and metal',
    position: 'object-[50%_62%]',
    title: 'Engraving',
    items: serviceItems.engraving,
  },
  {
    file: 'hot-foil-notebook.jpg',
    alt: 'Service photograph — hot foil stamping on notebook',
    position: 'object-[50%_70%]',
    title: 'Hot foiling',
    items: serviceItems.hotFoil,
  },
];

/**
 * The three sections on the services page. Same items, different photography and alt text.
 *
 * The photos are 2:3 portraits shown in a 3:2 frame, so only ~44% of the image height survives
 * the crop and each needs its own focal point — centring the notebook cuts the gold foil
 * lettering in half.
 */
type ServiceSection = {
  id: string;
  title: string;
  file: string;
  alt: string;
  reversed: boolean;
  position: string;
  items: string[];
};

export const serviceSections: ServiceSection[] = [
  {
    id: 'calligraphy',
    title: 'Calligraphy',
    file: 'calligraphy-menu.jpg',
    alt: 'Handwritten copperplate calligraphy menu card on a dinner plate',
    reversed: false,
    position: 'object-center',
    items: serviceItems.calligraphy,
  },
  {
    id: 'engraving',
    title: 'Engraving',
    file: 'engraving-glass.jpg',
    alt: 'Crystal wine glass engraved with the name Milo',
    reversed: true,
    position: 'object-[50%_55%]',
    items: serviceItems.engraving,
  },
  {
    id: 'hot-foil',
    title: 'Hot foiling',
    file: 'hot-foil-notebook.jpg',
    alt: 'Black notebook hot foiled with Henry Calligraphy in gold',
    reversed: false,
    position: 'object-[50%_75%]',
    items: serviceItems.hotFoil,
  },
];

/**
 * Selected commissions, each paired with a photograph from the studio's library.
 *
 * `credit` renders under the card and in the lightbox; `gallery` keys into `projectGalleries`
 * and turns the card into a multi-photo set.
 */
type Project = {
  title: string;
  tag: string;
  text: string;
  file: string;
  alt?: string;
  credit?: string;
  /** object-position for the card crop, as on `homeServices`. Defaults to centre. */
  position?: string;
  /** Key into `projectGalleries`; a card with one opens a lightbox. */
  gallery?: string;
};

export const projects: Project[] = [
  {
    title: 'Wedding stationery suite',
    tag: 'Calligraphy',
    text: 'Copperplate place cards, menus and envelopes for an intimate spring wedding.',
    file: 'calligraphy-menu.jpg',
    gallery: 'wedding-stationery',
  },
  {
    title: 'Brand activation',
    tag: 'Live calligraphy',
    text: 'On-site personalisation of private gatherings and events.',
    file: 'live-waxseal.jpg',
    gallery: 'brand-activation',
  },
  {
    title: 'Engraved keepsakes',
    tag: 'Engraving',
    text: 'Perfume flacons and glassware hand-engraved with names and short messages.',
    file: 'engraving-glass.jpg',
  },
  {
    title: 'Hot foiling event details',
    tag: 'Hot foiling',
    text: 'Bespoke leather gifts',
    file: 'hot-foil-notebook.jpg',
    // 2:3 portrait in a 4:3 frame, so most of the height is cropped away. Centring lands on
    // the wood and the chess set; the same shift the home page uses brings the notebook back.
    position: 'object-[50%_70%]',
  },
  {
    title: 'Birth cards and announcements',
    tag: 'Calligraphy',
    text: 'Hand-lettered birth announcements and keepsake cards in classic Copperplate.',
    file: 'studio-orders.jpg',
  },
  {
    title: 'Private celebration',
    tag: 'Studio order',
    text: 'Bespoke details for your event.',
    file: 'tefaf-alexander-adler.jpg',
    alt: 'Copperplate place card for Alexander Adler at a TEFAF Maastricht dinner',
    credit: 'Photos by Maison Rowena. Courtesy of TEFAF.',
  },
];

/** Pétalia collection gallery. */
export const gallery = [
  { file: 'jardin-violet-carnation.jpg', alt: 'Jardin Violet - Carnation' },
  { file: 'jardin-violet-sweet-pea.jpg', alt: 'Jardin Violet - Sweet Pea' },
  { file: 'jardin-violet-hydrangea.jpg', alt: 'Jardin Violet - Hydrangea' },
  { file: 'jardin-violet-lisa.jpg', alt: 'Jardin Violet - Lisa' },
  { file: 'zanzibar-marigold.jpg', alt: 'The Zanzibar Collection - Marigold' },
  { file: 'bespoke-petalia-lucien.jpg', alt: 'Bespoke Pétalia' },
  { file: 'bespoke-petalia-shinko.jpg', alt: 'Bespoke Pétalia x' },
  { file: 'bespoke-petalia-horloge.jpg', alt: 'Bespoke Pétalia Horloge' },
  { file: 'save-our-date-15.jpg', alt: 'Marry Me Collection' },
  { file: 'new-elan.jpg', alt: 'New Élan' },
];

/* --------------------------------------------------------------------------
 * Every line below is drawn from copy that already exists elsewhere on the site
 * (the home page sections and the Terms and Conditions page), so the structure
 * adds nothing the studio does not already claim.
 * -------------------------------------------------------------------------- */

/**
 * Brands the studio has worked with.
 *
 * `logo` is a file under `src/assets/images/trusted/`; TEFAF has no file because it is drawn
 * inline as an SVG in the component. Every mark has a different proportion — a tall House of
 * Flux monogram next to a very wide By Maureen wordmark — so each carries its own height
 * instead of one shared size, which would leave the monogram looking tiny.
 *
 * `featured` marks the two clients Isha wants to stand out: they sit first, are set larger and
 * skip the muted treatment the others get.
 */
export const trustedBy = [
  {
    name: 'Carrera y Carrera',
    href: 'https://carreraycarrera.com/',
    logo: 'trusted/carrera-y-carrera.png',
    height: 'h-6 sm:h-8',
    featured: true,
  },
  {
    name: 'Mandarin Oriental, Conservatorium Amsterdam',
    href: 'https://www.mandarinoriental.com/en/amsterdam/conservatorium',
    logo: 'trusted/mandarin-oriental.png',
    // A stacked lockup: the fan sits above two lines of type, so it needs more height than the
    // single-line wordmarks before the bottom line becomes readable.
    height: 'h-14 sm:h-16',
    featured: true,
  },
  {
    name: 'TEFAF',
    href: 'https://www.tefaf.com/',
    height: 'h-4 sm:h-5',
  },
  {
    name: 'House of Flux',
    href: 'https://houseofflux.com/',
    logo: 'trusted/house-of-flux.png',
    height: 'h-12 sm:h-14',
  },
  {
    name: 'By Maureen',
    href: 'https://www.bymaureen.nl',
    logo: 'trusted/by-maureen.png',
    height: 'h-3.5 sm:h-4',
  },
  {
    name: 'Dévents Event Agency',
    href: 'https://www.devents-agency.com',
    logo: 'trusted/devents.png',
    height: 'h-9 sm:h-10',
  },
  {
    name: 'Lifestyle Business Club',
    logo: 'trusted/lifestyle-business-club.png',
    height: 'h-11 sm:h-12',
  },
  {
    name: 'The Perfect',
    href: 'https://the-perfect.nl/',
    logo: 'trusted/the-perfect.png',
    height: 'h-8 sm:h-9',
  },
];

/**
 * Photo sets behind the project cards on `/previous-projects`. Keyed by the `gallery` field
 * on a `projects` entry; a card without one stays a plain, non-clickable tile.
 */
type GalleryPhoto = { file: string; alt: string; credit?: string };

export const projectGalleries: Record<string, GalleryPhoto[]> = {
  'wedding-stationery': [
    { file: 'wedding-table-menu.jpg', alt: 'Garden table set with a calligraphed menu and candles' },
    { file: 'wedding-oyster-placecard.jpg', alt: 'Gilded oyster shell place card resting on a handwritten menu' },
    { file: 'wedding-long-table.jpg', alt: 'Long candlelit wedding table laid with place cards' },
  ],
  'brand-activation': [
    { file: 'activation-mandarin-oriental.jpg', alt: 'Calligraphed welcome card for a Mandarin Oriental spa guest' },
    { file: 'activation-welcome-cards.jpg', alt: 'Fan of handwritten welcome cards beside a Henry Calligraphy folder' },
    { file: 'activation-boutique.jpg', alt: 'Guest leaving a boutique event with a personalised gift bag' },
    { file: 'activation-place-setting.jpg', alt: 'Place card being set at a private dinner table' },
    { file: 'activation-jansz-eva.jpg', alt: 'Handwritten place card and menu beside peonies' },
    { file: 'activation-wax-seal.jpg', alt: 'Guest holding a monogrammed envelope closed with a wax seal' },
  ],
};

/** How a commission works. Sourced from Terms sections 2, 3 and 5. */
export const process = [
  {
    step: '01',
    title: 'Inquiry',
    text: 'Every commission is bespoke and begins with an enquiry. Tell me about the occasion, the pieces and the date.',
  },
  {
    step: '02',
    title: 'Quote & design',
    text: 'You receive a tailored proposal based on materials, quantity, complexity and turnaround time. Quotes are valid for 14 days.',
  },
  {
    step: '03',
    title: 'Handcrafted',
    text: 'Written and finished in the studio, or personalised live at your event. Work begins once the agreed deposit has been received.',
  },
  {
    step: '04',
    title: 'Delivered or Orchestration Service',
    text: 'Delivered by shipping/mail or delivered in person with our Orchestration Service: instead of simply delivering it, we will personally bring the pieces and help you orchestrate and place them.',
  },
];

/** Frequently asked questions. Every answer is taken from the Terms page or the home page. */
export const faq = [
  {
    q: 'How do I commission a piece?',
    a: 'All commissions are bespoke and begin with an enquiry. Tell me about the occasion, the pieces and the date, and you receive a tailored proposal based on materials, quantity, complexity and turnaround time.',
  },
  {
    q: 'How long is a quote valid?',
    a: 'Quotes are valid for 14 days unless otherwise stated.',
  },
  {
    q: 'How does payment work?',
    a: 'A deposit may be required to confirm your booking or commission. Full payment terms are outlined in your quote or invoice, and work on custom pieces begins once the agreed deposit or payment has been received.',
  },
  {
    q: 'What are the turnaround times?',
    a: 'Turnaround times are estimates and depend on project scope, material availability and current workload. Expected timelines are communicated clearly and you are kept informed of any changes.',
  },
  {
    q: 'Can I cancel or change an order?',
    a: 'Because each item is made to order, cancellations and refunds are not guaranteed. If you need to cancel or amend an order, please get in touch as soon as possible — any refund or partial credit is considered case by case.',
  },
  {
    q: 'Do you work on location?',
    a: 'Yes. With live calligraphy, guests watch their names, bottles or bags being personalised in ink at your event — a memorable detail for brand activations, weddings and private celebrations.',
  },
  {
    q: 'What is the Pétalia Collection?',
    a: 'Pétalia is a curated collection of fine paper and card designs, created from real flowers that have been carefully pressed, preserved and composed by hand. Each piece can be individually embellished with hand-applied calligraphy for a personal finish.',
  },
  {
    q: 'Can I use the artwork commercially?',
    a: 'Commissioned artwork is for personal or event use as agreed. Commercial reproduction or resale without written permission is not allowed.',
  },
];

/** Subject shortcuts on the contact page; the value lands in the form's subject field. */
export const contactSubjects = [
  {
    value: 'service',
    label: 'A service',
    text: 'Calligraphy, engraving or hot foil — for a wedding, event or brand.',
  },
  {
    value: 'product',
    label: 'A product',
    text: 'Tricolore Oysters, personalised notebooks and other paper goods.',
  },
  {
    value: 'petalia',
    label: 'Pétalia Collection',
    text: 'Botanical paper and cards made from real pressed flowers.',
  },
];

/** Set expectations before someone starts typing. Every line is drawn from the Terms page. */
export const expectations = [
  {
    title: 'A quote made for your project',
    text: 'A final quote is based on materials, quantity, complexity and turnaround time. Quotes are valid for 14 days unless otherwise stated.',
  },
  {
    title: 'A deposit confirms the booking',
    text: 'Full payment terms are outlined in your quote or invoice. Work on custom pieces begins once the agreed deposit has been received.',
  },
  {
    title: 'Timelines agreed up front',
    text: 'Turnaround times depend on project scope, material availability and current workload. Delivery costs and methods are agreed before final payment.',
  },
];
