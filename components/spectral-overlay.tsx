"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { generateMockSpectralData } from "@/lib/spectral-processing"
import { BarChart3 } from "lucide-react"

interface Prediction {
  id: string
  timestamp: Date
  microplasticType: string
  color: string
  confidence: number
  polymer: string
  colorant: string
  spectralMatch: number
  features: any
}

interface SpectralOverlayProps {
  currentPrediction: Prediction | null
}

export function SpectralOverlay({ currentPrediction }: SpectralOverlayProps) {
  const [currentSpectrum, setCurrentSpectrum] = useState<any[]>([])
  const [referenceSpectrum, setReferenceSpectrum] = useState<any[]>([])

  useEffect(() => {
    // Generate current spectrum data
    const current = generateMockSpectralData()
    setCurrentSpectrum(current)

    // Generate reference spectrum based on prediction
    if (currentPrediction) {
      const reference = generateReferenceSpectrum(currentPrediction.microplasticType, currentPrediction.color)
      setReferenceSpectrum(reference)
    }
  }, [currentPrediction])

  const generateReferenceSpectrum = (type: string, color: string) => {
    // Generate reference spectrum based on microplastic type and color
    const data = []
    for (let wl = 400; wl <= 800; wl += 2) {
      let absorbance = 0.05 + Math.random() * 0.02

      // Add characteristic peaks based on type and color
      if (color.toLowerCase().includes("blue") && wl >= 480 && wl <= 520) {
        absorbance += 0.7 * Math.exp(-Math.pow((wl - 500) / 15, 2))
      }
      if (color.toLowerCase().includes("red") && wl >= 630 && wl <= 670) {
        absorbance += 0.6 * Math.exp(-Math.pow((wl - 650) / 12, 2))
      }
      if (type.toLowerCase().includes("pet") && wl >= 720 && wl <= 760) {
        absorbance += 0.4 * Math.exp(-Math.pow((wl - 740) / 10, 2))
      }

      data.push({ wavelength: wl, absorbance: Math.max(0, absorbance) })
    }
    return data
  }

  return (
    <div className="space-y-4">
      {currentPrediction && (
        <div className="flex items-center gap-2">
          <Badge variant="outline">Live Spectrum</Badge>
          <Badge variant="secondary">Reference: {currentPrediction.microplasticType}</Badge>
        </div>
      )}

      <div className="h-64 bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
        {currentSpectrum.length > 0 ? (
          <svg width="100%" height="100%" viewBox="0 0 400 200" className="absolute inset-0">
            <defs>
              <linearGradient id="currentGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
              </linearGradient>
              <linearGradient id="referenceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0.1" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            <g stroke="#e5e7eb" strokeWidth="0.5" opacity="0.5">
              {[0, 1, 2, 3, 4].map((i) => (
                <line key={`h-${i}`} x1="0" y1={i * 50} x2="400" y2={i * 50} />
              ))}
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <line key={`v-${i}`} x1={i * 50} y1="0" x2={i * 50} y2="200" />
              ))}
            </g>

            {/* Current spectrum */}
            <path
              d={`M ${currentSpectrum
                .map((point, i) => `${(i / currentSpectrum.length) * 400},${200 - point.absorbance * 150}`)
                .join(" L ")}`}
              fill="url(#currentGradient)"
              stroke="#3b82f6"
              strokeWidth="2"
            />

            {/* Reference spectrum overlay */}
            {referenceSpectrum.length > 0 && currentPrediction && (
              <path
                d={`M ${referenceSpectrum
                  .map((point, i) => `${(i / referenceSpectrum.length) * 400},${200 - point.absorbance * 150}`)
                  .join(" L ")}`}
                fill="url(#referenceGradient)"
                stroke="#ef4444"
                strokeWidth="2"
                strokeDasharray="5,5"
                opacity="0.8"
              />
            )}

            {/* Wavelength labels */}
            <g fontSize="10" fill="#6b7280">
              <text x="50" y="195" textAnchor="middle">
                450nm
              </text>
              <text x="150" y="195" textAnchor="middle">
                550nm
              </text>
              <text x="250" y="195" textAnchor="middle">
                650nm
              </text>
              <text x="350" y="195" textAnchor="middle">
                750nm
              </text>
            </g>

            {/* Y-axis labels */}
            <g fontSize="10" fill="#6b7280">
              <text x="10" y="190" textAnchor="start">
                0.0
              </text>
              <text x="10" y="150" textAnchor="start">
                0.3
              </text>
              <text x="10" y="100" textAnchor="start">
                0.7
              </text>
              <text x="10" y="50" textAnchor="start">
                1.0
              </text>
            </g>
          </svg>
        ) : (
          <div className="text-center text-muted-foreground">
            <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No spectral data available</p>
          </div>
        )}
      </div>

      {currentPrediction && (
        <div className="flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full" />
            <span>Live Spectrum</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 border-2 border-red-500 border-dashed rounded-full" />
            <span>Reference ({currentPrediction.microplasticType})</span>
          </div>
          <div className="text-muted-foreground">Match: {(currentPrediction.spectralMatch * 100).toFixed(1)}%</div>
        </div>
      )}
    </div>
  )
}
