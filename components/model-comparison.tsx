"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trophy, Download, Eye } from "lucide-react"

interface Model {
  id: string
  name: string
  accuracy: number
  precision: number
  recall: number
  f1Score: number
  status: string
  trainedAt: string
}

interface ModelComparisonProps {
  models: Model[]
}

export function ModelComparison({ models }: ModelComparisonProps) {
  const sortedModels = [...models].sort((a, b) => b.accuracy - a.accuracy)
  const bestModel = sortedModels[0]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-600" />
            Model Performance Comparison
          </CardTitle>
          <CardDescription>Compare accuracy and performance metrics across trained models</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedModels.map((model, index) => (
              <div
                key={model.id}
                className={`p-4 rounded-lg border ${
                  index === 0 ? "border-yellow-200 bg-yellow-50" : "border-border bg-card"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {index === 0 && <Trophy className="h-5 w-5 text-yellow-600" />}
                    <div>
                      <div className="font-semibold flex items-center gap-2">
                        {model.name}
                        {index === 0 && (
                          <Badge variant="default" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                            Best Model
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Trained on {new Date(model.trainedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 mt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{(model.accuracy * 100).toFixed(1)}%</div>
                    <div className="text-xs text-muted-foreground">Accuracy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{(model.precision * 100).toFixed(1)}%</div>
                    <div className="text-xs text-muted-foreground">Precision</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{(model.recall * 100).toFixed(1)}%</div>
                    <div className="text-xs text-muted-foreground">Recall</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{(model.f1Score * 100).toFixed(1)}%</div>
                    <div className="text-xs text-muted-foreground">F1-Score</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Comparison Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics Visualization</CardTitle>
          <CardDescription>Visual comparison of model performance across key metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
            <svg width="100%" height="100%" viewBox="0 0 500 200" className="absolute inset-0">
              {/* Grid lines */}
              <g stroke="#e5e7eb" strokeWidth="0.5" opacity="0.5">
                {[0, 1, 2, 3, 4].map((i) => (
                  <line key={`h-${i}`} x1="0" y1={i * 50} x2="500" y2={i * 50} />
                ))}
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                  <line key={`v-${i}`} x1={i * 50} y1="0" x2={i * 50} y2="200" />
                ))}
              </g>

              {/* Model performance bars */}
              {sortedModels.map((model, index) => {
                const x = 50 + index * 100
                const metrics = [
                  { value: model.accuracy, color: "#3b82f6", label: "Accuracy" },
                  { value: model.precision, color: "#22c55e", label: "Precision" },
                  { value: model.recall, color: "#f59e0b", label: "Recall" },
                  { value: model.f1Score, color: "#8b5cf6", label: "F1-Score" },
                ]

                return (
                  <g key={model.id}>
                    {metrics.map((metric, metricIndex) => (
                      <rect
                        key={metricIndex}
                        x={x + metricIndex * 15}
                        y={200 - metric.value * 180}
                        width="12"
                        height={metric.value * 180}
                        fill={metric.color}
                        opacity="0.8"
                      />
                    ))}
                    <text x={x + 25} y={195} textAnchor="middle" fontSize="10" fill="#6b7280">
                      {model.name.split(" ")[0]}
                    </text>
                  </g>
                )
              })}

              {/* Legend */}
              <g transform="translate(350, 20)">
                {[
                  { color: "#3b82f6", label: "Accuracy" },
                  { color: "#22c55e", label: "Precision" },
                  { color: "#f59e0b", label: "Recall" },
                  { color: "#8b5cf6", label: "F1-Score" },
                ].map((item, index) => (
                  <g key={index} transform={`translate(0, ${index * 20})`}>
                    <rect x="0" y="0" width="12" height="12" fill={item.color} />
                    <text x="18" y="10" fontSize="10" fill="#374151">
                      {item.label}
                    </text>
                  </g>
                ))}
              </g>
            </svg>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
