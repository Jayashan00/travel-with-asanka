#!/usr/bin/env node
/**
 * Downloads real photographs for the Travel With Asanka site.
 *
 * Sources, in order of preference per image:
 *   1. Wikimedia Commons  — free, no API key, and the best source for *specific* subjects
 *                           (Sigiriya itself, a Toyota Hiace itself). Licences are CC/public
 *                           domain and require credit, which this script writes to CREDITS.md.
 *   2. Pexels             — free stock, needs a free API key, better for atmosphere shots.
 *                           Set PEXELS_KEY to enable it as a fallback.
 *
 * Usage, from the project root:
 *   node fetch-photos.mjs                      # Wikimedia only
 *   PEXELS_KEY=your_key node fetch-photos.mjs  # Wikimedia, falling back to Pexels
 *   node fetch-photos.mjs --only=vehicles      # just one group
 *   node fetch-photos.mjs --force              # re-download files that already exist
 *
 * Output: frontend/public/images/{hero,places,vehicles,gallery}/*.jpg  + CREDITS.md
 */

import fs from 'node:fs/promises'
import { createWriteStream } from 'node:fs'
import path from 'node:path'
import https from 'node:https'
import { pipeline } from 'node:stream/promises'

const ROOT = path.resolve('frontend/public/images')
const PEXELS_KEY = process.env.PEXELS_KEY || ''
const args = process.argv.slice(2)
const FORCE = args.includes('--force')
const ONLY = (args.find((a) => a.startsWith('--only=')) || '').split('=')[1] || ''
const UA = 'TravelWithAsanka-photo-fetcher/1.0 (website build; contact: info@travelwithasanka.com)'

/* ------------------------------------------------------------------ targets
   file      : the filename the website expects (do not rename these)
   commons   : Wikimedia Commons search terms, tried in order
   pexels    : fallback search used only when a PEXELS_KEY is set
*/
const PLACES = [
  ['sigiriya', ['Sigiriya rock fortress', 'Sigiriya'], 'Sigiriya Sri Lanka'],
  ['dambulla', ['Dambulla cave temple interior', 'Dambulla Royal Cave Temple'], 'Dambulla temple'],
  ['kandy', ['Temple of the Tooth Kandy', 'Sri Dalada Maligawa'], 'Kandy Sri Lanka temple'],
  ['anuradhapura', ['Ruwanwelisaya', 'Anuradhapura stupa'], 'Anuradhapura'],
  ['polonnaruwa', ['Gal Vihara Polonnaruwa', 'Polonnaruwa ruins'], 'Polonnaruwa'],
  ['ella', ['Ella Sri Lanka landscape', 'Ella Gap'], 'Ella Sri Lanka'],
  ['nine-arch-bridge', ['Nine Arch Bridge Demodara', 'Nine Arches Bridge Ella'], 'Nine Arch Bridge'],
  ['nuwara-eliya', ['Tea plantation Nuwara Eliya', 'Nuwara Eliya'], 'tea plantation Sri Lanka'],
  ['haputale', ['Haputale', "Lipton's Seat"], 'Haputale Sri Lanka'],
  ['adams-peak', ["Adam's Peak Sri Lanka", 'Sri Pada'], "Adams Peak Sri Lanka"],
  ['ravana-falls', ['Ravana Falls', 'Ravana Ella Falls'], 'waterfall Sri Lanka'],
  ['kaudulla', ['Kaudulla National Park', 'Elephants Kaudulla'], 'Sri Lanka elephants'],
  ['minneriya', ['Minneriya National Park elephants', 'Minneriya tank'], 'elephant herd Sri Lanka'],
  ['wilpattu', ['Wilpattu National Park', 'Wilpattu villu'], 'Wilpattu'],
  ['yala', ['Yala National Park leopard', 'Sri Lankan leopard Yala'], 'Sri Lankan leopard'],
  ['udawalawe', ['Udawalawe National Park elephant', 'Udawalawe'], 'Udawalawe elephant'],
  ['mirissa', ['Mirissa beach', 'Mirissa Sri Lanka'], 'Mirissa beach Sri Lanka'],
  ['unawatuna', ['Unawatuna beach', 'Unawatuna'], 'Unawatuna beach'],
  ['hikkaduwa', ['Hikkaduwa beach', 'Hikkaduwa coral'], 'Hikkaduwa'],
  ['arugam-bay', ['Arugam Bay', 'Arugam Bay surfing'], 'Arugam Bay surf'],
  ['trincomalee', ['Nilaveli beach', 'Trincomalee'], 'Trincomalee beach'],
  ['galle-fort', ['Galle Fort lighthouse', 'Galle Fort ramparts'], 'Galle Fort Sri Lanka'],
  ['colombo', ['Colombo skyline', 'Galle Face Green Colombo'], 'Colombo Sri Lanka'],
  ['negombo', ['Negombo fishing boats', 'Negombo beach'], 'Negombo Sri Lanka'],
]

