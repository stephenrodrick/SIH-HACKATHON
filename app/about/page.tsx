import { ArrowLeft, Microscope, Database, Zap, Shield, Users, Award } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-slate-200/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">MP</span>
              </div>
              <span className="text-xl font-bold text-slate-800">MicroPlastic Detector</span>
            </Link>
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Analyzer
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-6">About Our Technology</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Advanced spectral analysis for rapid microplastic identification using cutting-edge image processing and
            machine learning algorithms.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Microscope className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle>Spectral Analysis</CardTitle>
              <CardDescription>
                Advanced algorithms extract spectral signatures from spectrograph images
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Our system analyzes the unique spectral fingerprints of different microplastic types, enabling accurate
                identification from uploaded spectrograph images.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Database className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle>Reference Database</CardTitle>
              <CardDescription>Comprehensive CSV database matching for precise identification</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Upload your reference CSV files containing known microplastic spectral data for accurate comparison and
                identification of unknown samples.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle>Real-time Processing</CardTitle>
              <CardDescription>Instant analysis with confidence scoring and detailed results</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Get immediate results with confidence percentages, spectral similarity scores, and detailed analysis of
                peak matches and material properties.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Technology Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-slate-200/50 mb-16">
          <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">How It Works</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-semibold text-slate-800 mb-4">Image Processing</h3>
              <p className="text-slate-600 mb-6">
                Our advanced image processing algorithms analyze spectrograph images to extract spectral data points.
                The system identifies peaks, measures intensities, and creates a digital fingerprint of the sample.
              </p>
              <h3 className="text-2xl font-semibold text-slate-800 mb-4">Database Matching</h3>
              <p className="text-slate-600">
                The extracted spectral signature is compared against your uploaded CSV database using sophisticated
                matching algorithms that account for peak positions, intensities, and spectral patterns.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8">
              <h4 className="text-lg font-semibold text-slate-800 mb-4">Analysis Steps:</h4>
              <ol className="space-y-3 text-slate-600">
                <li className="flex items-start">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">
                    1
                  </span>
                  Upload spectrograph image and CSV database
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">
                    2
                  </span>
                  Extract spectral data from image
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">
                    3
                  </span>
                  Compare against reference database
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">
                    4
                  </span>
                  Generate confidence scores and results
                </li>
              </ol>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Accurate Results</h3>
            <p className="text-slate-600">
              High-precision identification with detailed confidence scoring and spectral analysis.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">User Friendly</h3>
            <p className="text-slate-600">
              Simple drag-and-drop interface designed for researchers and environmental scientists.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Research Grade</h3>
            <p className="text-slate-600">
              Professional-quality analysis suitable for academic research and environmental monitoring.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Analyze Your Samples?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Start identifying microplastics with our advanced spectral analysis system.
          </p>
          <Link href="/">
            <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
              Start Analysis
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
