"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, Pause, Upload, Download, RotateCcw } from "lucide-react"
import { processSpectralData, generateMockSpectralData } from "@/lib/spectral-processing"
import { SpectralControls } from "./spectral-controls"
import { PeakAnalysis } from "./peak-analysis"
import { BarChart3 } from "lucide-react"

interface SpectralDataPoint {
  wavelength: number
  absorbance: number
}

interface ViewSettings {
  wavelengthRange: [number, number]
  absorbanceRange: [number, number]
  showGrid: boolean
  showPeaks: boolean
  showBaseline: boolean
  colorScheme: string
}

export function SpectralChart() {
  const [spectralData, setSpectralData] = useState<SpectralDataPoint[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [processedFeatures, setProcessedFeatures] = useState<any>(null)
  const [viewSettings, setViewSettings] = useState<ViewSettings>({
    wavelengthRange: [400, 800],
    absorbanceRange: [0, 1],
    showGrid: true,
    showPeaks: true,
    showBaseline: false,
    colorScheme: "default",
  })
  const [selectedPeak, setSelectedPeak] = useState<any>(null)

  // Generate mock real-time data
  const generateRealTimeData = useCallback(() => {
    const newData = generateMockSpectralData()
    setSpectralData(newData)

    // Process the data for features
    const features = processSpectralData(newData)
    setProcessedFeatures(features)
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isStreaming) {
      interval = setInterval(generateRealTimeData, 2000)
    }
    return () => clearInterval(interval)
  }, [isStreaming, generateRealTimeData])

  const toggleStreaming = () => {
    setIsStreaming(!isStreaming)
    if (!isStreaming) {
      generateRealTimeData()
    }
  }

  const resetView = () => {
    setViewSettings({
      wavelengthRange: [400, 800],
      absorbanceRange: [0, 1],
      showGrid: true,
      showPeaks: true,
      showBaseline: false,
      colorScheme: "default",
    })
  }

  const exportData = () => {
    if (spectralData.length === 0) return

    const csvContent = [
      "Wavelength (nm),Absorbance",
      ...spectralData.map((point) => `${point.wavelength},${point.absorbance.toFixed(6)}`),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `spectral_data_${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getColorScheme = () => {
    const schemes = {
      default: { line: "#3b82f6", fill: "url(#spectralGradient)" },
      scientific: { line: "#059669", fill: "url(#scientificGradient)" },
      thermal: { line: "#dc2626", fill: "url(#thermalGradient)" },
      monochrome: { line: "#374151", fill: "url(#monochromeGradient)" },
    }
    return schemes[viewSettings.colorScheme as keyof typeof schemes] || schemes.default
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="spectrum" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="spectrum">Spectrum View</TabsTrigger>
          <TabsTrigger value="peaks">Peak Analysis</TabsTrigger>
          <TabsTrigger value="controls">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="spectrum" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button onClick={toggleStreaming} variant={isStreaming ? "destructive" : "default"} size="sm">
                {isStreaming ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                {isStreaming ? "Stop Stream" : "Start Stream"}
              </Button>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Upload Data
              </Button>
              <Button onClick={exportData} variant="outline" size="sm" disabled={spectralData.length === 0}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={resetView} variant="outline" size="sm">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset View
              </Button>
              <Select
                value={viewSettings.colorScheme}
                onValueChange={(value) => setViewSettings((prev) => ({ ...prev, colorScheme: value }))}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="scientific">Scientific</SelectItem>
                  <SelectItem value="thermal">Thermal</SelectItem>
                  <SelectItem value="monochrome">Monochrome</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Card>
            <CardContent className="p-4">
              <div className="h-80 bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
                {spectralData.length > 0 ? (
                  <svg width="100%" height="100%" viewBox="0 0 500 300" className="absolute inset-0">
                    <defs>
                      <linearGradient id="spectralGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
                      </linearGradient>
                      <linearGradient id="scientificGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#059669" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#059669" stopOpacity="0.1" />
                      </linearGradient>
                      <linearGradient id="thermalGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#dc2626" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#dc2626" stopOpacity="0.1" />
                      </linearGradient>
                      <linearGradient id="monochromeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#374151" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#374151" stopOpacity="0.1" />
                      </linearGradient>
                    </defs>

                    {/* Grid lines */}
                    {viewSettings.showGrid && (
                      <g stroke="#e5e7eb" strokeWidth="0.5" opacity="0.5">
                        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                          <line key={`h-${i}`} x1="50" y1={50 + i * 40} x2="450" y2={50 + i * 40} />
                        ))}
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                          <line key={`v-${i}`} x1={50 + i * 50} y1="50" x2={50 + i * 50} y2="290" />
                        ))}
                      </g>
                    )}

                    {/* Axes */}
                    <g stroke="#374151" strokeWidth="2">
                      <line x1="50" y1="290" x2="450" y2="290" />
                      <line x1="50" y1="50" x2="50" y2="290" />
                    </g>

                    {/* Wavelength labels */}
                    <g fontSize="12" fill="#6b7280" textAnchor="middle">
                      {[400, 500, 600, 700, 800].map((wl, i) => (
                        <text key={wl} x={50 + i * 100} y="310">
                          {wl}nm
                        </text>
                      ))}
                      <text x="250" y="330" fontSize="14" fontWeight="bold">
                        Wavelength (nm)
                      </text>
                    </g>

                    {/* Absorbance labels */}
                    <g fontSize="12" fill="#6b7280" textAnchor="end">
                      {[0, 0.2, 0.4, 0.6, 0.8, 1.0].map((abs, i) => (
                        <text key={abs} x="45" y={290 - i * 40}>
                          {abs.toFixed(1)}
                        </text>
                      ))}
                      <text x="25" y="170" fontSize="14" fontWeight="bold" transform="rotate(-90, 25, 170)">
                        Absorbance
                      </text>
                    </g>

                    {/* Baseline */}
                    {viewSettings.showBaseline && (
                      <line x1="50" y1="290" x2="450" y2="290" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2,2" />
                    )}

                    {/* Spectral curve */}
                    <path
                      d={`M ${spectralData
                        .map((point, i) => {
                          const x = 50 + ((point.wavelength - 400) / 400) * 400
                          const y = 290 - point.absorbance * 240
                          return `${x},${y}`
                        })
                        .join(" L ")}`}
                      fill={getColorScheme().fill}
                      stroke={getColorScheme().line}
                      strokeWidth="2"
                    />

                    {/* Peak markers */}
                    {viewSettings.showPeaks &&
                      processedFeatures?.peaks?.map((peak: any, i: number) => (
                        <g key={i}>
                          <circle
                            cx={50 + ((peak.wavelength - 400) / 400) * 400}
                            cy={290 - peak.intensity * 240}
                            r="6"
                            fill="#ef4444"
                            stroke="#fff"
                            strokeWidth="2"
                            className="cursor-pointer hover:r-8 transition-all"
                            onClick={() => setSelectedPeak(peak)}
                          />
                          <text
                            x={50 + ((peak.wavelength - 400) / 400) * 400}
                            y={290 - peak.intensity * 240 - 15}
                            fontSize="10"
                            fill="#ef4444"
                            textAnchor="middle"
                            fontWeight="bold"
                          >
                            {peak.wavelength.toFixed(0)}
                          </text>
                        </g>
                      ))}

                    {/* Selected peak info */}
                    {selectedPeak && (
                      <g>
                        <rect
                          x={50 + ((selectedPeak.wavelength - 400) / 400) * 400 + 10}
                          y={290 - selectedPeak.intensity * 240 - 40}
                          width="120"
                          height="35"
                          fill="rgba(0,0,0,0.8)"
                          rx="4"
                        />
                        <text
                          x={50 + ((selectedPeak.wavelength - 400) / 400) * 400 + 15}
                          y={290 - selectedPeak.intensity * 240 - 25}
                          fontSize="10"
                          fill="white"
                        >
                          λ: {selectedPeak.wavelength.toFixed(1)}nm
                        </text>
                        <text
                          x={50 + ((selectedPeak.wavelength - 400) / 400) * 400 + 15}
                          y={290 - selectedPeak.intensity * 240 - 12}
                          fontSize="10"
                          fill="white"
                        >
                          I: {selectedPeak.intensity.toFixed(3)}
                        </text>
                      </g>
                    )}
                  </svg>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No spectral data available</p>
                    <p className="text-sm">Start streaming or upload data to begin</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Enhanced metrics display */}
          {processedFeatures && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{processedFeatures.peaks?.length || 0}</div>
                  <div className="text-sm text-muted-foreground">Peaks Detected</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {processedFeatures.meanAbsorbance?.toFixed(3) || "0.000"}
                  </div>
                  <div className="text-sm text-muted-foreground">Mean Absorbance</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {processedFeatures.variance?.toFixed(4) || "0.0000"}
                  </div>
                  <div className="text-sm text-muted-foreground">Variance</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {processedFeatures.dominantWavelength?.toFixed(0) || "0"}nm
                  </div>
                  <div className="text-sm text-muted-foreground">Dominant Peak</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {(
                      (processedFeatures.spectralRange?.[1] || 0) - (processedFeatures.spectralRange?.[0] || 0)
                    ).toFixed(0)}
                    nm
                  </div>
                  <div className="text-sm text-muted-foreground">Spectral Range</div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="peaks">
          <PeakAnalysis features={processedFeatures} selectedPeak={selectedPeak} />
        </TabsContent>

        <TabsContent value="controls">
          <SpectralControls viewSettings={viewSettings} onSettingsChange={setViewSettings} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
