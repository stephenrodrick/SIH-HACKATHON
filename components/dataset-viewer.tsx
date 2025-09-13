"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Download, Edit, CheckCircle, AlertTriangle } from "lucide-react"

interface MicroplasticSample {
  id: string
  type: string
  color: string
  polymer: string
  colorant: string
  peakWavelengths: number[]
  spectralData: number[]
  source: string
  dateAdded: string
  verified: boolean
  confidence: number
}

interface DatasetViewerProps {
  selectedSample: MicroplasticSample | null
}

export function DatasetViewer({ selectedSample }: DatasetViewerProps) {
  if (!selectedSample) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          <Eye className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>No sample selected</p>
          <p className="text-sm">Select a sample from the browse tab to view detailed information</p>
        </CardContent>
      </Card>
    )
  }

  const exportSample = () => {
    const data = {
      ...selectedSample,
      spectralData: selectedSample.spectralData.slice(0, 10), // Truncate for demo
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${selectedSample.id}_data.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Sample Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {selectedSample.verified ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                )}
                {selectedSample.type}
              </CardTitle>
              <CardDescription>Sample ID: {selectedSample.id}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant={selectedSample.confidence > 0.8 ? "default" : "secondary"}
                className={
                  selectedSample.confidence > 0.8
                    ? "bg-green-100 text-green-800 border-green-300"
                    : selectedSample.confidence > 0.6
                      ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                      : "bg-red-100 text-red-800 border-red-300"
                }
              >
                {(selectedSample.confidence * 100).toFixed(1)}% Confidence
              </Badge>
              <Button onClick={exportSample} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Core sample identification and classification</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Type</div>
                <div className="text-lg font-semibold">{selectedSample.type}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Color</div>
                <div className="text-lg font-semibold">{selectedSample.color}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Polymer</div>
                <div className="text-lg font-semibold">{selectedSample.polymer}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Colorant</div>
                <div className="text-lg font-semibold">{selectedSample.colorant}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Metadata */}
        <Card>
          <CardHeader>
            <CardTitle>Metadata</CardTitle>
            <CardDescription>Sample source and quality information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Source</div>
                <div className="text-lg font-semibold">{selectedSample.source}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Date Added</div>
                <div className="text-lg font-semibold">{selectedSample.dateAdded}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Verification Status</div>
                <div className="flex items-center gap-2">
                  {selectedSample.verified ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-green-600 font-semibold">Verified</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <span className="text-yellow-600 font-semibold">Pending</span>
                    </>
                  )}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Confidence Score</div>
                <div className="text-lg font-semibold">{(selectedSample.confidence * 100).toFixed(1)}%</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Spectral Information */}
        <Card>
          <CardHeader>
            <CardTitle>Spectral Characteristics</CardTitle>
            <CardDescription>Peak wavelengths and spectral features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-2">Peak Wavelengths</div>
              <div className="flex flex-wrap gap-2">
                {selectedSample.peakWavelengths.map((wavelength, index) => (
                  <Badge key={index} variant="outline">
                    {wavelength}nm
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-2">Spectral Data Points</div>
              <div className="text-lg font-semibold">{selectedSample.spectralData.length} data points</div>
            </div>
          </CardContent>
        </Card>

        {/* Spectral Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Spectral Preview</CardTitle>
            <CardDescription>Visual representation of the spectral signature</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
              <svg width="100%" height="100%" viewBox="0 0 300 150" className="absolute inset-0">
                <defs>
                  <linearGradient id="sampleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
                  </linearGradient>
                </defs>

                {/* Grid */}
                <g stroke="#e5e7eb" strokeWidth="0.5" opacity="0.5">
                  {[0, 1, 2, 3].map((i) => (
                    <line key={`h-${i}`} x1="30" y1={30 + i * 30} x2="270" y2={30 + i * 30} />
                  ))}
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <line key={`v-${i}`} x1={30 + i * 30} y1="30" x2={30 + i * 30} y2="120" />
                  ))}
                </g>

                {/* Sample spectral curve */}
                <path
                  d={`M ${selectedSample.spectralData
                    .slice(0, 50) // Show first 50 points
                    .map((value, i) => `${30 + (i / 49) * 240},${120 - value * 80}`)
                    .join(" L ")}`}
                  fill="url(#sampleGradient)"
                  stroke="#3b82f6"
                  strokeWidth="2"
                />

                {/* Peak markers */}
                {selectedSample.peakWavelengths.map((wavelength, i) => (
                  <circle
                    key={i}
                    cx={30 + ((wavelength - 400) / 400) * 240}
                    cy={40 + i * 10}
                    r="3"
                    fill="#ef4444"
                    stroke="#fff"
                    strokeWidth="1"
                  />
                ))}
              </svg>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
