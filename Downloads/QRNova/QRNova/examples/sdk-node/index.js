// Create a dynamic QR code on your QRNova server and print its analytics.
//
//   QRNova_URL=http://localhost QRNova_API_KEY=qrf_... node index.js
import { writeFile } from "node:fs/promises";
import { QRNova, QRNovaAPIError } from "@QRNova/sdk";
import { generateQR } from "@qrforge/core";

const { QRNova_URL, QRNova_API_KEY } = process.env;
if (!QRNova_URL || !QRNova_API_KEY) {
  console.error("Set QRNova_URL and QRNova_API_KEY (create a key under Dashboard → API keys).");
  process.exit(1);
}

const client = new QRNova({ baseUrl: QRNova_URL, apiKey: QRNova_API_KEY });

try {
  // 1. Create a dynamic code that redirects to a destination you can change later.
  const qr = await client.qrcodes.create({
    name: "SDK example",
    kind: "dynamic",
    destination: "https://example.com",
    utm: { source: "sdk-example", medium: "qr" },
  });
  console.log(`Created ${qr.id} → ${qr.redirect_url}`);

  // 2. Render the printable code locally. It encodes the short redirect URL.
  await writeFile("qrcode.svg", await generateQR({ data: qr.redirect_url, format: "svg" }));
  console.log("Saved qrcode.svg");

  // 3. Change where it points — the printed code keeps working.
  await client.qrcodes.update(qr.id, { destination: "https://example.com/new" });

  // 4. Read anonymous analytics for the last 30 days.
  const stats = await client.qrcodes.analytics(qr.id, { range: "30d" });
  console.log(`Total scans: ${stats.totals.total_scans} (unique ${stats.totals.unique_scans})`);

  // 5. Iterate over every code in your account.
  let count = 0;
  for await (const code of client.qrcodes.listAll()) {
    count++;
    console.log(`  ${code.kind.padEnd(7)} ${code.name}`);
  }
  console.log(`${count} codes in total`);
} catch (error) {
  if (error instanceof QRNovaAPIError) {
    console.error(`API error ${error.status} (${error.code}): ${error.message}`);
    if (error.fields) console.error(error.fields);
    process.exit(1);
  }
  throw error;
}