const VEHICLES = [
  ['suzuki-alto', ['Suzuki Alto 2015', 'Suzuki Alto hatchback'], 'small hatchback car'],
  ['suzuki-wagon-r', ['Suzuki Wagon R', 'Suzuki Wagon R hybrid'], 'compact tall car'],
  ['honda-fit', ['Honda Fit hybrid', 'Honda Fit GP5'], 'honda hatchback'],
  ['toyota-vitz', ['Toyota Vitz', 'Toyota Yaris hatchback'], 'toyota hatchback'],
  ['toyota-prius', ['Toyota Prius', 'Toyota Prius 2012'], 'toyota prius'],
  ['toyota-axio', ['Toyota Corolla Axio', 'Toyota Corolla sedan'], 'toyota sedan'],
  ['toyota-premio', ['Toyota Premio', 'Toyota Allion'], 'toyota sedan car'],
  ['toyota-hiace-kdh', ['Toyota HiAce', 'Toyota HiAce KDH'], 'white passenger van'],
  ['hiace-high-roof', ['Toyota HiAce high roof', 'Toyota HiAce van'], 'high roof van'],
  ['nissan-caravan', ['Nissan Caravan', 'Nissan NV350'], 'passenger van'],
  ['toyota-prado-suv', ['Toyota Land Cruiser Prado', 'Toyota Prado 150'], 'toyota suv'],
  ['mitsubishi-montero', ['Mitsubishi Pajero Sport', 'Mitsubishi Montero Sport'], 'mitsubishi suv'],
  ['safari-jeep', ['Safari jeep Yala National Park', 'Safari jeep Sri Lanka'], 'safari jeep'],
  ['coaster-bus', ['Toyota Coaster', 'Toyota Coaster minibus'], 'minibus'],
  ['luxury-coach', ['Tourist coach bus', 'Luxury coach bus'], 'tour bus coach'],
  ['tuk-tuk', ['Auto rickshaw Sri Lanka', 'Tuk tuk Sri Lanka'], 'tuk tuk Sri Lanka'],
]

// Hero and gallery reuse the place photos, so nothing is downloaded twice.
const HERO_FROM_PLACES = [
  ['hero-sigiriya', 'sigiriya'],
  ['hero-tea-country', 'nuwara-eliya'],
  ['hero-safari', 'minneriya'],
  ['hero-south-coast', 'mirissa'],
  ['hero-train', 'nine-arch-bridge'],
  ['hero-galle', 'galle-fort'],
  ['about-team', 'ella'],
  ['about-together', 'haputale'],
  ['ceylon', 'sigiriya'],
  ['contact-hero', 'kandy'],
]

const GALLERY_FROM_PLACES = [
  'sigiriya', 'dambulla', 'kandy', 'anuradhapura', 'polonnaruwa',
  'ella', 'nuwara-eliya', 'haputale', 'adams-peak', 'ravana-falls',
  'kaudulla', 'minneriya', 'wilpattu', 'yala', 'udawalawe',
  'mirissa', 'unawatuna', 'hikkaduwa', 'arugam-bay', 'trincomalee',
]

