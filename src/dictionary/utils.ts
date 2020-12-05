export function removeAffixComments(data: string): string {
  // Remove comments
  data = data.replace(/#.*$/mg, '')

  // Trim each line
  data = data.replace(/^\s\s*/m, '').replace(/\s\s*$/m, '')

  // Remove blank lines.
  data = data.replace(/\n{2,}/g, '\n')

  // Trim the entire string
  return data.trim()
}

export function removeDicComments(data: string): string {
  // I can't find any official documentation on it, but at least the de_DE
  // dictionary uses tab-indented lines as comments.

  return data.replace(/^\t.*$/mg, '')
}
