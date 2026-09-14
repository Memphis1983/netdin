# Netdin

Independent digital studio website for **netdin.com**, built with React, TypeScript, Vite and Appwrite. Includes interactive project previews, scroll-aware navigation, service enquiries, FAQ and privacy dialogs. Fonts and visual assets are served locally.

## Run Locally

Use Node.js 22.12+ (or a newer supported LTS) and npm.

```sh
npm ci
npm run dev
```

The VS Code task **Netdin: development server** starts the preview at http://127.0.0.1:5173. Without Appwrite configuration, enquiries show an explicit error with an email fallback; they are not silently accepted or stored locally.

```sh
npm run build
npm run lint
npx playwright install chromium
npm test
```

The build output is `dist`. Playwright starts isolated development servers on ports 5174 and 5175. Tests cover responsive layouts from 320px to 1920px, image loading, dialogs, focus restoration, mobile navigation, validation, successful/failed submissions and missing configuration. Appwrite responses are mocked; these tests do not verify a live database. Screenshots are written to `test-results`.

## Appwrite Backend

1. Create an Appwrite project and register a **Web** platform for `localhost`. Register `127.0.0.1` separately when using the VS Code preview, and add your actual Sites hostname and production domains before launch.
2. Create a database and a table named `enquiries`. Use the current **TablesDB** table/row API, not the legacy collection/document API.
3. Add the following columns with these exact keys. Wait for all columns to become available before submitting a brief.

| Key | Type | Size | Required |
| --- | --- | --- | --- |
| name | String | 100 | Yes |
| email | String | 254 | Yes |
| company | String | 150 | No |
| services | String, array enabled | 100 per item | Yes |
| budget | String | 100 | Yes |
| timeline | String | 100 | Yes |
| message | String | 5000 | Yes |
| consent | Boolean | - | Yes |
| source | String | 100 | Yes |
| consentVersion | String | 32 | Yes |

4. Enable **Row security**. At table level, grant **Any: Create only**. Do not grant public Read, Update or Delete. The client creates each row with `permissions: []`, so website visitors cannot read submitted briefs. Manage enquiries through the authorized Appwrite Console team.
5. Create `.env.local` using the keys in `.env.example`, populated from the Console. `VITE_APPWRITE_ENDPOINT` is the full project API endpoint, for example `https://<REGION>.cloud.appwrite.io/v1`. The other values are the project, database and table IDs, not their display names.
6. Restart Vite after changing environment variables. On a deployed site, rebuild and redeploy to apply them.

These four values are **public browser configuration**, not secrets. Never put an API key, admin credential or email-provider secret in a `VITE_` variable. None is required by this frontend.

The form sends a project brief and consent to Appwrite. It does not send email notifications; enquiries must be reviewed in the Console unless a separate server-side notification workflow is configured. The email fallback requires a working `hello@netdin.com` mailbox and the visitor's mail application.

### Public Form Security

The table schema enforces types and maximum string lengths. The UI additionally validates required fields and uses a honeypot, but browser checks can be bypassed. Appwrite's endpoint rate limits are not a complete anti-spam solution. Before a high-volume public launch, route submissions through an Appwrite Function with server-side validation, CAPTCHA verification and abuse controls; remove public table Create permission when adopting that architecture. Keep server credentials only in Function secrets.

## Appwrite Sites Hosting

1. Push this project to your Git provider and create an **Appwrite Site** connected to that repository. Select the React/Vite framework preset and the repository root.
2. Set install command to `npm ci`, build command to `npm run build`, and output directory to `dist`. Choose a supported Node.js runtime matching the local prerequisite.
3. Add the four `VITE_APPWRITE_*` variables in Sites before the build. They must be available at build time.
4. Deploy and register the resulting Sites hostname as an Appwrite Web platform.
5. In the Site's Domains settings, add `netdin.com` and optionally `www.netdin.com`. Apply exactly the DNS records provided by Appwrite, wait for verification and TLS, and configure your preferred domain redirect where supported. Do not guess DNS records.
6. Submit a test brief on the deployed URL. Verify that one row appears in the Console and that an unauthenticated client cannot list, read, update or delete rows. Remove the test brief through the Console.

