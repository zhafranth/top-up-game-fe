import { format as formatDateFns, parseISO } from "date-fns"

/**
 * Memformat tanggal berdasarkan pola format yang ditentukan.
 *
 * - Menerima input Date atau string tanggal.
 * - Mendukung format gaya "YYYY-MM-DD" (default), dipetakan ke token date-fns.
 *
 * Contoh:
 *   formatDate(new Date(), "YYYY-MM-DD")
 *   formatDate("2025-11-23", "YYYY/MM/DD")
 *
 * @param value Nilai tanggal (Date atau string)
 * @param formatStr Pola format, contoh: "YYYY-MM-DD". Default: "YYYY-MM-DD".
 * @returns String hasil format, atau string kosong jika input tidak valid.
 */
export function formatDate(value: Date | string, formatStr: string = "YYYY-MM-DD"): string {
  const date = toValidDate(value)
  if (!date) return ""

  const mappedFormat = mapUserFormatToDateFns(formatStr || "YYYY-MM-DD")

  try {
    return formatDateFns(date, mappedFormat)
  } catch {
    // Fallback minimal jika format tidak valid
    try {
      return formatDateFns(date, "yyyy-MM-dd")
    } catch {
      return ""
    }
  }
}

/** Mencoba mengubah input menjadi Date valid */
function toValidDate(input: Date | string): Date | null {
  if (input instanceof Date) {
    return isNaN(input.getTime()) ? null : input
  }

  if (typeof input === "string") {
    // Coba parse sebagai ISO terlebih dahulu
    let d = parseISO(input)
    if (!isNaN(d.getTime())) return d

    // Coba Date native
    d = new Date(input)
    if (!isNaN(d.getTime())) return d

    // Coba sebagai timestamp (ms)
    const ts = Number(input)
    if (!Number.isNaN(ts)) {
      d = new Date(ts)
      if (!isNaN(d.getTime())) return d
    }
    return null
  }

  return null
}

/**
 * Memetakan token format gaya umum (YYYY, MM, DD, HH, mm, ss) ke token date-fns.
 * Hanya token yang umum dipakai yang didukung.
 */
function mapUserFormatToDateFns(userFormat: string): string {
  let f = userFormat

  // Urutan penting untuk menghindari konflik penggantian
  f = f.replace(/YYYY/g, "yyyy")
  f = f.replace(/YY/g, "yy")

  f = f.replace(/DD/g, "dd")
  // Single day
  f = f.replace(/D/g, "d")

  // Month
  f = f.replace(/MM/g, "MM") // tetap
  f = f.replace(/M/g, "M") // tetap

  // Hour (24h / 12h)
  f = f.replace(/HH/g, "HH")
  f = f.replace(/H/g, "H")
  f = f.replace(/hh/g, "hh")
  f = f.replace(/h/g, "h")

  // Minute, Second
  f = f.replace(/mm/g, "mm")
  f = f.replace(/m/g, "m")
  f = f.replace(/ss/g, "ss")
  f = f.replace(/s/g, "s")

  // Meridiem (AM/PM) sederhana
  f = f.replace(/A/g, "a")
  f = f.replace(/a/g, "a")

  return f
}