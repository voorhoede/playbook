declare module '@localSearchIndex' {
  const data: Record<string, () => Promise<{ default: string }>>
  export default data
}
