"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp, TrendingDown } from "lucide-react"

interface TrainingProgress {
  epoch: number
  totalEpochs: number
  accuracy: number
  loss: number
  valAccuracy: number
  valLoss: number
  isTraining: boolean
}

interface TrainingMetricsProps {
  trainingProgress: TrainingProgress
}

export function TrainingMetrics({ trainingProgress }: TrainingMetricsProps) {
  // Generate mock historical data for visualization
  const generateHistoricalData = () => {
    const data = []
    for (let i = 0; i <= trainingProgress.epoch; i++) {
      const progress = i / trainingProgress.totalEpochs
      data.push({
        epoch: i,
        accuracy: 0.6 + progress * 0.35 + Math.random() * 0.05,
        loss: 0.8 - progress * 0.75 + Math.random() * 0.1,
        valAccuracy: 0.55 + progress * 0.38 + Math.random() * 0.05,
        valLoss: 0.85 - progress * 0.78 + Math.random() * 0.1,
      })
    }
    return data
  }

  const historicalData = generateHistoricalData()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Accuracy Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Accuracy Over Time
          </CardTitle>
          <CardDescription>Training and validation accuracy progression</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
            {historicalData.length > 0 ? (
              <svg width="100%" height="100%" viewBox="0 0 400 200" className="absolute inset-0">
                <defs>
                  <linearGradient id="accuracyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity="0.1" />
                  </linearGradient>
                  <linearGradient id="valAccuracyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
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

                {/* Training accuracy line */}
                <path
                  d={`M ${historicalData
                    .map(
                      (point, i) =>
                        `${(i / Math.max(historicalData.length - 1, 1)) * 400},${200 - point.accuracy * 200}`,
                    )
                    .join(" L ")}`}
                  fill="url(#accuracyGradient)"
                  stroke="#22c55e"
                  strokeWidth="2"
                />

                {/* Validation accuracy line */}
                <path
                  d={`M ${historicalData
                    .map(
                      (point, i) =>
                        `${(i / Math.max(historicalData.length - 1, 1)) * 400},${200 - point.valAccuracy * 200}`,
                    )
                    .join(" L ")}`}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
              </svg>
            ) : (
              <div className="text-center text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No training data available</p>
              </div>
            )}
          </div>
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span className="text-sm">Training</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-blue-500 border-dashed rounded-full" />
              <span className="text-sm">Validation</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loss Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-red-600" />
            Loss Over Time
          </CardTitle>
          <CardDescription>Training and validation loss progression</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
            {historicalData.length > 0 ? (
              <svg width="100%" height="100%" viewBox="0 0 400 200" className="absolute inset-0">
                <defs>
                  <linearGradient id="lossGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3" />
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

                {/* Training loss line */}
                <path
                  d={`M ${historicalData
                    .map(
                      (point, i) =>
                        `${(i / Math.max(historicalData.length - 1, 1)) * 400},${200 - (1 - point.loss) * 200}`,
                    )
                    .join(" L ")}`}
                  fill="url(#lossGradient)"
                  stroke="#ef4444"
                  strokeWidth="2"
                />

                {/* Validation loss line */}
                <path
                  d={`M ${historicalData
                    .map(
                      (point, i) =>
                        `${(i / Math.max(historicalData.length - 1, 1)) * 400},${200 - (1 - point.valLoss) * 200}`,
                    )
                    .join(" L ")}`}
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
              </svg>
            ) : (
              <div className="text-center text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No training data available</p>
              </div>
            )}
          </div>
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <span className="text-sm">Training Loss</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-orange-500 border-dashed rounded-full" />
              <span className="text-sm">Validation Loss</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Training Statistics */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Training Statistics</CardTitle>
          <CardDescription>Detailed metrics and performance indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{(trainingProgress.accuracy * 100).toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">Current Training Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{(trainingProgress.valAccuracy * 100).toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">Current Validation Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{trainingProgress.loss.toFixed(3)}</div>
              <div className="text-sm text-muted-foreground">Current Training Loss</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{trainingProgress.valLoss.toFixed(3)}</div>
              <div className="text-sm text-muted-foreground">Current Validation Loss</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
