// Spectral data processing utilities for microplastic detection

export interface SpectralDataPoint {
  wavelength: number
  absorbance: number
}

export interface SpectralFeatures {
  peaks: Array<{
    wavelength: number
    intensity: number
    width: number
  }>
  meanAbsorbance: number
  variance: number
  dominantWavelength: number
  spectralRange: [number, number]
  peakCount: number
}

// Generate mock spectral data for demonstration
export function generateMockSpectralData(): SpectralDataPoint[] {
  const data: SpectralDataPoint[] = []
  const wavelengthRange = [400, 800] // nm
  const resolution = 2 // nm per point

  for (let wl = wavelengthRange[0]; wl <= wavelengthRange[1]; wl += resolution) {
    // Simulate realistic spectral absorption with multiple peaks
    let absorbance = 0.1 + Math.random() * 0.05 // baseline noise

    // Add characteristic peaks for different microplastic types
    // Peak 1: Around 500nm (common for blue plastics)
    if (wl >= 480 && wl <= 520) {
      absorbance += 0.6 * Math.exp(-Math.pow((wl - 500) / 15, 2))
    }

    // Peak 2: Around 650nm (red colorants)
    if (wl >= 630 && wl <= 670) {
      absorbance += 0.4 * Math.exp(-Math.pow((wl - 650) / 12, 2))
    }

    // Peak 3: Around 750nm (polymer backbone)
    if (wl >= 730 && wl <= 770) {
      absorbance += 0.3 * Math.exp(-Math.pow((wl - 750) / 10, 2))
    }

    data.push({ wavelength: wl, absorbance: Math.max(0, absorbance) })
  }

  return applySavitzkyGolayFilter(data)
}

// Apply Savitzky-Golay smoothing filter
export function applySavitzkyGolayFilter(data: SpectralDataPoint[]): SpectralDataPoint[] {
  const windowSize = 5
  const halfWindow = Math.floor(windowSize / 2)

  return data.map((point, i) => {
    if (i < halfWindow || i >= data.length - halfWindow) {
      return point // Keep edge points unchanged
    }

    let sum = 0
    for (let j = -halfWindow; j <= halfWindow; j++) {
      sum += data[i + j].absorbance
    }

    return {
      wavelength: point.wavelength,
      absorbance: sum / windowSize,
    }
  })
}

// Extract spectral features for ML input
export function processSpectralData(data: SpectralDataPoint[]): SpectralFeatures {
  const peaks = findPeaks(data)
  const absorbances = data.map((d) => d.absorbance)
  const meanAbsorbance = absorbances.reduce((a, b) => a + b, 0) / absorbances.length
  const variance = absorbances.reduce((sum, val) => sum + Math.pow(val - meanAbsorbance, 2), 0) / absorbances.length

  const dominantPeak = peaks.reduce(
    (max, peak) => (peak.intensity > max.intensity ? peak : max),
    peaks[0] || { wavelength: 0, intensity: 0, width: 0 },
  )

  return {
    peaks,
    meanAbsorbance,
    variance,
    dominantWavelength: dominantPeak.wavelength,
    spectralRange: [data[0].wavelength, data[data.length - 1].wavelength],
    peakCount: peaks.length,
  }
}

// Find peaks in spectral data
function findPeaks(data: SpectralDataPoint[]): Array<{ wavelength: number; intensity: number; width: number }> {
  const peaks: Array<{ wavelength: number; intensity: number; width: number }> = []
  const minPeakHeight = 0.2 // Minimum peak height threshold
  const minPeakDistance = 10 // Minimum distance between peaks (in data points)

  for (let i = 1; i < data.length - 1; i++) {
    const current = data[i]
    const prev = data[i - 1]
    const next = data[i + 1]

    // Check if current point is a local maximum
    if (
      current.absorbance > prev.absorbance &&
      current.absorbance > next.absorbance &&
      current.absorbance > minPeakHeight
    ) {
      // Check minimum distance from previous peaks
      const tooClose = peaks.some((peak) => Math.abs(peak.wavelength - current.wavelength) < minPeakDistance * 2)

      if (!tooClose) {
        // Calculate peak width at half maximum
        const halfMax = current.absorbance / 2
        let leftWidth = 0,
          rightWidth = 0

        // Find left half-width
        for (let j = i - 1; j >= 0; j--) {
          if (data[j].absorbance <= halfMax) {
            leftWidth = current.wavelength - data[j].wavelength
            break
          }
        }

        // Find right half-width
        for (let j = i + 1; j < data.length; j++) {
          if (data[j].absorbance <= halfMax) {
            rightWidth = data[j].wavelength - current.wavelength
            break
          }
        }

        peaks.push({
          wavelength: current.wavelength,
          intensity: current.absorbance,
          width: leftWidth + rightWidth,
        })
      }
    }
  }

  return peaks.sort((a, b) => b.intensity - a.intensity) // Sort by intensity descending
}

// Convert spectral features to ML feature vector
export function extractFeatureVector(features: SpectralFeatures): number[] {
  const vector: number[] = []

  // Basic statistical features
  vector.push(features.meanAbsorbance)
  vector.push(features.variance)
  vector.push(features.peakCount)
  vector.push(features.dominantWavelength)

  // Peak-based features (pad/truncate to fixed size)
  const maxPeaks = 5
  for (let i = 0; i < maxPeaks; i++) {
    if (i < features.peaks.length) {
      vector.push(features.peaks[i].wavelength)
      vector.push(features.peaks[i].intensity)
      vector.push(features.peaks[i].width)
    } else {
      vector.push(0, 0, 0) // Padding for missing peaks
    }
  }

  // Spectral range features
  vector.push(features.spectralRange[1] - features.spectralRange[0])

  return vector
}
