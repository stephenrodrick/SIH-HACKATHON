"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Target, TrendingUp, Zap, Info } from "lucide-react"

interface PeakAnalysisProps {
  features: any
  selectedPeak: any
}

export function PeakAnalysis({ features, selectedPeak }: PeakAnalysisProps) {
  if (!features || !features.peaks || features.peaks.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          <Target className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>No peaks detected</p>
          <p className="text-sm">Start streaming spectral data to analyze peaks</p>
        </CardContent>
      </Card>
    )
  }

  const classifyPeak = (wavelength: number, intensity: number) => {
    if (wavelength >= 400 && wavelength <= 500) {
      if (intensity > 0.6) return { type: "Strong Blue Absorption", color: "blue", confidence: 0.9 }
      return { type: "Weak Blue Absorption", color: "blue", confidence: 0.6 }
    } else if (wavelength >= 500 && wavelength <= 600) {
      if (intensity > 0.5) return { type: "Green Region Peak", color: "green", confidence: 0.8 }
      return { type: "Mid-Visible Peak", color: "green", confidence: 0.5 }
    } else if (wavelength >= 600 && wavelength <= 700) {
      if (intensity > 0.4) return { type: "Red Absorption", color: "red", confidence: 0.85 }
      return { type: "Weak Red Signal", color: "red", confidence: 0.4 }
    } else if (wavelength >= 700 && wavelength <= 800) {
      return { type: "Near-IR Peak", color: "purple", confidence: 0.7 }
    }
    return { type: "Unclassified Peak", color: "gray", confidence: 0.3 }
  }

  const getPeakSignificance = (peak: any) => {
    const maxIntensity = Math.max(...features.peaks.map((p: any) => p.intensity))
    const relativeIntensity = peak.intensity / maxIntensity

    if (relativeIntensity > 0.8) return "Primary"
    if (relativeIntensity > 0.5) return "Secondary"
    if (relativeIntensity > 0.3) return "Minor"
    return "Trace"
  }

  return (
    <div className="space-y-6">
      {/* Peak Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-primary">{features.peaks.length}</div>
            <div className="text-sm text-muted-foreground">Total Peaks</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-green-600">
              {features.peaks.filter((p: any) => getPeakSignificance(p) === "Primary").length}
            </div>
            <div className="text-sm text-muted-foreground">Primary Peaks</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">{features.dominantWavelength?.toFixed(0) || "0"}nm</div>
            <div className="text-sm text-muted-foreground">Dominant Wavelength</div>
          </CardContent>
        </Card>
      </div>

      {/* Selected Peak Details */}
      {selectedPeak && (
        <Card className="border-2 border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Selected Peak Analysis
            </CardTitle>
            <CardDescription>Detailed analysis of the selected spectral peak</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm font-medium">Wavelength</div>
                <div className="text-2xl font-bold text-primary">{selectedPeak.wavelength.toFixed(1)}nm</div>
              </div>
              <div>
                <div className="text-sm font-medium">Intensity</div>
                <div className="text-2xl font-bold text-green-600">{selectedPeak.intensity.toFixed(3)}</div>
              </div>
              <div>
                <div className="text-sm font-medium">Width (FWHM)</div>
                <div className="text-2xl font-bold text-blue-600">{selectedPeak.width.toFixed(1)}nm</div>
              </div>
              <div>
                <div className="text-sm font-medium">Significance</div>
                <Badge variant="default">{getPeakSignificance(selectedPeak)}</Badge>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Peak Classification</span>
                <span>{classifyPeak(selectedPeak.wavelength, selectedPeak.intensity).type}</span>
              </div>
              <Progress
                value={classifyPeak(selectedPeak.wavelength, selectedPeak.intensity).confidence * 100}
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Peak List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Peak Inventory
          </CardTitle>
          <CardDescription>Complete list of detected spectral peaks with classifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {features.peaks
              .sort((a: any, b: any) => b.intensity - a.intensity)
              .map((peak: any, index: number) => {
                const classification = classifyPeak(peak.wavelength, peak.intensity)
                const significance = getPeakSignificance(peak)

                return (
                  <div
                    key={index}
                    className={`p-4 border rounded-lg transition-all cursor-pointer hover:bg-muted/50 ${
                      selectedPeak?.wavelength === peak.wavelength ? "border-primary bg-primary/5" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-center">
                          <div className="text-lg font-bold">{peak.wavelength.toFixed(1)}</div>
                          <div className="text-xs text-muted-foreground">nm</div>
                        </div>
                        <div>
                          <div className="font-medium">{classification.type}</div>
                          <div className="text-sm text-muted-foreground">
                            Intensity: {peak.intensity.toFixed(3)} • Width: {peak.width.toFixed(1)}nm
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={significance === "Primary" ? "default" : "secondary"}
                          className={
                            significance === "Primary"
                              ? "bg-green-100 text-green-800 border-green-300"
                              : significance === "Secondary"
                                ? "bg-blue-100 text-blue-800 border-blue-300"
                                : significance === "Minor"
                                  ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                                  : "bg-gray-100 text-gray-800 border-gray-300"
                          }
                        >
                          {significance}
                        </Badge>
                        <div className="text-sm text-muted-foreground">
                          {(classification.confidence * 100).toFixed(0)}%
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
        </CardContent>
      </Card>

      {/* Peak Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Statistical Analysis
          </CardTitle>
          <CardDescription>Peak distribution and statistical metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {(features.peaks.reduce((sum: number, p: any) => sum + p.intensity, 0) / features.peaks.length).toFixed(
                  3,
                )}
              </div>
              <div className="text-sm text-muted-foreground">Average Intensity</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {Math.max(...features.peaks.map((p: any) => p.intensity)).toFixed(3)}
              </div>
              <div className="text-sm text-muted-foreground">Max Intensity</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {(features.peaks.reduce((sum: number, p: any) => sum + p.width, 0) / features.peaks.length).toFixed(1)}
                nm
              </div>
              <div className="text-sm text-muted-foreground">Average Width</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {(
                  Math.max(...features.peaks.map((p: any) => p.wavelength)) -
                  Math.min(...features.peaks.map((p: any) => p.wavelength))
                ).toFixed(0)}
                nm
              </div>
              <div className="text-sm text-muted-foreground">Spectral Span</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