Reference: [Appwrite React Sites quick start](https://appwrite.io/docs/products/sites/quick-start/react) and [Appwrite permissions](https://appwrite.io/docs/advanced/platform/permissions).

## Launch Checklist

- [x] Responsive agency homepage and project/service interactions implemented.
- [x] Appwrite enquiry client, validation, consent, failure/retry and email fallback implemented.
- [x] Local production build, lint and Chromium browser checks passed.
- [ ] Configure the real Appwrite project, table, permissions and build environment.
- [ ] Verify live writes and private enquiry access on the deployed hostname.
- [ ] Connect the Git repository to Appwrite Sites, then verify domain DNS and HTTPS.
- [ ] Confirm that `hello@netdin.com` receives mail and assign enquiry review ownership.
- [ ] Review privacy wording, retention practices, business details and public-form abuse controls before launch.

No real Appwrite project or public deployment has been provisioned by this repository alone.

## Content And Assets

Edit services, FAQs and project descriptions in `src/content.ts`, page structure in `src/App.tsx`, and editorial styling in `src/editorial.css`. Shared controls use `src/site.css` and `src/index.css`. The brand-to-product hero lives in `src/components/AgencyHero.tsx` and its adjacent stylesheet. Enquiry submission is in `src/lib/enquiries.ts`. Keep its `consentVersion` aligned with material privacy-notice changes.

**Supply and Orbit are clearly labeled self-initiated concept explorations**, not claimed client engagements. Supply is a digital-goods storefront design with illustrative products and prices, not a working shop. Orbit's dashboard is an illustrative design preview, not a live operational application. Replace these with authorized client work when available. The studio section uses a responsive design-to-code workflow illustration, not office photography or an actual client project. Its interface data and code are illustrative.

The hero presents Supply as one connected brand-to-product concept: an identity sheet, the existing storefront rendered from React markup, and a matching catalogue-management design rendered from capture-only HTML. These are local browser captures, not AI-generated interfaces. The catalogue controls and sales figures are illustrative, not a working application or actual business results. A responsive picture selects desktop, short-laptop and mobile compositions (`netdin-brand-system.jpg`, `netdin-brand-system-short.jpg`, `netdin-brand-system-mobile.jpg`). The hero opens the enquiry dialog and links to selected work; it has no carousel, autoplay or WebGL dependency. Supply and Orbit remain in selected work, with All, Brand and Product filters. The earlier AI-generated Signal Loom image and Three.js sculpture source/assets remain unused by the active homepage.

The project-direction chooser preselects a service in the enquiry form. Orbit's portfolio image is a locally rendered concept interface. Supply's editorial brand image is AI-generated using Azure Foundry; it depicts a fictional brand, not a photographed client project. Portfolio artwork is lazy-loaded with reserved dimensions. Project dialogs offer interface/art-direction views and a reset control. Supply has selectable brand palettes; Orbit has period selection and keyboard-accessible revenue bars with illustrative data. Navigation tracks the current section, and motion respects reduced-motion preferences.

To regenerate the interface-derived assets, start the preview at http://127.0.0.1:5173 and run `node scripts/generate-product-hero.mjs` (requires the Playwright Chromium installation above). Its development-only `?artwork=static` mode preserves the original capture layouts. This writes `product-hero.png`, `product-hero-mobile.png`, `supply-study.png` and `orbit-study.png` in `public/images`. Supply's card uses `supply-editorial.jpg`. Responsive tests check hero clearance, decoded artwork, text sizes and overflow, including a 1366x641 short-laptop viewport, and capture dedicated hero and project screenshots. Interaction tests cover hero actions, keyboard focus, work filters and project explorers. Header, hero, footer, contact dialog and favicon use dot-free Netdin branding.

Run `node scripts/generate-product-hero.mjs --brand-system` to regenerate only the three active hero JPEGs. It uses the same running preview and Playwright installation, needs no image-generation credentials and makes no paid image API request. Identity and catalogue layout styles live in this script; the storefront markup comes from the Supply concept in `src/App.tsx`.

### Design Research And Open Source

- [Instrument](https://www.instrument.com/): work categories and project-led presentation.
- [BASIC/DEPT](https://www.basicagency.com/): prominent project media and concise positioning.
- [Work & Co](https://www.work.co/): restrained editorial hierarchy and direct design/technology messaging.
- [Roxo Hugo by Sitepins](https://github.com/sitepins/roxo-hugo): MIT-licensed foundation researched and cloned locally outside this application. Its portfolio-card category/title/revealed-link pattern was adapted into React with keyboard focus and touch visibility. This is not a wholesale Hugo conversion.

Agency sites were visual references only; their logos, client claims, copy and media were not reused. Netdin retains its own concept artwork and Appwrite enquiry implementation. The Roxo license is preserved in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

### Local Image Generation

The optional `scripts/generate-foundry-artwork.mjs` runs only in Node.js, never in the browser. In your Git-ignored `.env`, set `AZURE_OPENAI_API_KEY`, `AZURE_OPENAI_IMAGE_ENDPOINT` (the HTTPS `services.ai.azure.com/openai/v1/images/generations` URL), and `AZURE_OPENAI_IMAGE_DEPLOYMENT`. The legacy `OPENAI_API_KEY` variable is also accepted. Never prefix the key with `VITE_`, commit it, or paste it into chat.

Run `node scripts/generate-foundry-artwork.mjs --check` to validate configuration without a paid request. Select `--asset=hero`, `--asset=supply`, `--asset=sculpture` or `--asset=material` to choose the preset. Running without `--check` makes one billable medium-quality image request and saves the corresponding JPEG in `public/images`. The tested `gpt-image-2` deployment accepts JPEG and PNG, not WebP. The script refuses to overwrite an existing image and does not automatically retry failures. Keep the checked-in artwork for ordinary builds; no generation credentials are needed to run or deploy the website.

The site no longer displays architecture, house or office stock photos. Earlier unused files remain in `public/images`; their source credits are retained for reference:

- Original architecture image (unused): https://images.unsplash.com/photo-1487958449943-2429e8be8625
- Previous architecture concept (unused): https://images.unsplash.com/photo-1600585154340-be6161a56a0c
- Previous office image (unused): https://images.unsplash.com/photo-1497366754035-f200968a6e72

Review the [Unsplash license](https://unsplash.com/license) and any applicable third-party rights for your intended use. Fonts are Archivo, IBM Plex Mono, Manrope and Space Grotesk, distributed through Fontsource. UI icons use Lucide.
