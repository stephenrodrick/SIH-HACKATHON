export interface ImageAnalysisResult {
  spectralData: Array<{ wavelength: number; absorbance: number }>
  detectedPeaks: number[]
  imageMetadata: {
    width: number
    height: number
    hasWavelengthAxis: boolean
    hasAbsorbanceAxis: boolean
    estimatedRange: {
      wavelength: [number, number]
      absorbance: [number, number]
    }
  }
  confidence: number
}

export class ImageProcessor {
  static async processSpectrographImage(file: File): Promise<ImageAnalysisResult> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = "anonymous"

      img.onload = () => {
        try {
          const result = this.analyzeSpectrographImage(img, file.name)
          resolve(result)
        } catch (error) {
          reject(error)
        }
      }

      img.onerror = () => reject(new Error("Failed to load image"))
      img.src = URL.createObjectURL(file)
    })
  }

  private static analyzeSpectrographImage(img: HTMLImageElement, filename: string): ImageAnalysisResult {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")!

    canvas.width = img.width
    canvas.height = img.height
    ctx.drawImage(img, 0, 0)

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data

    // Analyze image structure
    const metadata = this.analyzeImageStructure(data, canvas.width, canvas.height)

    // Extract spectral curve
    const spectralData = this.extractSpectralCurve(data, canvas.width, canvas.height, metadata)

    // Find peaks
    const detectedPeaks = this.findImagePeaks(spectralData)

    // Calculate confidence based on data quality
    const confidence = this.calculateConfidence(spectralData, metadata)

    return {
      spectralData,
      detectedPeaks,
      imageMetadata: metadata,
      confidence,
    }
  }

  private static analyzeImageStructure(data: Uint8ClampedArray, width: number, height: number) {
    // Analyze image to detect axes and estimate ranges
    const hasWavelengthAxis = this.detectHorizontalAxis(data, width, height)
    const hasAbsorbanceAxis = this.detectVerticalAxis(data, width, height)

    // Estimate wavelength range (common spectroscopy ranges)
    const estimatedWavelengthRange: [number, number] = hasWavelengthAxis ? [400, 800] : [200, 4000]
    const estimatedAbsorbanceRange: [number, number] = [0, 1]

    return {
      width,
      height,
      hasWavelengthAxis,
      hasAbsorbanceAxis,
      estimatedRange: {
        wavelength: estimatedWavelengthRange,
        absorbance: estimatedAbsorbanceRange,
      },
    }
  }

  private static detectHorizontalAxis(data: Uint8ClampedArray, width: number, height: number): boolean {
    // Look for horizontal lines in bottom 20% of image (typical axis location)
    const startY = Math.floor(height * 0.8)
    let horizontalLinePixels = 0

    for (let y = startY; y < height; y++) {
      for (let x = 0; x < width - 1; x++) {
        const idx = (y * width + x) * 4
        const nextIdx = (y * width + x + 1) * 4

        // Check if pixels are dark (likely axis line)
        const isDark = data[idx] < 100 && data[idx + 1] < 100 && data[idx + 2] < 100
        const nextIsDark = data[nextIdx] < 100 && data[nextIdx + 1] < 100 && data[nextIdx + 2] < 100

        if (isDark && nextIsDark) {
          horizontalLinePixels++
        }
      }
    }

    return horizontalLinePixels > width * 0.3 // At least 30% of width should be axis
  }

  private static detectVerticalAxis(data: Uint8ClampedArray, width: number, height: number): boolean {
    // Look for vertical lines in left 20% of image
    const endX = Math.floor(width * 0.2)
    let verticalLinePixels = 0

    for (let x = 0; x < endX; x++) {
      for (let y = 0; y < height - 1; y++) {
        const idx = (y * width + x) * 4
        const nextIdx = ((y + 1) * width + x) * 4

        const isDark = data[idx] < 100 && data[idx + 1] < 100 && data[idx + 2] < 100
        const nextIsDark = data[nextIdx] < 100 && data[nextIdx + 1] < 100 && data[nextIdx + 2] < 100

        if (isDark && nextIsDark) {
          verticalLinePixels++
        }
      }
    }

    return verticalLinePixels > height * 0.3
  }

  private static extractSpectralCurve(
    data: Uint8ClampedArray,
    width: number,
    height: number,
    metadata: any,
  ): Array<{ wavelength: number; absorbance: number }> {
    const spectralData: Array<{ wavelength: number; absorbance: number }> = []

    // Define the plot area (excluding axes)
    const plotStartX = Math.floor(width * 0.1)
    const plotEndX = Math.floor(width * 0.9)
    const plotStartY = Math.floor(height * 0.1)
    const plotEndY = Math.floor(height * 0.8)

    const [minWave, maxWave] = metadata.estimatedRange.wavelength
    const [minAbs, maxAbs] = metadata.estimatedRange.absorbance

    // Sample points across the width
    const samplePoints = 100
    const stepX = (plotEndX - plotStartX) / samplePoints

    for (let i = 0; i < samplePoints; i++) {
      const x = Math.floor(plotStartX + i * stepX)

      // Find the spectral curve by looking for the darkest/most colored pixel in this column
      let bestY = plotStartY
      let bestIntensity = 255

      for (let y = plotStartY; y < plotEndY; y++) {
        const idx = (y * width + x) * 4
        const intensity = (data[idx] + data[idx + 1] + data[idx + 2]) / 3

        // Look for darker pixels (spectral lines) or colored pixels
        if (intensity < bestIntensity) {
          bestIntensity = intensity
          bestY = y
        }
      }

      // Convert pixel coordinates to wavelength and absorbance
      const wavelength = minWave + ((x - plotStartX) / (plotEndX - plotStartX)) * (maxWave - minWave)
      const absorbance = maxAbs - ((bestY - plotStartY) / (plotEndY - plotStartY)) * (maxAbs - minAbs)

      spectralData.push({ wavelength, absorbance: Math.max(0, absorbance) })
    }

    return spectralData
  }

  private static findImagePeaks(spectralData: Array<{ wavelength: number; absorbance: number }>): number[] {
    const peaks: number[] = []
    const threshold = Math.max(...spectralData.map((d) => d.absorbance)) * 0.2

    for (let i = 1; i < spectralData.length - 1; i++) {
      const current = spectralData[i]
      const prev = spectralData[i - 1]
      const next = spectralData[i + 1]

      if (
        current.absorbance > prev.absorbance &&
        current.absorbance > next.absorbance &&
        current.absorbance > threshold
      ) {
        peaks.push(Math.round(current.wavelength))
      }
    }

    return peaks
  }

  private static calculateConfidence(
    spectralData: Array<{ wavelength: number; absorbance: number }>,
    metadata: any,
  ): number {
    let confidence = 0.5 // Base confidence

    // Increase confidence if axes detected
    if (metadata.hasWavelengthAxis) confidence += 0.2
    if (metadata.hasAbsorbanceAxis) confidence += 0.2

    // Increase confidence based on data quality
    const dataVariance = this.calculateVariance(spectralData.map((d) => d.absorbance))
    if (dataVariance > 0.01) confidence += 0.1 // Good signal variation

    return Math.min(1, confidence)
  }

  private static calculateVariance(values: number[]): number {
    const mean = values.reduce((a, b) => a + b, 0) / values.length
    const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length
    return variance
  }
}
