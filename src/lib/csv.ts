import { Parser } from 'json2csv';
import { Response } from 'express';

export function sendCsv(res: Response, data: Record<string, unknown>[], filename: string, fields?: string[]) {
  const parser = new Parser({ fields: fields || Object.keys(data[0] || {}) });
  const csv = parser.parse(data);

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.send('\uFEFF' + csv); // BOM for Excel UTF-8
}
