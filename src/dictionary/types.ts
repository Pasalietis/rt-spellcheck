export type AfxRules = {
  remove: RegExp
  add: string
  check: RegExp
}

export type Afx = AfxRules & {
  code: string
  combinable: boolean
}
