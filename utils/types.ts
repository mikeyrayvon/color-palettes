export interface Color {
  order: number
  id: number
  hex: string
  rgb: string
  name?: string
}

export interface Palette {
  id: number
  created_at: Date
  title: string
  description: string
  colorIds: number[]
}