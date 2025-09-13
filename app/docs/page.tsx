import { ArrowLeft, FileText, Upload, Search, BarChart3, AlertCircle, CheckCircle, Info } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

export default function DocsPage() {
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
          <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-6">Documentation</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Complete guide to using the MicroPlastic Detector for accurate spectral analysis and microplastic
            identification.
          </p>
        </div>

        {/* Quick Start Guide */}
        <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 mb-12">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
              Quick Start Guide
            </CardTitle>
            <CardDescription>Get started with microplastic analysis in 4 simple steps</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">1</span>
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">Upload CSV Database</h3>
                <p className="text-sm text-slate-600">Upload your reference microplastic database in CSV format</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">2</span>
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">Upload Spectrograph</h3>
                <p className="text-sm text-slate-600">Upload the spectrograph image of your sample</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">3</span>
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">Analyze Sample</h3>
                <p className="text-sm text-slate-600">Click analyze to process and compare spectral data</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">4</span>
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">View Results</h3>
                <p className="text-sm text-slate-600">Review identification results and confidence scores</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* File Format Requirements */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 text-blue-600 mr-2" />
                CSV Database Format
              </CardTitle>
              <CardDescription>Required format for microplastic reference database</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  CSV file must contain columns for material name, wavelength, and absorbance values
                </AlertDescription>
              </Alert>
              <div className="bg-slate-50 rounded-lg p-4 font-mono text-sm">
                <div className="text-slate-600 mb-2">Example CSV structure:</div>
                <div className="space-y-1">
                  <div>Material,Wavelength,Absorbance</div>
                  <div>Polyethylene,1000,0.45</div>
                  <div>Polystyrene,1050,0.62</div>
                  <div>PVC,1100,0.38</div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <Badge variant="outline">Required Columns</Badge>
                <ul className="text-sm text-slate-600 space-y-1 ml-4">
                  <li>• Material: Name of microplastic type</li>
                  <li>• Wavelength: Spectral wavelength (cm⁻¹)</li>
                  <li>• Absorbance: Absorption intensity</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="w-5 h-5 text-green-600 mr-2" />
                Image Requirements
              </CardTitle>
              <CardDescription>Spectrograph image specifications</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Images should be clear spectrographs with visible spectral lines and peaks
                </AlertDescription>
              </Alert>
              <div className="space-y-4">
                <div>
                  <Badge variant="outline" className="mb-2">
                    Supported Formats
                  </Badge>
                  <ul className="text-sm text-slate-600 space-y-1 ml-4">
                    <li>• JPEG (.jpg, .jpeg)</li>
                    <li>• PNG (.png)</li>
                    <li>• WebP (.webp)</li>
                  </ul>
                </div>
                <div>
                  <Badge variant="outline" className="mb-2">
                    Image Quality
                  </Badge>
                  <ul className="text-sm text-slate-600 space-y-1 ml-4">
                    <li>• High resolution (min 800x600)</li>
                    <li>• Clear spectral peaks</li>
                    <li>• Good contrast</li>
                    <li>• Minimal noise</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analysis Process */}
        <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 mb-12">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Search className="w-6 h-6 text-purple-600 mr-3" />
              Analysis Process
            </CardTitle>
            <CardDescription>How the system processes and analyzes your data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-2">Image Processing</h3>
                  <p className="text-slate-600 mb-2">
                    The system analyzes the uploaded spectrograph image using advanced computer vision algorithms:
                  </p>
                  <ul className="text-sm text-slate-600 space-y-1 ml-4">
                    <li>• Converts image to grayscale for analysis</li>
                    <li>• Detects spectral lines and peaks</li>
                    <li>• Extracts wavelength and intensity data</li>
                    <li>• Applies noise reduction filters</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-2">Database Comparison</h3>
                  <p className="text-slate-600 mb-2">
                    Extracted spectral data is compared against the uploaded CSV database:
                  </p>
                  <ul className="text-sm text-slate-600 space-y-1 ml-4">
                    <li>• Peak matching algorithms</li>
                    <li>• Spectral similarity calculations</li>
                    <li>• Statistical correlation analysis</li>
                    <li>• Confidence score generation</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-2">Results Generation</h3>
                  <p className="text-slate-600 mb-2">The system provides comprehensive analysis results:</p>
                  <ul className="text-sm text-slate-600 space-y-1 ml-4">
                    <li>• Best match identification</li>
                    <li>• Confidence percentage</li>
                    <li>• Spectral similarity score</li>
                    <li>• Peak analysis details</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Understanding Results */}
        <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 mb-12">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <BarChart3 className="w-6 h-6 text-orange-600 mr-3" />
              Understanding Results
            </CardTitle>
            <CardDescription>How to interpret the analysis results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-slate-800 mb-4">Confidence Score</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span className="text-sm">
                      <strong>90-100%:</strong> Excellent match
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">
                      <strong>70-89%:</strong> Good match
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm">
                      <strong>50-69%:</strong> Moderate match
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <span className="text-sm">
                      <strong>Below 50%:</strong> Poor match
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-4">Spectral Similarity</h3>
                <p className="text-slate-600 text-sm mb-3">
                  Measures how closely the sample spectrum matches the reference spectrum:
                </p>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• Peak position alignment</li>
                  <li>• Intensity correlation</li>
                  <li>• Overall spectral shape</li>
                  <li>• Characteristic absorption bands</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Troubleshooting */}
        <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 mb-12">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
              Troubleshooting
            </CardTitle>
            <CardDescription>Common issues and solutions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">Low Confidence Scores</h3>
                <ul className="text-sm text-slate-600 space-y-1 ml-4">
                  <li>• Ensure spectrograph image is high quality and clear</li>
                  <li>• Check that CSV database contains relevant reference materials</li>
                  <li>• Verify spectral range matches between sample and database</li>
                  <li>• Consider image preprocessing to enhance contrast</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">Upload Errors</h3>
                <ul className="text-sm text-slate-600 space-y-1 ml-4">
                  <li>• Check file format (CSV for database, JPG/PNG for images)</li>
                  <li>• Ensure file size is under 10MB</li>
                  <li>• Verify CSV has required columns (Material, Wavelength, Absorbance)</li>
                  <li>• Try refreshing the page and uploading again</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">No Results Found</h3>
                <ul className="text-sm text-slate-600 space-y-1 ml-4">
                  <li>• Check that both files are uploaded successfully</li>
                  <li>• Ensure spectrograph contains visible spectral features</li>
                  <li>• Verify database contains appropriate reference materials</li>
                  <li>• Try with a different spectrograph image</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Analyzing?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Use our comprehensive documentation to get the most accurate results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
                Start Analysis
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
