# Netdin

Independent digital studio website for **netdin.com**, built with React, TypeScript, Vite and Appwrite. Includes responsive project previews, service enquiries, FAQ and privacy dialogs. Fonts and visual assets are served locally.

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
- [x] Local production build, lint and 12 Chromium browser tests passed.
- [ ] Configure the real Appwrite project, table, permissions and build environment.
- [ ] Verify live writes and private enquiry access on the deployed hostname.
- [ ] Connect the Git repository to Appwrite Sites, then verify domain DNS and HTTPS.
- [ ] Confirm that `hello@netdin.com` receives mail and assign enquiry review ownership.
- [ ] Review privacy wording, retention practices, business details and public-form abuse controls before launch.

No real Appwrite project or public deployment has been provisioned by this repository alone.

## Content And Assets

Edit services, FAQs and project descriptions in `src/content.ts`, page structure in `src/App.tsx`, and styling in `src/site.css` and `src/index.css`. Enquiry submission is in `src/lib/enquiries.ts`. Keep its `consentVersion` aligned with material privacy-notice changes.

**Supply and Orbit are clearly labeled self-initiated concept explorations**, not claimed client engagements. Supply is a digital-goods storefront design with illustrative products and prices, not a working shop. Orbit's dashboard is an illustrative design preview, not a live operational application. Replace these with authorized client work when available. The studio section uses a responsive design-to-code workflow illustration, not office photography or an actual client project. Its interface data and code are illustrative.

The hero and portfolio artwork are custom local bitmaps built from the site's Supply and Orbit concept interfaces, not purchased stock or client-results claims. The hero has separate desktop and mobile compositions; portfolio artwork is lazy-loaded with reserved dimensions. Editable interface previews remain available in the project dialogs.

To regenerate all four assets, start the preview at http://127.0.0.1:5173 and run `node scripts/generate-product-hero.mjs` (requires the Playwright Chromium installation above). This writes `product-hero.png`, `product-hero-mobile.png`, `supply-study.png` and `orbit-study.png` in `public/images`. Responsive tests check hero clearance, decoded artwork, text sizes and overflow, and capture dedicated hero and project screenshots. Header, footer, contact dialog and favicon use dot-free Netdin branding.

The site no longer displays architecture, house or office stock photos. Earlier unused files remain in `public/images`; their source credits are retained for reference:

- Original architecture image (unused): https://images.unsplash.com/photo-1487958449943-2429e8be8625
- Previous architecture concept (unused): https://images.unsplash.com/photo-1600585154340-be6161a56a0c
- Previous office image (unused): https://images.unsplash.com/photo-1497366754035-f200968a6e72

Review the [Unsplash license](https://unsplash.com/license) and any applicable third-party rights for your intended use. Fonts are Manrope and Space Grotesk, distributed through Fontsource. UI icons use Lucide.