/* ------------------------------------------------------------------ http */
function getJson(url, headers = {}) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { 'User-Agent': UA, ...headers } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          res.resume()
          return resolve(getJson(res.headers.location, headers))
        }
        if (res.statusCode !== 200) {
          res.resume()
          return reject(new Error(`HTTP ${res.statusCode}`))
        }
        let body = ''
        res.setEncoding('utf8')
        res.on('data', (c) => (body += c))
        res.on('end', () => {
          try {
            resolve(JSON.parse(body))
          } catch (e) {
            reject(e)
          }
        })
      })
      .on('error', reject)
  })
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { 'User-Agent': UA } }, async (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          res.resume()
          return resolve(download(res.headers.location, dest))
        }
        if (res.statusCode !== 200) {
          res.resume()
          return reject(new Error(`HTTP ${res.statusCode}`))
        }
        try {
          await pipeline(res, createWriteStream(dest))
          resolve()
        } catch (e) {
          reject(e)
        }
      })
      .on('error', reject)
  })
}

/* ------------------------------------------------------------------ sources */
const strip = (html) => (html || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()

async function fromCommons(term) {
  const url =
    'https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*' +
    '&generator=search&gsrnamespace=6&gsrlimit=8' +
    `&gsrsearch=${encodeURIComponent(term)}` +
    '&prop=imageinfo&iiprop=url|size|extmetadata&iiurlwidth=1600'

  const data = await getJson(url)
  const pages = Object.values(data?.query?.pages || {})
  for (const page of pages) {
    const info = page?.imageinfo?.[0]
    if (!info) continue
    const title = String(page.title || '')
    if (!/\.(jpe?g|png)$/i.test(title)) continue          // skip svg, gif, audio, video
    if (info.width && info.width < 1100) continue          // too small for a banner
    const meta = info.extmetadata || {}
    return {
      url: info.thumburl || info.url,
      credit: {
        source: 'Wikimedia Commons',
        title: title.replace(/^File:/, ''),
        author: strip(meta.Artist?.value) || 'Unknown',
        licence: strip(meta.LicenseShortName?.value) || 'See file page',
        page: info.descriptionurl || '',
      },
    }
  }
  return null
}

async function fromPexels(query) {
  if (!PEXELS_KEY) return null
  const url =
    'https://api.pexels.com/v1/search?per_page=5&orientation=landscape&size=large' +
    `&query=${encodeURIComponent(query)}`
  const data = await getJson(url, { Authorization: PEXELS_KEY })
  const photo = (data?.photos || [])[0]
  if (!photo) return null
  return {
    url: photo.src?.large2x || photo.src?.large || photo.src?.original,
    credit: {
      source: 'Pexels',
      title: photo.alt || query,
      author: photo.photographer || 'Unknown',
      licence: 'Pexels licence (free to use)',
      page: photo.url || '',
    },
  }
}

/* ------------------------------------------------------------------ run */
const credits = []
let ok = 0
let failed = []

async function fetchOne(folder, name, commonsTerms, pexelsQuery) {
  const dir = path.join(ROOT, folder)
  await fs.mkdir(dir, { recursive: true })
  const dest = path.join(dir, `${name}.jpg`)

  if (!FORCE) {
    try {
      await fs.access(dest)
      console.log(`  = ${folder}/${name}.jpg already there, skipping`)
      return true
    } catch {
      /* not downloaded yet */
    }
  }

  for (const term of commonsTerms) {
    try {
      const hit = await fromCommons(term)
      if (hit) {
        await download(hit.url, dest)
        credits.push({ file: `${folder}/${name}.jpg`, ...hit.credit })
        console.log(`  + ${folder}/${name}.jpg  <- Commons "${term}"`)
        return true
      }
    } catch (e) {
      /* try the next term */
    }
  }

  try {
    const hit = await fromPexels(pexelsQuery)
    if (hit) {
      await download(hit.url, dest)
      credits.push({ file: `${folder}/${name}.jpg`, ...hit.credit })
      console.log(`  + ${folder}/${name}.jpg  <- Pexels "${pexelsQuery}"`)
      return true
    }
  } catch (e) {
    /* fall through to the failure list */
  }

  console.log(`  ! ${folder}/${name}.jpg  NOT FOUND — add this one by hand`)
  failed.push(`${folder}/${name}.jpg`)
  return false
}

async function copyFrom(placesName, folder, targetName) {
  const src = path.join(ROOT, 'places', `${placesName}.jpg`)
  const dir = path.join(ROOT, folder)
  await fs.mkdir(dir, { recursive: true })
  const dest = path.join(dir, `${targetName}.jpg`)
  try {
    await fs.copyFile(src, dest)
    console.log(`  + ${folder}/${targetName}.jpg  <- copy of places/${placesName}.jpg`)
    return true
  } catch {
    console.log(`  ! ${folder}/${targetName}.jpg  skipped (source photo missing)`)
    failed.push(`${folder}/${targetName}.jpg`)
    return false
  }
}

async function main() {
  console.log('\nDownloading real photographs into frontend/public/images/\n')
  if (!PEXELS_KEY) {
    console.log('No PEXELS_KEY set — using Wikimedia Commons only.')
    console.log('For a free key: https://www.pexels.com/api/  then run:')
    console.log('  PEXELS_KEY=your_key node fetch-photos.mjs\n')
  }

  if (!ONLY || ONLY === 'places') {
    console.log('Places:')
    for (const [name, terms, pexels] of PLACES) {
      if (await fetchOne('places', name, terms, pexels)) ok++
    }
  }

  if (!ONLY || ONLY === 'vehicles') {
    console.log('\nVehicles:')
    for (const [name, terms, pexels] of VEHICLES) {
      if (await fetchOne('vehicles', name, terms, pexels)) ok++
    }
  }

  if (!ONLY || ONLY === 'hero') {
    console.log('\nHero banners:')
    for (const [target, source] of HERO_FROM_PLACES) {
      if (await copyFrom(source, 'hero', target)) ok++
    }
  }

  if (!ONLY || ONLY === 'gallery') {
    console.log('\nGallery:')
    for (let i = 0; i < GALLERY_FROM_PLACES.length; i++) {
      const target = `gallery-${String(i + 1).padStart(2, '0')}`
      if (await copyFrom(GALLERY_FROM_PLACES[i], 'gallery', target)) ok++
    }
  }

  if (credits.length) {
    const lines = [
      '# Photo credits',
      '',
      'Photographs used on this site, with the author and licence for each.',
      'Wikimedia Commons images are usually CC BY or CC BY-SA, which means the credit below',
      'must stay visible somewhere on the site (a credits page in the footer is enough).',
      'Pexels photos do not require credit, but it is good manners.',
      '',
      '| File | Subject | Author | Licence | Source |',
      '|---|---|---|---|---|',
      ...credits.map(
        (c) => `| ${c.file} | ${c.title} | ${c.author} | ${c.licence} | ${c.page || c.source} |`,
      ),
      '',
    ]
    await fs.writeFile(path.join(ROOT, 'CREDITS.md'), lines.join('\n'))
    console.log(`\nWrote ${credits.length} credits to frontend/public/images/CREDITS.md`)
  }

  console.log(`\nDone. ${ok} images in place.`)
  if (failed.length) {
    console.log(`\n${failed.length} still need a photo — download one yourself and save it with`)
    console.log('exactly this name, or upload it later from the admin panel:')
    failed.forEach((f) => console.log(`  frontend/public/images/${f}`))
  }
  console.log('\nCheck every photo before showing the client. Anything that looks wrong,')
  console.log('replace it from the admin panel — the filename does not have to change.\n')
}

main().catch((e) => {
  console.error('\nThe script stopped:', e.message)
  console.error('Check your internet connection and try again.\n')
  process.exit(1)
})
