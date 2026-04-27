# Jason Hartog Photography Portfolio — Design Spec

## Overview

A photography portfolio site for Jason Hartog. The site is minimal and image-forward — a homepage slider linking to four gallery categories, an about page, and a contact form modal. Content is managed via Sanity CMS so the client can update images, text, and ordering without touching code.

## Tech Stack

- **Framework:** Next.js 15 (App Router, TypeScript)
- **CMS:** Sanity v3 (embedded studio at `/studio`)
- **Slider:** Embla Carousel
- **Hosting:** Cloudflare Pages via `@cloudflare/next-on-pages`
- **Image delivery:** Sanity image CDN (URL-based transforms for width, quality, format)
- **Rendering:** Static Site Generation (SSG) for all pages, Sanity webhook triggers Cloudflare rebuild on content changes
- **Styling:** TBD (CSS Modules or Tailwind — to be decided at implementation)

## Project Structure

Monorepo with embedded Sanity Studio:

```
/jasonhartog.com
  /app
    /page.tsx                          <- Homepage (slider)
    /about/page.tsx                    <- About page
    /[slug]/page.tsx                   <- Gallery pages (dynamic, SSG)
    /studio/[[...tool]]/page.tsx       <- Embedded Sanity Studio
    /layout.tsx                        <- Root layout (Nav + Contact Modal)
  /components
    /Nav.tsx
    /HomepageSlider.tsx
    /ContactModal.tsx
  /sanity
    /schemas/                          <- Sanity document/object schemas
    /lib/                              <- Sanity client, queries, image helpers
    /sanity.config.ts
```

## Sanity Schema

### Portfolio Page

Each of the four gallery categories is a `portfolioPage` document. The `mainImage` drives the homepage slider; `galleryImages` drives the individual gallery page.

```
portfolioPage {
  title: string                        // "Interior Architecture"
  slug: slug                           // "interior-architecture"
  displayOrder: number                 // Controls order in homepage slider (1-4)
  mainImage: image                     // Hero image shown in the homepage slider
  mainImageAlt: string                 // Alt text for the main image
  categoryLabel: string                // Label on slider, may differ from title
                                       // e.g. "Interior Design Detail Photography"
  galleryImages: array of {
    image: image
    alt: string
    caption: string (optional)
  }
}
```

**Notes:**
- `displayOrder` lets the client reorder the homepage slider from Sanity
- `galleryImages` is a sortable array — client can drag to reorder in the studio
- `categoryLabel` is separate from `title` so the slider label can be more descriptive than the page title

### About Page (Singleton)

A single document the client edits to update the about page content.

```
aboutPage {
  name: string                         // Heading displayed on the about page
  headshot: image
  headshotAlt: string
  bio: blockContent (rich text)        // Paragraphs, bold, italic, links
  testimonials: array of {
    quote: text
    clientName: string
    clientTitle: string (optional)     // e.g. "Interior Designer"
  }
}
```

## Pages

### Homepage

The homepage is a full-viewport horizontal slider with 4 images, one per gallery category.

**Layout:**
- Full viewport height minus nav height
- Images sit side by side with no/minimal gap
- Dark background behind the strip
- Category label overlaid at the bottom of each image

**Image sizing:**
- All images share the same container height: `calc(100vh - nav height)`
- Portrait images: height fills the container, width follows naturally from aspect ratio
- Landscape images: same height as portrait images, width capped at ~80vw so the next image peeks in
- No cropping — images preserve their natural aspect ratio (`object-fit: contain`)

**Interaction:**
- Embla Carousel with `dragFree: true` — fluid scrolling, no snapping
- No autoplay, no loop — just 4 slides, user-driven
- Drag/swipe to scroll horizontally
- Clicking an image navigates to that gallery's page

**Responsive:**
- Desktop: ~2.5-3 images visible (depending on aspect ratios)
- Tablet: ~1.5-2 images visible
- Mobile: ~1 image visible, swipe to navigate

**Data:** Fetches all `portfolioPage` documents, sorted by `displayOrder`. Pulls `mainImage`, `mainImageAlt`, `categoryLabel`, and `slug` from each.

### Gallery Pages (`/[slug]`)

Dynamic route rendered via `generateStaticParams` for the 4 portfolio slugs. Each page pulls its own gallery from Sanity.

**Data:** Fetches the `portfolioPage` document matching the slug. Pulls `title` and `galleryImages` array.

**Layout:** To be determined. Gallery page design and image layout will be decided in a future iteration. For now, the route exists and pulls data — layout will be designed separately.

### About Page (`/about`)

**Layout:**
- Desktop: split layout, roughly 50/50
  - Left side: headshot image
  - Right side: name as a heading, then a tabbed section with two tabs:
    - **About** tab: bio rich text
    - **Clients & Testimonials** tab: list of testimonials (quote, client name, client title)
- Mobile: stacks vertically — image on top, name + tabs below

**Data:** Fetches the `aboutPage` singleton. Pulls all fields.

### Sanity Studio (`/studio`)

Embedded Sanity Studio accessible at `/studio`. The client uses this to manage all content — portfolio pages, about page, images, ordering. Standard Sanity v3 studio setup, no customization needed beyond the schema.

## Components

### Nav

- Site name/logo on the left
- Links on the right: the four gallery page names (fetched from Sanity, sorted by `displayOrder`), About, Contact
- Contact link triggers the contact modal (no page navigation)
- Sticky/fixed at top of viewport

### Homepage Slider

- Embla Carousel wrapper
- Renders 4 slides from portfolio page data
- Each slide: image + category label overlay + link to gallery page
- Handles portrait/landscape sizing logic

### Contact Modal

- Triggered by Contact nav link
- Overlay/modal with a form
- Fields: Name (required), Email (required), Phone (optional), Message (required)
- Form submission handling TBD (could be a simple email service, Sanity form submission, or third-party like Formspree)
- Close via X button, clicking outside, or Escape key

## Performance & Caching

- All pages statically generated at build time (SSG)
- Sanity webhook triggers Cloudflare Pages rebuild when content is published
- Images served via Sanity CDN with URL-based transforms:
  - Appropriate width for the viewport (no serving 4000px images to mobile)
  - WebP/AVIF format negotiation
  - Quality optimization
- Cloudflare edge caching via `Cache-Control` headers for additional performance
- No `next/image` optimization — Sanity CDN handles this natively and avoids Cloudflare compatibility issues

## Sanity Project Setup

New project created under the existing "Focus Point Media" organization (org ID: `oEQK8O6sm`). This is a separate project from the two existing ones — independent dataset, schema, and studio.

## Out of Scope (Future Work)

- Gallery page layout/design (to be determined separately)
- SEO metadata schema and implementation
- Analytics integration
- Form submission backend (email service selection)
- Social media links
- Favicon/branding assets
