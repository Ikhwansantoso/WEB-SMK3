export interface ParsedPhoto {
  stamped: string | null
  original: string | null
  primary: string | null
  hasBoth: boolean
}

export function parsePhotoEvidence(data: string | null | undefined): ParsedPhoto {
  if (!data) {
    return { stamped: null, original: null, primary: null, hasBoth: false }
  }

  const trimmed = data.trim()
  if (trimmed.startsWith('{')) {
    try {
      const parsed = JSON.parse(trimmed)
      const stamped = parsed.stamped || parsed.url || null
      const original = parsed.original || null
      return {
        stamped,
        original,
        primary: stamped || original,
        hasBoth: Boolean(stamped && original)
      }
    } catch {
      // fallback if JSON parsing fails
    }
  }

  return {
    stamped: data,
    original: null,
    primary: data,
    hasBoth: false
  }
}
