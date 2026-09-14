import { loadEnvFile } from 'node:process'
import { access, mkdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const root = new URL('../', import.meta.url)
loadEnvFile(fileURLToPath(new URL('.env', root)))
const endpoint = new URL(process.env.AZURE_OPENAI_IMAGE_ENDPOINT)
const key = process.env.AZURE_OPENAI_API_KEY || process.env.OPENAI_API_KEY
const deployment = process.env.AZURE_OPENAI_IMAGE_DEPLOYMENT
const assetName = process.argv.find((argument) => argument.startsWith('--asset='))?.split('=')[1] ?? 'supply'
const assets = {
  hero: {
    file: 'netdin-signal-hero.jpg', size: '1536x1024',
    prompt: 'Create an original premium art-directed architectural photograph for the independent creative technology studio Netdin. Landscape 3:2 image, edge-to-edge physical environment, no borders. A monumental SIGNAL LOOM: dozens of parallel glossy vermilion red optical conduits bend together through a precise ninety degree corner, connecting a tall brushed aluminum perforated matrix to a low horizontal chrome chassis. A beautifully engineered continuous flowing bundle, ordered like a typographic ligature, with fine seams, realistic ribbing and red reflections. This is one large grounded installation, not a small product on a pedestal. On the RIGHT 60 percent of the image, it fills the frame with confident architectural scale, seen close from a low three-quarter perspective. Pure pale cool grey gallery floor and wall, strong clean daylight, crisp soft-edged shadows, photographic material detail. The LEFT 40 percent is uninterrupted nearly white architecture with no objects or shadow, reserved for black website typography. The installation occupies the right middle of the frame from x=48 to 96 percent, y=22 to 78 percent so it survives a wide website crop. Red conduits and silver metal dominate, one tiny citron connector detail. Sophisticated experimental design meets precise engineering, as photographed on a medium format camera for a contemporary design journal. No text, no letters, no logos, no laptops, no phones, no dashboards, no people, no floating objects, no spheres, no gradients, no neon science fiction, no dark background. Visually arresting real materiality, original artistic installation, not a generic stock office or corporate technology illustration.',
  },
  supply: { file: 'supply-editorial.jpg', size: '1536x1024' },
  sculpture: {
    file: 'netdin-sculpture.jpg', size: '1536x1024',
    prompt: 'An extraordinarily refined high-end CGI product photograph of a custom sculptural uppercase letter N, built from three thick precision-machined modular beams with subtly rounded edges. The left vertical beam is glossy electric cobalt blue enamel, the diagonal beam is polished mirror chrome, the right vertical beam is rich vermilion red enamel. Thin acid-yellow inset seams and small recessed mechanical details. The sculpture is freestanding on a continuous pale icy grey studio floor with a beautiful soft contact shadow. Clear recognizable letter N silhouette. Three quarter view at eye level, luxury industrial design, detailed realistic metal reflections, large softbox lighting, tactile solid materials, the quality of a collectible design object photographed for a contemporary Swiss design museum. Place the entire sculpture centered in the RIGHT HALF of a landscape 3:2 frame; left 45 percent is completely empty pale grey negative space. Object completely visible with ample margins, no crop. No text, no other letters, no logo labels, no people, no cards, no spheres, no particles, no black background, no gradient graphics, no decorative props. A single genuinely physical sculptural object, not a flat graphic. Original bespoke object for the independent digital studio Netdin.',
  },
  material: {
    file: 'netdin-material.jpg', size: '1024x1024',
    prompt: 'Create a flat full-bleed square original Swiss industrial graphic design material sheet for the independent digital studio netdin. This is a crisp texture to print on physical objects, NOT a photographed mockup. Exact large lowercase black word netdin appears once in the upper left third. White and very pale ice grey base, strong electric cobalt blue rectangular block occupying bottom left third, one vermilion red horizontal bar, small acid yellow square in upper right, a precise black fine-line engineering grid in the lower right, small fine black registration crosses, finely composed technical microtypography reading INDEPENDENT DESIGN ENGINEERING and SERIES 001. Refined radical editorial graphic design, clear geometric hierarchy, hard edges, flat ink, restrained asymmetry, exquisite typography, 15 percent safe margins for text. No gradients, no shadows, no 3D perspective, no people, no spheres, no other brands. Texture fills entire square with no border.',
  },
}
const asset = assets[assetName]
if (!asset) throw new Error('Choose --asset=hero, --asset=supply, --asset=sculpture or --asset=material.')
const output = new URL(`public/images/${asset.file}`, root)

if (endpoint.protocol !== 'https:' || !endpoint.hostname.endsWith('.services.ai.azure.com') || endpoint.pathname !== '/openai/v1/images/generations') {
  throw new Error('An Azure Foundry HTTPS image-generation endpoint is required.')
}
if (!key?.trim() || !deployment?.trim()) throw new Error('Image API key and deployment name are required.')
endpoint.searchParams.set('api-version', 'preview')

if (process.argv.includes('--check')) {
  console.log('Foundry configuration valid. No API request sent.')
} else {
  let exists = false
  try { await access(output); exists = true } catch (error) { if (error.code !== 'ENOENT') throw error }
  if (exists) throw new Error('Artwork already exists; choose a new output before requesting another paid generation.')
  console.log(`Generating one ${assetName} concept with Azure Foundry. This is a billable image request.`)
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      redirect: 'error',
      signal: AbortSignal.timeout(240_000),
      headers: { 'Content-Type': 'application/json', 'api-key': key },
      body: JSON.stringify({
        model: deployment,
        n: 1,
        size: asset.size,
        quality: 'medium',
        output_format: 'jpeg',
        output_compression: 90,
        prompt: asset.prompt ?? 'Create an exceptionally polished editorial brand identity presentation for a fictional independent digital design goods brand named supply. Photograph a carefully art-directed physical brand system from overhead with a very slight perspective on a pale cool blue seamless surface: a large cobalt-blue folded printed poster with the exact lowercase word supply in white modern sans-serif, a white brand guideline booklet with precise navy typography and a simple modular square grid, two small crimson red and pale chartreuse color-swatch cards, and a silver laptop displaying a clean digital design-component storefront with small accurate modular UI panels. The actual designed objects are the subject: tack sharp, fully legible supply wordmark, exquisite paper stock texture, realistic soft directional daylight, quiet shadows, disciplined asymmetric Swiss graphic design composition. Main objects completely inside the frame with generous 8 percent margins. Cool off-white, cobalt, muted red and tiny chartreuse accents. No people, no hands, no coffee, no plants, no floating objects, no spheres, no gradients, no stock-photo office, no extra logos, no fake client endorsements. Wide landscape 3:2 composition, premium independent design studio case study, original fictional concept, not a real client project.',
      }),
    })
    if (!response.ok) {
      const failure = await response.json().catch(() => null)
      const detail = typeof failure?.error?.message === 'string' ? failure.error.message.slice(0, 1200) : 'No error detail provided.'
      throw new Error(`Azure returned HTTP ${response.status}: ${detail} No automatic retry was made.`)
    }
    const result = await response.json()
    if (typeof result.data?.[0]?.b64_json !== 'string') throw new Error('Azure returned no image data.')
    const image = Buffer.from(result.data[0].b64_json, 'base64')
    if (image[0] !== 0xff || image[1] !== 0xd8 || image[2] !== 0xff) throw new Error('Unexpected image format; expected JPEG.')
    await mkdir(new URL('public/images/', root), { recursive: true })
    await writeFile(output, image, { flag: 'wx' })
    console.log(`Saved public/images/${asset.file} (${Math.round(image.length / 1024)} KB).`)
  } catch (error) {
    console.error(error instanceof Error ? error.message.replaceAll(key, '[redacted]') : 'Image generation failed.')
    process.exitCode = 1
  }
}