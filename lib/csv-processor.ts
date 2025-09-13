export interface SpectralDataPoint {
  wavelength: number
  absorbance: number
}

export interface ProcessedSpectralData {
  data: SpectralDataPoint[]
  metadata: {
    type?: string
    polymer?: string
    color?: string
    source: string
    peakWavelengths: number[]
    totalPoints: number
    wavelengthRange: [number, number]
    maxAbsorbance: number
  }
}

export class CSVProcessor {
  static async processCSVFile(file: File): Promise<ProcessedSpectralData> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = (e) => {
        try {
          const text = e.target?.result as string
          const result = this.parseCSVContent(text, file.name)
          resolve(result)
        } catch (error) {
          reject(error)
        }
      }

      reader.onerror = () => reject(new Error("Failed to read file"))
      reader.readAsText(file)
    })
  }

  private static parseCSVContent(csvContent: string, filename: string): ProcessedSpectralData {
    const lines = csvContent.trim().split("\n")
    if (lines.length < 2) {
      throw new Error("CSV file must contain at least a header and one data row")
    }

    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase())
    const data: SpectralDataPoint[] = []

    // Find column indices
    const wavelengthIndex = this.findColumnIndex(headers, ["wavelength", "wave", "nm", "x"])
    const absorbanceIndex = this.findColumnIndex(headers, ["absorbance", "abs", "intensity", "y", "value"])

    if (wavelengthIndex === -1 || absorbanceIndex === -1) {
      throw new Error("CSV must contain wavelength and absorbance columns")
    }

    // Extract metadata columns
    const typeIndex = this.findColumnIndex(headers, ["type", "material", "sample"])
    const polymerIndex = this.findColumnIndex(headers, ["polymer", "plastic"])
    const colorIndex = this.findColumnIndex(headers, ["color", "colour"])

    const metadata = {
      type: undefined as string | undefined,
      polymer: undefined as string | undefined,
      color: undefined as string | undefined,
      source: filename,
      peakWavelengths: [] as number[],
      totalPoints: 0,
      wavelengthRange: [0, 0] as [number, number],
      maxAbsorbance: 0,
    }

    // Process data rows
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim())

      const wavelength = Number.parseFloat(values[wavelengthIndex])
      const absorbance = Number.parseFloat(values[absorbanceIndex])

      if (!isNaN(wavelength) && !isNaN(absorbance)) {
        data.push({ wavelength, absorbance })

        // Extract metadata from first row
        if (i === 1) {
          if (typeIndex !== -1) metadata.type = values[typeIndex]
          if (polymerIndex !== -1) metadata.polymer = values[polymerIndex]
          if (colorIndex !== -1) metadata.color = values[colorIndex]
        }
      }
    }

    if (data.length === 0) {
      throw new Error("No valid spectral data found in CSV")
    }

    // Calculate metadata
    metadata.totalPoints = data.length
    metadata.wavelengthRange = [Math.min(...data.map((d) => d.wavelength)), Math.max(...data.map((d) => d.wavelength))]
    metadata.maxAbsorbance = Math.max(...data.map((d) => d.absorbance))

    // Find peaks (local maxima)
    metadata.peakWavelengths = this.findPeaks(data)

    return { data, metadata }
  }

  private static findColumnIndex(headers: string[], possibleNames: string[]): number {
    for (const name of possibleNames) {
      const index = headers.findIndex((h) => h.includes(name))
      if (index !== -1) return index
    }
    return -1
  }

  private static findPeaks(data: SpectralDataPoint[]): number[] {
    const peaks: number[] = []
    const threshold = Math.max(...data.map((d) => d.absorbance)) * 0.1 // 10% of max

    for (let i = 1; i < data.length - 1; i++) {
      const current = data[i]
      const prev = data[i - 1]
      const next = data[i + 1]

      if (
        current.absorbance > prev.absorbance &&
        current.absorbance > next.absorbance &&
        current.absorbance > threshold
      ) {
        peaks.push(current.wavelength)
      }
    }

    return peaks.sort((a, b) => a - b)
  }

  static generateSampleCSV(): string {
    const header = "wavelength,absorbance,type,polymer,color"
    const sampleData = [
      "400,0.12,PET Fragment,Polyethylene Terephthalate,Clear",
      "450,0.15,PET Fragment,Polyethylene Terephthalate,Clear",
      "500,0.45,PET Fragment,Polyethylene Terephthalate,Clear",
      "550,0.32,PET Fragment,Polyethylene Terephthalate,Clear",
      "600,0.28,PET Fragment,Polyethylene Terephthalate,Clear",
      "650,0.18,PET Fragment,Polyethylene Terephthalate,Clear",
      "700,0.22,PET Fragment,Polyethylene Terephthalate,Clear",
      "750,0.35,PET Fragment,Polyethylene Terephthalate,Clear",
      "800,0.15,PET Fragment,Polyethylene Terephthalate,Clear",
    ]

    return [header, ...sampleData].join("\n")
  }
}
