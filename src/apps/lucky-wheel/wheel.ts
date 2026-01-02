export interface Segment {
  label: string
  color: string
}

const DEFAULT_COLORS = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#45B7D1', // Blue
  '#96CEB4', // Green
  '#FFEAA7', // Yellow
  '#DDA0DD', // Plum
  '#98D8C8', // Mint
  '#F7DC6F', // Gold
]

export class LuckyWheel {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private segments: Segment[] = []
  private rotation = 0
  private isSpinning = false
  private onResult: ((segment: Segment) => void) | null = null

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas 2D context not supported')
    this.ctx = ctx

    this.setupCanvas()
    this.setDefaultSegments()
  }

  private setupCanvas(): void {
    const dpr = window.devicePixelRatio || 1
    const size = Math.min(window.innerWidth - 48, 400)

    this.canvas.width = size * dpr
    this.canvas.height = size * dpr
    this.canvas.style.width = `${size}px`
    this.canvas.style.height = `${size}px`

    this.ctx.scale(dpr, dpr)
  }

  private setDefaultSegments(): void {
    this.segments = [
      { label: 'Giải nhất', color: '#FFD700' },
      { label: 'Giải nhì', color: '#C0C0C0' },
      { label: 'Giải ba', color: '#CD7F32' },
      { label: 'Chúc may mắn', color: '#4ECDC4' },
      { label: 'Thử lại', color: '#666666' },
      { label: 'Giải khuyến khích', color: '#FF6B6B' },
    ]
    this.draw()
  }

  setSegments(labels: string[]): void {
    this.segments = labels.map((label, i) => ({
      label,
      color: DEFAULT_COLORS[i % DEFAULT_COLORS.length],
    }))
    this.draw()
  }

  setOnResult(callback: (segment: Segment) => void): void {
    this.onResult = callback
  }

  private draw(): void {
    const { ctx, canvas, segments, rotation } = this
    const size = parseInt(canvas.style.width)
    const centerX = size / 2
    const centerY = size / 2
    const radius = size / 2 - 10

    ctx.clearRect(0, 0, size, size)

    if (segments.length === 0) return

    const arc = (2 * Math.PI) / segments.length

    segments.forEach((segment, i) => {
      const startAngle = rotation + i * arc - Math.PI / 2
      const endAngle = startAngle + arc

      // Draw segment
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, endAngle)
      ctx.closePath()
      ctx.fillStyle = segment.color
      ctx.fill()

      // Draw border
      ctx.strokeStyle = '#0d0d0d'
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw label
      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.rotate(startAngle + arc / 2)
      ctx.textAlign = 'right'
      ctx.fillStyle = this.getContrastColor(segment.color)
      ctx.font = 'bold 14px Inter, sans-serif'
      ctx.fillText(segment.label, radius - 20, 5)
      ctx.restore()
    })

    // Draw center circle
    ctx.beginPath()
    ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI)
    ctx.fillStyle = '#0d0d0d'
    ctx.fill()
    ctx.strokeStyle = '#333'
    ctx.lineWidth = 2
    ctx.stroke()
  }

  private getContrastColor(hex: string): string {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    return luminance > 0.5 ? '#000000' : '#ffffff'
  }

  spin(): void {
    if (this.isSpinning || this.segments.length === 0) return

    this.isSpinning = true
    const spinDuration = 4000 // 4 seconds
    const minRevolutions = 5
    const randomExtra = Math.random() * 2 * Math.PI
    const totalRotation = minRevolutions * 2 * Math.PI + randomExtra

    const startTime = performance.now()
    const startRotation = this.rotation

    const animate = (currentTime: number): void => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / spinDuration, 1)

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)

      this.rotation = startRotation + totalRotation * eased
      this.draw()

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        this.isSpinning = false
        this.announceResult()
      }
    }

    requestAnimationFrame(animate)
  }

  private announceResult(): void {
    if (this.segments.length === 0) return

    const normalizedRotation = this.rotation % (2 * Math.PI)
    const arc = (2 * Math.PI) / this.segments.length

    // Pointer is at top (12 o'clock), so we need to find which segment is there
    // Account for the -PI/2 offset in draw
    let pointerAngle = (2 * Math.PI - normalizedRotation) % (2 * Math.PI)
    const segmentIndex = Math.floor(pointerAngle / arc) % this.segments.length

    const result = this.segments[segmentIndex]
    if (this.onResult) {
      this.onResult(result)
    }
  }

  isCurrentlySpinning(): boolean {
    return this.isSpinning
  }

  resize(): void {
    this.setupCanvas()
    this.draw()
  }
}
