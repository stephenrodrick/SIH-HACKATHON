// ML prediction utilities for microplastic classification

interface PredictionResult {
  type: string
  color: string
  confidence: number
  polymer: string
  colorant: string
  spectralMatch: number
}

interface SpectralDataPoint {
  wavelength: number
  absorbance: number
}

// Mock microplastic database for reference
const microplasticDatabase = [
  {
    type: "PET Bottle Fragment",
    color: "Clear Blue",
    polymer: "Polyethylene Terephthalate",
    colorant: "Cobalt Blue",
    peakWavelengths: [500, 740],
    characteristics: ["high_crystallinity", "bottle_origin"],
  },
  {
    type: "PE Film Fragment",
    color: "Translucent White",
    polymer: "Polyethylene",
    colorant: "Titanium Dioxide",
    peakWavelengths: [460, 680],
    characteristics: ["flexible", "film_origin"],
  },
  {
    type: "PP Container Piece",
    color: "Red",
    polymer: "Polypropylene",
    colorant: "Iron Oxide Red",
    peakWavelengths: [650, 720],
    characteristics: ["rigid", "container_origin"],
  },
  {
    type: "PS Foam Fragment",
    color: "White",
    polymer: "Polystyrene",
    colorant: "Titanium Dioxide",
    peakWavelengths: [480, 760],
    characteristics: ["foam_structure", "lightweight"],
  },
  {
    type: "PVC Pipe Fragment",
    color: "Gray",
    polymer: "Polyvinyl Chloride",
    colorant: "Carbon Black",
    peakWavelengths: [520, 780],
    characteristics: ["rigid", "pipe_origin"],
  },
  {
    type: "Nylon Fiber",
    color: "Blue",
    polymer: "Polyamide",
    colorant: "Methylene Blue",
    peakWavelengths: [495, 660],
    characteristics: ["fiber_structure", "textile_origin"],
  },
]

// Simulate ML model prediction
export async function predictMicroplastic(
  featureVector: number[],
  spectralData: SpectralDataPoint[],
): Promise<PredictionResult> {
  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 100))

  // Extract dominant peaks from spectral data
  const peaks = findDominantPeaks(spectralData)

  // Find best matching microplastic type based on spectral features
  let bestMatch = microplasticDatabase[0]
  let bestScore = 0

  for (const candidate of microplasticDatabase) {
    const score = calculateSpectralMatch(peaks, candidate.peakWavelengths)
    if (score > bestScore) {
      bestScore = score
      bestMatch = candidate
    }
  }

  // Add some randomness to simulate real ML uncertainty
  const confidence = Math.min(0.98, bestScore + Math.random() * 0.1)
  const spectralMatch = Math.min(0.95, bestScore + Math.random() * 0.05)

  return {
    type: bestMatch.type,
    color: bestMatch.color,
    confidence,
    polymer: bestMatch.polymer,
    colorant: bestMatch.colorant,
    spectralMatch,
  }
}

// Find dominant peaks in spectral data
function findDominantPeaks(spectralData: SpectralDataPoint[]): number[] {
  const peaks: number[] = []
  const minPeakHeight = 0.3
  const minPeakDistance = 20 // nm

  for (let i = 1; i < spectralData.length - 1; i++) {
    const current = spectralData[i]
    const prev = spectralData[i - 1]
    const next = spectralData[i + 1]

    if (
      current.absorbance > prev.absorbance &&
      current.absorbance > next.absorbance &&
      current.absorbance > minPeakHeight
    ) {
      // Check minimum distance from existing peaks
      const tooClose = peaks.some((peak) => Math.abs(peak - current.wavelength) < minPeakDistance)
      if (!tooClose) {
        peaks.push(current.wavelength)
      }
    }
  }

  return peaks.sort((a, b) => b - a) // Sort by wavelength descending
}

// Calculate spectral match score between observed and reference peaks
function calculateSpectralMatch(observedPeaks: number[], referencePeaks: number[]): number {
  if (observedPeaks.length === 0 || referencePeaks.length === 0) {
    return 0
  }

  let totalScore = 0
  let matchCount = 0

  for (const refPeak of referencePeaks) {
    let bestMatch = 0
    for (const obsPeak of observedPeaks) {
      const distance = Math.abs(refPeak - obsPeak)
      const score = Math.max(0, 1 - distance / 50) // 50nm tolerance
      bestMatch = Math.max(bestMatch, score)
    }
    totalScore += bestMatch
    matchCount++
  }

  return matchCount > 0 ? totalScore / matchCount : 0
}

// Simulate confidence calibration based on feature quality
export function calibrateConfidence(rawConfidence: number, featureQuality: number): number {
  // Adjust confidence based on spectral data quality
  const qualityFactor = Math.min(1, featureQuality)
  const calibratedConfidence = rawConfidence * qualityFactor

  // Apply uncertainty bounds
  return Math.max(0.1, Math.min(0.99, calibratedConfidence))
}

// Get prediction explanation
export function explainPrediction(prediction: PredictionResult): string[] {
  const explanations: string[] = []

  if (prediction.confidence > 0.9) {
    explanations.push("High confidence prediction based on strong spectral match")
  } else if (prediction.confidence > 0.7) {
    explanations.push("Moderate confidence - spectral features align well with reference")
  } else {
    explanations.push("Low confidence - spectral match is uncertain")
  }

  if (prediction.spectralMatch > 0.8) {
    explanations.push("Excellent spectral correlation with reference database")
  } else if (prediction.spectralMatch > 0.6) {
    explanations.push("Good spectral correlation with some minor variations")
  } else {
    explanations.push("Spectral correlation shows significant differences from reference")
  }

  explanations.push(`Identified as ${prediction.polymer} with ${prediction.colorant} colorant`)

  return explanations
}
