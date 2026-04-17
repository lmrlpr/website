import sharp from 'sharp'
import { readdir, unlink } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dir = path.join(__dirname, '..', 'public', 'design')

const files = (await readdir(dir)).filter(f => f.endsWith('.jpeg'))
console.log(`Converting ${files.length} JPEG files to WebP at quality 65…`)

for (const f of files) {
  const src = path.join(dir, f)
  const outName = f.replace(/\s+/g, '').replace('.jpeg', '.webp')
  const out = path.join(dir, outName)
  await sharp(src).webp({ quality: 65 }).toFile(out)
  await unlink(src)
  console.log(`  ${f} → ${outName}`)
}

console.log('Done.')
