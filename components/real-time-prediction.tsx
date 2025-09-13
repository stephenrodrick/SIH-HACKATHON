"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Play, Pause, Zap, AlertTriangle, CheckCircle, Camera } from "lucide-react"
import { PredictionResults } from "./prediction-results"
import { SpectralOverlay } from "./spectral-overlay"
import { processSpectralData, generateMockSpectralData, extractFeatureVector } from "@/lib/spectral-processing"
import { predictMicroplastic } from "@/lib/ml-prediction"

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

export function RealTimePrediction() {
  const [isRunning, setIsRunning] = useState(false)
  const [currentPrediction, setCurrentPrediction] = useState<Prediction | null>(null)
  const [predictionHistory, setPredictionHistory] = useState<Prediction[]>([])
  const [processingTime, setProcessingTime] = useState(0)
  const [systemStatus, setSystemStatus] = useState<"ready" | "processing" | "error">("ready")
  const [streamingRate, setStreamingRate] = useState(3000) // milliseconds
  const [totalPredictions, setTotalPredictions] = useState(0)
  const [accuracyRate, setAccuracyRate] = useState(0.85)

  const runPrediction = useCallback(async () => {
    if (!isRunning) return

    const startTime = Date.now()
    setSystemStatus("processing")

    try {
      console.log("[v0] Running real-time prediction...")

      const spectralData = generateMockSpectralData()

      const features = processSpectralData(spectralData)
      const featureVector = extractFeatureVector(features)

      const prediction = await predictMicroplastic(featureVector, spectralData)

      const newPrediction: Prediction = {
        id: `pred_${Date.now()}`,
        timestamp: new Date(),
        microplasticType: prediction.type,
        color: prediction.color,
        confidence: prediction.confidence,
        polymer: prediction.polymer,
        colorant: prediction.colorant,
        spectralMatch: prediction.spectralMatch,
        features: features,
      }

      console.log("[v0] Prediction complete:", newPrediction.microplasticType, "Confidence:", newPrediction.confidence)

      setCurrentPrediction(newPrediction)
      setPredictionHistory((prev) => [newPrediction, ...prev.slice(0, 19)]) // Keep last 20
      setTotalPredictions((prev) => prev + 1)
      setProcessingTime(Date.now() - startTime)
      setSystemStatus("ready")

      setAccuracyRate((prev) => prev * 0.9 + newPrediction.confidence * 0.1)
    } catch (error) {
      console.error("[v0] Prediction error:", error)
      setSystemStatus("error")
    }
  }, [isRunning])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning) {
      console.log("[v0] Starting real-time prediction with rate:", streamingRate, "ms")
      interval = setInterval(runPrediction, streamingRate)
      runPrediction() // Run immediately
    }
    return () => {
      if (interval) {
        console.log("[v0] Stopping real-time prediction")
        clearInterval(interval)
      }
    }
  }, [isRunning, runPrediction, streamingRate])

  const togglePrediction = () => {
    console.log("[v0] Toggling prediction:", !isRunning)
    setIsRunning(!isRunning)
    if (!isRunning) {
      setSystemStatus("ready")
    }
  }

  const adjustStreamingRate = (rate: number) => {
    setStreamingRate(rate)
    console.log("[v0] Streaming rate adjusted to:", rate, "ms")
  }

  const getStatusColor = () => {
    switch (systemStatus) {
      case "ready":
        return "text-green-600"
      case "processing":
        return "text-blue-600"
      case "error":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getStatusIcon = () => {
    switch (systemStatus) {
      case "ready":
        return <CheckCircle className="h-4 w-4" />
      case "processing":
        return <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full" />
      case "error":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Zap className="h-5 w-5" />
            Real-Time Prediction Engine
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Live microplastic detection and classification from spectral data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Button onClick={togglePrediction} variant={isRunning ? "destructive" : "default"}>
                {isRunning ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                {isRunning ? "Stop Detection" : "Start Detection"}
              </Button>
              <div className={`flex items-center gap-2 ${getStatusColor()}`}>
                {getStatusIcon()}
                <span className="text-sm font-medium">
                  {systemStatus === "ready" && "System Ready"}
                  {systemStatus === "processing" && "Processing..."}
                  {systemStatus === "error" && "Error Detected"}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-sm text-muted-foreground">
              <div>Rate:</div>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant={streamingRate === 1000 ? "default" : "outline"}
                  onClick={() => adjustStreamingRate(1000)}
                  className="text-xs px-2 py-1"
                >
                  1s
                </Button>
                <Button
                  size="sm"
                  variant={streamingRate === 3000 ? "default" : "outline"}
                  onClick={() => adjustStreamingRate(3000)}
                  className="text-xs px-2 py-1"
                >
                  3s
                </Button>
                <Button
                  size="sm"
                  variant={streamingRate === 5000 ? "default" : "outline"}
                  onClick={() => adjustStreamingRate(5000)}
                  className="text-xs px-2 py-1"
                >
                  5s
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{totalPredictions}</div>
              <div className="text-xs text-muted-foreground">Total Predictions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{processingTime}ms</div>
              <div className="text-xs text-muted-foreground">Processing Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{(accuracyRate * 100).toFixed(1)}%</div>
              <div className="text-xs text-muted-foreground">Accuracy Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{predictionHistory.length}</div>
              <div className="text-xs text-muted-foreground">History Count</div>
            </div>
          </div>

          {systemStatus === "error" && (
            <Alert className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Prediction engine encountered an error. Check system configuration and try again.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Camera className="h-5 w-5" />
              Current Detection
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Latest microplastic identification results
            </CardDescription>
          </CardHeader>
          <CardContent>
            {currentPrediction ? (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-primary">
                      {currentPrediction.microplasticType}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {currentPrediction.color} • {currentPrediction.polymer}
                    </div>
                  </div>
                  <Badge
                    variant={currentPrediction.confidence > 0.8 ? "default" : "secondary"}
                    className="text-base sm:text-lg px-3 py-1 self-start sm:self-center"
                  >
                    {(currentPrediction.confidence * 100).toFixed(1)}%
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Confidence Level</span>
                      <span>{(currentPrediction.confidence * 100).toFixed(1)}%</span>
                    </div>
                    <Progress value={currentPrediction.confidence * 100} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Spectral Match</span>
                      <span>{(currentPrediction.spectralMatch * 100).toFixed(1)}%</span>
                    </div>
                    <Progress value={currentPrediction.spectralMatch * 100} className="h-2" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <div className="text-sm font-medium">Polymer Type</div>
                    <div className="text-sm text-muted-foreground">{currentPrediction.polymer}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Colorant</div>
                    <div className="text-sm text-muted-foreground">{currentPrediction.colorant}</div>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground">
                  Detected at {currentPrediction.timestamp.toLocaleTimeString()}
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <Camera className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No detection results yet</p>
                <p className="text-sm">Start the detection engine to begin analysis</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Spectral Analysis</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Live spectral data with reference overlay
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SpectralOverlay currentPrediction={currentPrediction} />
          </CardContent>
        </Card>
      </div>

      <PredictionResults predictions={predictionHistory} />
    </div>
  )
}
