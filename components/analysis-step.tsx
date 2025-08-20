// components/analysis-step.tsx

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { analyzeImage, AnalysisReport } from "@/lib/api";
import Image from "next/image";

export function AnalysisStep() {
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setReport(null); // Clear previous report on new file selection
    }
  };

  const handleAnalysis = async () => {
    if (!selectedFile) return;
    setIsAnalyzing(true);
    try {
      const analysisReport = await analyzeImage(selectedFile);
      setReport(analysisReport);
    } catch (error) {
      console.error("Analysis failed:", error);
      alert("There was an error analyzing the image. Please check the console for more details.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 py-4">
      <Card>
        <CardHeader>
          <CardTitle>Upload an Image for Analysis</CardTitle>
          <CardDescription>
            Receive a detailed analysis based on psychological principles and an AI-generated improved version.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input type="file" accept="image/jpeg, image/png" onChange={handleFileChange} disabled={isAnalyzing} />
          {previewUrl && (
            <div className="border rounded-md p-2">
              <p className="text-sm font-medium mb-2">Image Preview:</p>
              <Image src={previewUrl} alt="Preview" width={400} height={400} className="rounded-md mx-auto" />
            </div>
          )}
          <Button className="w-full" size="lg" onClick={handleAnalysis} disabled={!selectedFile || isAnalyzing}>
            {isAnalyzing ? "Analyzing..." : "Analyze Image"}
          </Button>
        </CardContent>
      </Card>

      {isAnalyzing && <p className="text-center animate-pulse">Analyzing image, this may take a moment...</p>}

      {report && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Report & Recommendation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {report.ab_simulation?.generated_improved_image_base64 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">AI-Generated Improvement</h3>
                <Image
                  src={`data:image/jpeg;base64,${report.ab_simulation.generated_improved_image_base64}`}
                  alt="Generated Improved Image"
                  width={600}
                  height={600}
                  className="rounded-md mx-auto border"
                />
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold mb-2">Detailed Report</h3>
              <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded-md font-sans text-sm">
                {report.initial_analysis_report}
              </pre>
            </div>
            {report.ab_simulation?.comparative_analysis && (
               <div>
                <h3 className="text-lg font-semibold mb-2">Comparative Analysis</h3>
                <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded-md font-sans text-sm">
                  {report.ab_simulation.comparative_analysis}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}