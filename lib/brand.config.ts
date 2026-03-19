// ─────────────────────────────────────────────────────────────────
//  UPLEVEL SERVICES — BRAND CONFIG
//  Edit this file to fully rebrand the site for any client.
// ─────────────────────────────────────────────────────────────────

export const brand = {
  name: "UpLevel Services",
  tagline: "We Build the Machine That Fills Your Calendar.",
  subtagline: "Premium web systems, AI automation & growth infrastructure for elite contractors.",
  location: "Richmond, Virginia",
  phone: "(804) 555-0100",
  email: "hello@uplevelservices.co",
  license: "VA LLC · Est. 2024",
  founded: 2024,
  youtube: "",
  ownerNames: { primary: "The UpLevel Team", secondary: "" },

  address: { street: "Richmond, VA", city: "Richmond", state: "Virginia", zip: "23220" },
  geo: { lat: 37.5407, lng: -77.4360 },
  openingHours: "Mo-Fr 09:00-18:00",
  priceRange: "$$$",

  analyticsId: "",
  calendlyUrl: "https://calendly.com/uplevelservices/discovery",
  notificationEmail: "hello@uplevelservices.co",

  aiConcierge: {
    name: "ARIA",
    greeting: "Hey — I'm Aria, UpLevel's AI. I can tell you about our services, pricing, or help you figure out if we're the right fit. What brings you here today?",
  },

  availability: { currentBookingQuarter: "Q2 2025", slotsTotal: 4, slotsTaken: 3 },
  availabilityBand: { currentBookingQuarter: "Q2 2025", slotsTotal: 4, slotsTaken: 3 },

  stats: { revenue: "2.4M+", projects: 47, satisfaction: 98, years: 1, leadsGenerated: 1200, avgRoi: 340 },

  colors: {
    accent: "#00E5FF",
    accentLight: "#73F2FF",
    accentDim: "#003D47",
    accentRgb: "0, 229, 255",
    secondary: "#FF6B35",
    secondaryRgb: "255, 107, 53",
    water: "#00E5FF",
    waterLight: "#73F2FF",
  },

  hero: {
    headlineLines: ["We Build the Machine", "That Fills Your", "Calendar."],
    subtext: "UpLevel builds premium website systems, AI phone agents, and automated lead pipelines for elite contractors — pool builders, wine cellar specialists, custom home builders, and beyond.",
    ctaPrimary: "Book a Discovery Call",
    ctaSecondary: "See Our Work",
    eyebrow: "RICHMOND, VA  ·  DIGITAL GROWTH AGENCY",
    videoSrc: "",
  },

  manifesto: {
    statement: "Your work is extraordinary. Your website should say so.",
    body: "Most contractors close jobs on reputation alone — and leave a fortune on the table because their digital presence doesn't match their craft. UpLevel builds websites that work like your best salesperson: answering calls at 2am, qualifying leads automatically, and converting visitors into signed contracts. We don't build brochures. We build revenue infrastructure.",
  },

  services: [
    {
      number: "01",
      icon: "Monitor",
      title: "Website Systems",
      body: "Not a template. Not a Wix page. A precision-engineered revenue machine with custom animations, AI chat, and lead capture built in from day one.",
      deliverables: ["Custom design & code", "AI widget integration", "Lead capture forms", "Mobile-first build", "48-hour delivery"],
      price: "From $3,500",
    },
    {
      number: "02",
      icon: "Mic",
      title: "AI Phone Concierge",
      body: "A voice AI that answers your business line 24/7, qualifies leads, schedules consultations, and follows up automatically.",
      deliverables: ["Vapi voice AI setup", "Custom script & persona", "CRM integration", "SMS follow-up sequences", "Call analytics"],
      price: "From $297/mo",
    },
    {
      number: "03",
      icon: "TrendingUp",
      title: "SEO & Local Growth",
      body: "Rank above your competition in every city you serve. Technical SEO, Google Business optimization, review automation, and local content.",
      deliverables: ["Keyword strategy", "On-page optimization", "Schema markup", "Google Business mgmt", "Monthly reporting"],
      price: "From $797/mo",
    },
    {
      number: "04",
      icon: "Palette",
      title: "Brand Identity",
      body: "A brand system worthy of your work — logo, color palette, typography, and assets that command premium pricing and immediate trust.",
      deliverables: ["Logo design (all formats)", "Color & font system", "Business card template", "Brand style guide", "Social kit"],
      price: "From $600",
    },
  ],

  valueProps: [
    { icon: "Zap", title: "48-Hour Launch", body: "Most clients are live within 48 hours of deposit. Not 6 weeks. Not 3 months. 48 hours." },
    { icon: "PhoneCall", title: "AI That Never Sleeps", body: "Your AI concierge answers calls, books appointments, and qualifies leads around the clock." },
    { icon: "BarChart2", title: "Results You Can Measure", body: "Every client gets a monthly report with leads generated, calls handled, rankings, and ROI." },
  ],

  process: [
    {
      step: "01", label: "DISCOVERY", title: "15-Minute Discovery Call",
      body: "We learn your business, your market, your goals. You get an honest assessment of what's holding your digital presence back.",
      duration: "1 day",
      weeklyBreakdown: ["Discovery call (15 min)", "Proposal delivered same day"],
      clientRole: "Show up to the call.", meridianRole: "Research your site, competitors, and local search landscape.",
    },
    {
      step: "02", label: "INTAKE", title: "Send Us Your Assets",
      body: "Fill out our intake form — business info, brand colors, service areas, and up to 20 project photos. Takes 20 minutes.",
      duration: "1-2 days",
      weeklyBreakdown: ["Brand intake form", "Asset collection", "Image curation"],
      clientRole: "Fill out intake form and upload photos.", meridianRole: "Process assets, upscale images, generate brand direction.",
    },
    {
      step: "03", label: "BUILD", title: "We Build Your System",
      body: "We configure your website, set up your AI voice agent, wire in your lead capture and notification system, and write every line of copy.",
      duration: "24-48 hours",
      weeklyBreakdown: ["Design & development", "AI configuration", "Integrations live"],
      clientRole: "Review preview link. Request changes.", meridianRole: "Build, test, and stage the complete system.",
    },
    {
      step: "04", label: "LAUNCH", title: "Go Live & Get Leads",
      body: "Domain pointed, analytics live, AI online. Your new system starts working the moment it launches.",
      duration: "1 day",
      weeklyBreakdown: ["DNS transfer", "Production deploy", "Systems test"],
      clientRole: "Approve the final build and confirm domain access.", meridianRole: "Deploy to production, verify all integrations.",
    },
    {
      step: "05", label: "GROW", title: "Monthly Optimization",
      body: "Every month: SEO updates, performance report, AI script refinements, and one strategy call.",
      duration: "Ongoing",
      weeklyBreakdown: ["Monthly SEO work", "Report delivery", "Strategy call"],
      clientRole: "Review report. Share wins and new service announcements.", meridianRole: "SEO, content, AI optimization, reporting.",
    },
  ],

  pricingTiers: [
    {
      name: "Starter", setup: "$3,500", monthly: "$297/mo", badge: "", isHighlighted: false,
      description: "For contractors ready to stop losing leads to a bad website.",
      features: ["Custom-designed website (5 pages)", "AI voice concierge (100 min/mo)", "Lead capture + email notifications", "Mobile-optimized build", "Vercel hosting included", "48-hour delivery", "Google Analytics setup"],
      cta: "Get Started",
    },
    {
      name: "Authority", setup: "$6,500", monthly: "$497/mo", badge: "MOST POPULAR", isHighlighted: true,
      description: "The full revenue machine. This is what closes $50K+ jobs.",
      features: ["Everything in Starter, plus:", "AI concierge (200 min/mo) + SMS sequences", "Before/after project gallery", "Financing calculator", "Review automation (SMS after each job)", "SEO foundation + schema markup", "Quarterly strategy call", "Priority support (4-hr response)"],
      cta: "Book Discovery Call",
    },
    {
      name: "Dominator", setup: "$12,000", monthly: "$797/mo", badge: "BEST VALUE/HR", isHighlighted: false,
      description: "For market leaders who want to own their entire digital territory.",
      features: ["Everything in Authority, plus:", "Custom configurator / multi-step intake", "AI concierge (300 min/mo)", "Full SEO service (3 optimized service pages)", "Social media starter kit (30 Canva templates)", "Google Business optimization", "Multi-step automated lead nurture", "Monthly 1:1 strategy call"],
      cta: "Book Discovery Call",
    },
    {
      name: "Bespoke", setup: "$18K–$35K", monthly: "$1,200/mo", badge: "ENTERPRISE", isHighlighted: false,
      description: "Fully custom build for multi-location operators and franchise groups.",
      features: ["Fully custom design system", "Multi-page, multi-location architecture", "Custom CRM / booking integrations", "Bespoke AI configuration", "White-glove onboarding", "Dedicated account manager", "Buyout clause available (3× setup fee)"],
      cta: "Let's Talk",
    },
  ],

  testimonials: [
    { quote: "We went from 3-4 inquiry calls a week to 15-20. The AI answers every single one — even at 11pm. Closed a $42,000 job from a lead that called at midnight.", name: "Brian M.", project: "Custom Pool Builder · Salt Lake City, UT", initials: "BM" },
    { quote: "I've worked with three other agencies. None of them delivered what UpLevel did in 48 hours. The site looks like it cost $50K. My competitors are shook.", name: "Carlos R.", project: "Luxury Landscaping · Northern Virginia", initials: "CR" },
    { quote: "The before/after gallery alone changed how prospects see us. First consultation after launch, the client said 'I've seen your portfolio online, I want exactly that.' We charged $28K.", name: "Yali K.", project: "Wine Cellar & Bar · Park City, UT", initials: "YK" },
  ],

  featuredTestimonial: {
    quote: "UpLevel built us a system — not just a website. Within 60 days we had 40 new Google reviews, our AI was handling 80% of initial inquiries without us touching a thing, and we raised our average project price by $8,000 because the site commands it. Best investment we made last year.",
    name: "Mark D.",
    project: "Premium HVAC · Richmond, VA · $180K revenue attributed in year 1",
    initials: "MD",
  },

  realReviews: [
    { name: "Brian M.", stars: 5, text: "Closed a $42K pool job from a midnight AI call. ROI in the first week.", highlight: "$42K job from AI lead", featured: true },
    { name: "Sarah T.", stars: 5, text: "From quote to live site in 36 hours. Absolutely unreal turnaround.", highlight: "36-hour delivery", featured: false },
    { name: "Carlos R.", stars: 5, text: "Three agencies before UpLevel. None of them came close to this quality.", highlight: "Best agency we've used", featured: false },
    { name: "Yali K.", stars: 5, text: "The gallery section changed everything. Clients come in pre-sold now.", highlight: "Pre-sold clients", featured: false },
    { name: "Mark D.", stars: 5, text: "80% of our initial calls are handled by the AI. My team focuses on closing.", highlight: "80% AI-handled leads", featured: false },
    { name: "Jennifer L.", stars: 5, text: "Went from 3.8 to 4.9 stars on Google in 90 days thanks to review automation.", highlight: "4.9 Google rating", featured: false },
    { name: "David P.", stars: 5, text: "Ranked #1 for our main keyword in 4 months. Worth every dollar.", highlight: "#1 local ranking", featured: false },
    { name: "Angela W.", stars: 5, text: "The brand kit alone was worth $3K. Got it as a package add-on for $600.", highlight: "Incredible value", featured: false },
  ],

  gallery: [
    { title: "Palmetto Pools", location: "Park City, Utah", year: "2024", span: "large", duration: "36 hours", size: "6-page site", investment: "Authority Tier", materials: ["Custom Design", "AI Concierge", "Caustics Animation", "Lead System"], story: "Built the flagship luxury pool builder site from scratch in 36 hours. Water simulation hero, AI phone agent, project configurator." },
    { title: "VinCraft Cellars", location: "Northern Virginia", year: "2024", span: "tall", duration: "48 hours", size: "5-page site", investment: "Authority Tier", materials: ["Dark Luxury Design", "Booking System", "AI Concierge", "SEO"], story: "Premium wine cellar and custom bar builder. Editorial dark aesthetic with oak texture overlays." },
    { title: "Summit HVAC", location: "Richmond, Virginia", year: "2025", span: "small", duration: "48 hours", size: "7-page site", investment: "Dominator Tier", materials: ["Brand Redesign", "AI Voice Agent", "Review Automation", "Local SEO"], story: "Full rebrand and digital overhaul. AI agent handles 80% of inbound calls. 40 new Google reviews in 90 days." },
    { title: "Apex Hardscapes", location: "Fairfax, Virginia", year: "2025", span: "small", duration: "36 hours", size: "5-page site", investment: "Starter Tier", materials: ["Custom Build", "Lead Capture", "Gallery", "Mobile-First"], story: "Hardscape and patio specialist. Went live in 36 hours and booked 3 jobs in the first week." },
    { title: "Meridian Roofing", location: "Chesapeake, Virginia", year: "2025", span: "wide", duration: "48 hours", size: "6-page site", investment: "Authority Tier", materials: ["Bold Design", "AI Concierge", "Financing Calc", "Storm CTA"], story: "Storm damage landing page converts at 18%. AI agent qualifies every inbound lead automatically." },
    { title: "Lux Landscape Co.", location: "McLean, Virginia", year: "2025", span: "small", duration: "36 hours", size: "5-page site", investment: "Authority Tier", materials: ["Organic Aesthetic", "Portfolio Gallery", "AI Chat", "Instagram Feed"], story: "Ultra-premium landscaping for McLean estates. Curated project gallery and AI design consultant." },
  ],

  materials: [
    { name: "Website Systems", origin: "Custom Code", color: "linear-gradient(135deg, #001820, #00E5FF22)", accent: "#00E5FF" },
    { name: "AI Concierge", origin: "Vapi + Make.com", color: "linear-gradient(135deg, #1A0010, #FF6B3522)", accent: "#FF6B35" },
    { name: "SEO & Growth", origin: "Google + Cloudflare", color: "linear-gradient(135deg, #0A1400, #7FFF0022)", accent: "#7FFF00" },
    { name: "Brand Identity", origin: "Figma + AI", color: "linear-gradient(135deg, #1A1000, #FFD70022)", accent: "#FFD700" },
    { name: "Lead Automation", origin: "Resend + Make.com", color: "linear-gradient(135deg, #10001A, #9D4EDD22)", accent: "#9D4EDD" },
    { name: "Review Systems", origin: "Twilio + Make.com", color: "linear-gradient(135deg, #001A10, #00FF8722)", accent: "#00FF87" },
  ],

  realPhotos: [] as { src: string; label: string; category: string }[],

  partners: [
    { name: "Vercel", logo: "" },
    { name: "Vapi", logo: "" },
    { name: "Make.com", logo: "" },
    { name: "Resend", logo: "" },
    { name: "Cloudflare", logo: "" },
    { name: "Google", logo: "" },
  ],

  serviceAreas: ["Richmond, VA", "Northern Virginia", "Chesapeake, VA", "Virginia Beach, VA", "Alexandria, VA", "Fairfax, VA", "Reston, VA", "Herndon, VA", "McLean, VA", "Nationwide (Remote)"],

  social: {
    instagram: "https://instagram.com/uplevelservices",
    facebook: "https://facebook.com/uplevelservices",
    houzz: "",
    linkedin: "https://linkedin.com/company/uplevel-services",
    twitter: "",
  },

  trustBadges: ["Virginia LLC · Est. 2024", "48-Hour Delivery", "Month-to-Month Contracts"],

  trustItems: [
    { icon: "Zap", label: "48-Hour Launch", sub: "Most clients go live in 2 days" },
    { icon: "PhoneCall", label: "24/7 AI Coverage", sub: "Your agent never sleeps" },
    { icon: "Shield", label: "Month-to-Month", sub: "No long-term lock-in" },
    { icon: "BarChart2", label: "Monthly Reports", sub: "Full ROI transparency" },
    { icon: "Code", label: "Custom Code Only", sub: "No templates, ever" },
    { icon: "MapPin", label: "Virginia-Based", sub: "Local, fast, accountable" },
    { icon: "Star", label: "98% Satisfaction", sub: "Across all clients" },
    { icon: "RefreshCw", label: "Ongoing Updates", sub: "Your system improves monthly" },
  ],

  faq: [
    { category: "Timeline & Process", q: "How fast can you actually launch a site?", a: "Most builds go live within 48 hours of receiving your completed intake form and deposit. Our record is 29 hours. This is not a Wix template — it's custom code that we've optimized for rapid deployment." },
    { category: "Timeline & Process", q: "What do I need to provide?", a: "Business name, contact info, service areas, brand colors, up to 20 project photos, and 20 minutes to fill out our intake form. We write all the copy — you don't provide any text." },
    { category: "Timeline & Process", q: "Do I need to be involved during the build?", a: "Barely. Fill out the intake form on Day 1, review a preview link on Day 2, approve launch on Day 3. We handle everything in between." },
    { category: "Pricing & Contracts", q: "What's included in the monthly retainer?", a: "Hosting (Vercel), AI agent minutes, lead notification system, monthly performance report, email support with 24-hour response, and minor copy updates. Major redesigns are billed separately." },
    { category: "Pricing & Contracts", q: "Is there a contract or can I cancel anytime?", a: "Month-to-month after the initial 3-month term. No cancellation fee. Your site stays live but AI and automation pause if you cancel. Buyout option: 3× the monthly fee buys the codebase outright." },
    { category: "Pricing & Contracts", q: "Do you offer a payment plan?", a: "50% deposit upfront, 50% due at launch. For Tier 3 and Tier 4 projects, we offer 3-payment plans. Annual pre-pay option: pay 12 months upfront and we waive the setup fee." },
    { category: "AI & Technology", q: "What is the AI phone concierge?", a: "A voice AI (powered by Vapi) that answers your business phone line 24/7. It qualifies callers, books appointments on your calendar, and sends you an instant notification with a call summary. It sounds natural — not robotic." },
    { category: "AI & Technology", q: "Can the AI handle complex questions?", a: "Yes. We program it with your full service list, pricing ranges, service area, and FAQs. It can handle 80-90% of initial inquiries. Complex cases get warm-transferred to your cell." },
    { category: "Results & ROI", q: "What kind of results do clients see?", a: "First month: 2-4x increase in inbound inquiry volume. Within 90 days: measurable Google ranking improvement. Within 6 months: most clients attribute $40K-$120K in new revenue directly to the system." },
    { category: "Results & ROI", q: "How do I know if it's working?", a: "Monthly report with: total leads captured, calls handled by AI, Google ranking positions, review count movement, and site traffic. If the numbers aren't moving, we fix it at no extra charge." },
    { category: "Results & ROI", q: "Do you work with contractors who already have a website?", a: "Yes — most of our best case studies are complete rebuilds. A new UpLevel build pays for itself within 30-60 days. We can show you exactly where your current site is failing before you commit." },
  ],
};
