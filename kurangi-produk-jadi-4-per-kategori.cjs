/*
 * Tennis Gear - batasi katalog menjadi 4 produk per kategori.
 * Jalankan dari folder root TennisGear-PWA:
 *   node kurangi-produk-jadi-4-per-kategori.cjs
 *
 * Script ini mengubah HANYA server/data/products.json di komputer pengguna.
 * Foto yang sudah ditambahkan pada produk yang dipertahankan tidak diubah.
 */
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const dataFile = path.join(root, 'server', 'data', 'products.json');
const categories = ['rackets', 'shoes', 'bags', 'accessories'];

try {
  if (!fs.existsSync(dataFile)) {
    throw new Error('File server/data/products.json tidak ditemukan. Jalankan perintah dari folder TennisGear-PWA.');
  }

  const original = fs.readFileSync(dataFile, 'utf8');
  const products = JSON.parse(original);
  if (!Array.isArray(products)) {
    throw new Error('Isi products.json harus berupa array/list produk.');
  }

  // Jangan memodifikasi data bila ada kategori yang tak lengkap.
  for (const category of categories) {
    const count = products.filter(p => p?.category === category).length;
    if (count < 4) throw new Error(`Kategori ${category} hanya punya ${count} produk (minimal 4 diperlukan). File tidak diubah.`);
  }

  // Urutan produk asli tetap dipertahankan. Field image dan field lain tetap utuh.
  const counts = Object.fromEntries(categories.map(c => [c, 0]));
  const kept = products.filter(p => {
    if (!p || !categories.includes(p.category)) return false;
    if (counts[p.category] >= 4) return false;
    counts[p.category] += 1;
    return true;
  });

  const backupFile = path.join(root, 'server', 'data', 'products.backup-' + new Date().toISOString().replace(/[:.]/g, '-') + '.json');
  fs.writeFileSync(backupFile, original, { flag: 'wx' });
  fs.writeFileSync(dataFile, JSON.stringify(kept, null, 2) + '\n', 'utf8');

  console.log('BERHASIL! Katalog Tennis Gear sekarang berisi 16 produk:');
  for (const category of categories) {
    console.log(`  ${category}: ${kept.filter(p => p.category === category).length}`);
  }
  console.log('\nProduk yang dipertahankan:');
  for (const p of kept) console.log(`  - ${p.category}: ${p.brand} ${p.name}`);
  console.log('\nBackup dibuat di: ' + path.relative(root, backupFile));
  console.log('Field image/foto produk yang sudah ada tetap dipertahankan.');
} catch (error) {
  console.error('GAGAL: ' + error.message);
  process.exitCode = 1;
}
