"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { History, Download, Eye } from "lucide-react"

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

interface PredictionResultsProps {
  predictions: Prediction[]
}

export function PredictionResults({ predictions }: PredictionResultsProps) {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return "text-green-600 bg-green-50 border-green-200"
    if (confidence >= 0.7) return "text-blue-600 bg-blue-50 border-blue-200"
    if (confidence >= 0.5) return "text-yellow-600 bg-yellow-50 border-yellow-200"
    return "text-red-600 bg-red-50 border-red-200"
  }

  const exportResults = () => {
    const csvContent = [
      "Timestamp,Type,Color,Confidence,Polymer,Colorant,Spectral Match",
      ...predictions.map((p) =>
        [
          p.timestamp.toISOString(),
          p.microplasticType,
          p.color,
          p.confidence.toFixed(3),
          p.polymer,
          p.colorant,
          p.spectralMatch.toFixed(3),
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `microplastic_predictions_${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Prediction History
            </CardTitle>
            <CardDescription>Recent microplastic detection results and analysis</CardDescription>
          </div>
          <Button onClick={exportResults} variant="outline" size="sm" disabled={predictions.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {predictions.length > 0 ? (
          <ScrollArea className="h-96">
            <div className="space-y-3">
              {predictions.map((prediction) => (
                <div key={prediction.id} className="p-4 border rounded-lg bg-card">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="font-semibold">{prediction.microplasticType}</div>
                        <div className="text-sm text-muted-foreground">
                          {prediction.color} • {prediction.polymer}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getConfidenceColor(prediction.confidence)}>
                        {(prediction.confidence * 100).toFixed(1)}%
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="font-medium">Confidence</div>
                      <div className="text-muted-foreground">{(prediction.confidence * 100).toFixed(1)}%</div>
                    </div>
                    <div>
                      <div className="font-medium">Spectral Match</div>
                      <div className="text-muted-foreground">{(prediction.spectralMatch * 100).toFixed(1)}%</div>
                    </div>
                    <div>
                      <div className="font-medium">Detected</div>
                      <div className="text-muted-foreground">{prediction.timestamp.toLocaleTimeString()}</div>
                    </div>
                  </div>

                  {prediction.colorant && (
                    <div className="mt-2 text-xs text-muted-foreground">Colorant: {prediction.colorant}</div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            <History className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No prediction history available</p>
            <p className="text-sm">Start the detection engine to see results here</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
