
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Upload, Beaker, FlaskRound, TestTube, AlertTriangle, Loader2 } from "lucide-react";
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { analyzeSyllabus, AnalyzeSyllabusOutput } from "@/ai/flows/analyze-syllabus-flow";

export default function InteractiveLabPage() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [beakerContent, setBeakerContent] = useState<{element: string; amount: number}[]>([]);
  const [testTubes, setTestTubes] = useState<{id: number; content: string}[]>([]);
  const [showExplosion, setShowExplosion] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const [labData, setLabData] = useState<AnalyzeSyllabusOutput>({ chemicals: [] });
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const testTubeSlots = Array.from({ length: 6 }, (_, i) => i + 1);

  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setUploadedFiles([file]);
      
      setIsAnalyzing(true);
      setLabData({ chemicals: [] });
      toast({
        title: "Analyzing Document...",
        description: "The AI is extracting chemicals from your syllabus. This may take a moment.",
      });

      try {
        const fileDataUri = await toBase64(file);
        const result = await analyzeSyllabus({ fileDataUri });
        setLabData(result);
        toast({
          title: "Analysis Complete!",
          description: `Found ${result.chemicals.length} chemicals to work with.`,
        });
      } catch (error) {
        console.error("Analysis failed:", error);
        toast({
          variant: "destructive",
          title: "Analysis Failed",
          description: "Could not process the uploaded document. Please try a different file.",
        });
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  const addElementToBeaker = (element: string) => {
    // For simplicity, using a default amount.
    // The input for amount is removed to simplify the UI.
    const amount = 50;
    const newContent = [...beakerContent, { element, amount }];
    setBeakerContent(newContent);
    
    if (checkForDangerousReaction(newContent)) {
      setShowExplosion(true);
      setTimeout(() => {
        setShowExplosion(false);
        setShowQuiz(true)
      }, 1500);
    }
  };

  const checkForDangerousReaction = (contents: {element: string; amount: number}[]) => {
    // This is a mock check. In a real scenario, this would be driven by the AI analysis.
    const hasAcid = contents.some(item => item.element.toLowerCase().includes('acid'));
    const hasBase = contents.some(item => item.element.toLowerCase().includes('hydroxide'));
    return hasAcid && hasBase;
  };

  const transferToTestTube = (tubeId: number) => {
    if (beakerContent.length > 0) {
      const content = beakerContent.map(item => `${item.element}`).join(' + ');
      setTestTubes(prev => [...prev.filter(t => t.id !== tubeId), { id: tubeId, content }]);
      setBeakerContent([]);
    }
  };
  
  const resetLab = () => {
    setBeakerContent([]);
    setTestTubes([]);
    setUploadedFiles([]);
    setLabData({ chemicals: [] });
    setIsAnalyzing(false);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
    toast({ title: "Lab Reset", description: "Ready for a new experiment."});
  }

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Syllabus or Lab Notes
          </CardTitle>
          <CardDescription>
            Upload a PDF, JPG, or PNG of your lab materials. The AI will automatically set up your workspace.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-center">
            <Input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isAnalyzing}
            />
            <Button onClick={() => fileInputRef.current?.click()} disabled={isAnalyzing}>
              {isAnalyzing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</> : 'Choose File'}
            </Button>
            {uploadedFiles.length > 0 && !isAnalyzing && (
                 <Button variant="outline" onClick={resetLab}>Start Over</Button>
            )}
            <span className="text-sm text-muted-foreground">
              {uploadedFiles.length > 0 ? uploadedFiles[0].name : 'No file chosen'}
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Available Chemicals</CardTitle>
            <CardDescription>Extracted from your document</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
             {isAnalyzing && (
                <div className="flex items-center justify-center py-10">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
             )}
            {!isAnalyzing && labData.chemicals.length === 0 && (
                <p className="text-center text-muted-foreground py-10">Upload a document to begin.</p>
            )}
            {labData.chemicals.map((chemical) => (
              <div key={chemical.name} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                    <span className="font-medium">{chemical.name}</span>
                    <p className="text-sm text-muted-foreground">{chemical.formula}</p>
                </div>
                <Button 
                    size="sm"
                    onClick={() => addElementToBeaker(chemical.name)}
                  >
                    Add
                  </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FlaskRound className="h-5 w-5" />
              Laboratory Workspace
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Beaker className="h-8 w-8 text-primary" />
                <h3 className="text-lg font-semibold">Beaker</h3>
              </div>
              <div className="border-2 border-dashed rounded-lg p-4 min-h-[100px] bg-secondary/30">
                {beakerContent.length === 0 ? (
                  <p className="text-muted-foreground text-center">Empty - Add chemicals to start a reaction</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {beakerContent.map((item, index) => (
                      <span key={index} className="bg-primary/20 text-primary-foreground px-3 py-1 rounded-full text-sm">
                        {item.element}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <TestTube className="h-6 w-6 text-accent" />
                <h3 className="text-lg font-semibold">Test Tubes</h3>
              </div>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                {testTubeSlots.map((tubeId) => {
                  const tube = testTubes.find(t => t.id === tubeId);
                  return (
                    <div key={tubeId} className="text-center">
                      <div className="border-2 border-dashed rounded-lg p-3 h-24 bg-secondary/30 flex items-center justify-center">
                        {tube ? (
                          <span className="text-xs font-medium">{tube.content}</span>
                        ) : (
                          <span className="text-muted-foreground text-sm">Empty</span>
                        )}
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2 w-full"
                        onClick={() => transferToTestTube(tubeId)}
                        disabled={beakerContent.length === 0}
                      >
                        Transfer
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {showExplosion && (
        <div className="fixed inset-0 bg-red-600/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-white text-center animate-pulse">
            <AlertTriangle className="h-24 w-24 mx-auto mb-4" />
            <h2 className="text-4xl font-bold mb-2">DANGEROUS REACTION!</h2>
          </div>
        </div>
      )}

      {showQuiz && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <Card className="max-w-md w-full mx-4">
            <CardHeader>
              <CardTitle>Safety Quiz</CardTitle>
              <CardDescription>
                Why might mixing an acid and a base be dangerous?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" onClick={() => { setShowQuiz(false); resetLab(); }}>
                It can be an exothermic reaction, releasing heat.
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => { setShowQuiz(false); resetLab(); }}>
                It changes the color.
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => { setShowQuiz(false); resetLab(); }}>
                It has a strong smell.
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
