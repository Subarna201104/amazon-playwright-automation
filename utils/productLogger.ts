import * as fs from 'fs';
import * as path from 'path';
import { ProductInfo } from '../pages/ProductPage';

export function writeProductLog(info: ProductInfo): string {
  const logsDir = path.join(process.cwd(), 'logs');
  fs.mkdirSync(logsDir, { recursive: true });

  const filePath = path.join(logsDir, 'product-details.log');
  const extraLines = Object.entries(info.extras)
    .filter(([, value]) => value)
    .map(([key, value]) => `${key}:\n${value}`)
    .join('\n\n');

  const content = [
    'Amazon.in Product Capture Log',
    `Captured at: ${info.capturedAt}`,
    `URL: ${info.url}`,
    '',
    '--- Mandatory fields ---',
    `Product Title: ${info.title}`,
    `Product Price: ${info.price}`,
    '',
    'Product Details:',
    info.productDetails,
    '',
    '--- Additional information ---',
    extraLines || '(none)',
    '',
  ].join('\n');

  fs.writeFileSync(filePath, content, 'utf8');
  return filePath;
}
