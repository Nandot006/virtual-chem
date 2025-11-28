
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Upload, FlaskRound, AlertTriangle, Loader2, Trash2, X, Flame, Sparkles } from "lucide-react";
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { analyzeSyllabus, AnalyzeSyllabusOutput } from "@/ai/flows/analyze-syllabus-flow";
import BeakerIcon from "@/components/icons/BeakerIcon";
import FireBlast from "@/components/fun/FireBlast";
import QuizDialog from "@/components/fun/QuizDialog";
import { reactions, Reaction, Chemical, chemicals } from "@/lib/valence-data";
import { ScrollArea } from "@/components/ui/scroll-area";


interface StagedChemical {
  name: string;
  formula: string;
  quantity: number;
  // Find the full chemical data from the static list for state and color
  baseChemical: Chemical | undefined;
}


export default function InteractiveLabPage() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [stagedChemicals, setStagedChemicals] = useState<StagedChemical[]>([]);
  const [showExplosion, setShowExplosion] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const [labData, setLabData] = useState<AnalyzeSyllabusOutput>({ chemicals: [] });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentReaction, setCurrentReaction] = useState<Reaction | null>(null);
  const [productName, setProductName] = useState<string | null>(null);

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
      
      resetLab(false);
      setIsAnalyzing(true);
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
  
  const addChemicalToStage = (chemical: { name: string; formula: string; }) => {
    if (stagedChemicals.find((c) => c.name === chemical.name)) {
      toast({
        title: "Chemical already added",
        description: "You can adjust the quantity in the staging area.",
      });
      return;
    }
    // Find the full chemical data to get its state (solid/liquid) and color
    const baseChemical = chemicals.find(c => c.name === chemical.name || c.formula === chemical.formula);
    setStagedChemicals([...stagedChemicals, { ...chemical, quantity: 100, baseChemical }]);
  };

  const removeChemical = (name: string) => {
    setStagedChemicals(stagedChemicals.filter((c) => c.name !== name));
  };

  const updateQuantity = (name: string, quantity: number) => {
    setStagedChemicals(
      stagedChemicals.map((c) =>
        c.name === name ? { ...c, quantity: Math.max(10, quantity) } : c
      )
    );
  };

  const handleMix = () => {
    setProductName(null);

    // We need to find the ID of the staged chemicals to check against reactions data
    const stagedIds = stagedChemicals.map(sc => sc.baseChemical?.id).filter((id): id is string => !!id).sort();

    const reaction = reactions.find((r) => {
      const sortedReagents = [...r.reagents].sort();
      return JSON.stringify(sortedReagents) === JSON.stringify(stagedIds);
    });

    setCurrentReaction(reaction || null);

    if (reaction) {
      if (reaction.isDangerous) {
        setShowExplosion(true);
        setTimeout(() => {
          setShowExplosion(false);
          if (reaction.quiz) {
            setShowQuiz(true);
          }
        }, 2000);
      } else {
        setProductName(reaction.product.name);
        toast({
          title: "Reaction Successful!",
          description: `You've created ${reaction.product.name}.`,
          action: <Sparkles className="text-green-500" />,
        });
      }
    } else if (stagedChemicals.length > 0) {
      toast({
        variant: "destructive",
        title: "No Reaction",
        description: "These chemicals don't seem to react with each other.",
      });
    } else {
       toast({
        title: "Empty Beaker",
        description: "Add some chemicals to start an experiment.",
      });
    }
  };
  
  const resetLab = (showToast = true) => {
    setStagedChemicals([]);
    setCurrentReaction(null);
    setProductName(null);
    setShowQuiz(false);

    if(showToast) {
        // Only reset file input if starting completely over
        setUploadedFiles([]);
        setLabData({ chemicals: [] });
        setIsAnalyzing(false);
        if(fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        toast({ title: "Lab Reset", description: "Ready for a new experiment."});
    }
  }

  const getBeakerColor = () => {
    if (productName && currentReaction) {
      return currentReaction.product.color;
    }
    if (stagedChemicals.length === 0) {
      return 'hsla(210, 20%, 50%, 0.1)';
    }

    const liquidChemicals = stagedChemicals.filter(c => c.baseChemical?.state === 'liquid');
    if (liquidChemicals.length === 0) {
        return 'hsla(210, 20%, 50%, 0.1)';
    }

    const totalQuantity = liquidChemicals.reduce((acc, c) => acc + c.quantity, 0);
    if (totalQuantity === 0) {
        return 'hsla(210, 20%, 50%, 0.1)';
    }
    
    const avgColor = liquidChemicals.reduce((acc, c) => {
      if (!c.baseChemical) return acc;
      const [h, s, l] = c.baseChemical.color.match(/\d+(\.\d+)?/g)!.map(parseFloat);
      const weight = c.quantity / totalQuantity;
      acc.h += h * weight;
      acc.s += s * weight;
      acc.l += l * weight;
      return acc;
    }, { h: 0, s: 0, l: 0 });

    return `hsla(${avgColor.h}, ${avgColor.s}%, ${avgColor.l}%, 0.6)`;
  };

  const getSolidParticles = () => {
      if (productName) return [];
      const solids = stagedChemicals.filter(c => c.baseChemical?.state === 'solid');
      // Create more particles based on quantity
      return solids.flatMap(solid => Array.from({ length: Math.ceil(solid.quantity / 100) }, (_, i) => ({ id: `${solid.name}-${i}`, color: solid.baseChemical?.color || 'white' })));
  }

  return (
    <div className={`container mx-auto py-6 px-4 sm:px-6 lg:px-8 ${showExplosion ? 'animate-shake' : ''}`}>
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
                 <Button variant="outline" onClick={() => resetLab(true)}>Start Over</Button>
            )}
            <span className="text-sm text-muted-foreground">
              {uploadedFiles.length > 0 ? uploadedFiles[0].name : 'No file chosen'}
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 h-full flex flex-col">
          <CardHeader>
            <CardTitle>Available Chemicals</CardTitle>
            <CardDescription>Extracted from your document</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <ScrollArea className="h-full pr-4">
             {isAnalyzing && (
                <div className="flex items-center justify-center py-10">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
             )}
            {!isAnalyzing && labData.chemicals.length === 0 && (
                <p className="text-center text-muted-foreground py-10">Upload a document to begin.</p>
            )}
            {labData.chemicals.map((chemical) => (
              <div key={chemical.name} className="flex items-center justify-between p-3 border rounded-lg mb-3">
                <div>
                    <span className="font-medium">{chemical.name}</span>
                    <p className="text-sm text-muted-foreground">{chemical.formula}</p>
                </div>
                <Button 
                    size="sm"
                    onClick={() => addChemicalToStage(chemical)}
                  >
                    Add
                  </Button>
              </div>
            ))}
            </ScrollArea>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-1 h-full flex flex-col">
                <CardHeader>
                  <CardTitle>Staging Area</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <ScrollArea className="h-full pr-4">
                    <div className="space-y-4">
                      {stagedChemicals.length === 0 && (
                          <div className="text-center text-muted-foreground py-10">
                              <p>Add chemicals to the staging area.</p>
                          </div>
                      )}
                      {stagedChemicals.map((chem) => (
                        <div key={chem.name} className="p-3 rounded-md border bg-secondary flex flex-col gap-2">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold">{chem.name}</p>
                                    <p className="text-xs text-muted-foreground">{chem.formula}</p>
                                </div>
                                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => removeChemical(chem.name)}>
                                    <X className="h-4 w-4"/>
                                </Button>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs">Qty (ml):</span>
                                <input type="range" min="10" max="1000" step="10" value={chem.quantity} 
                                    onChange={(e) => updateQuantity(chem.name, parseInt(e.target.value))}
                                    className="w-full"
                                />
                                <span className="text-sm font-mono w-12 text-right">{chem.quantity}</span>
                            </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
              <Card className="md:col-span-2 h-full flex flex-col">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <FlaskRound className="h-5 w-5" />
                            Reaction Vessel
                        </div>
                        <Button variant="outline" size="sm" onClick={() => resetLab(false)}><Trash2 className="mr-2 h-4 w-4"/>Clear Beaker</Button>
                    </CardTitle>
                    {productName && <CardDescription className="text-primary pt-2">Product: {productName}</CardDescription>}
                </CardHeader>
                <CardContent className="flex-1 flex flex-col items-center justify-center gap-6">
                    <BeakerIcon 
                        className="w-48 h-48 transition-all duration-500"
                        liquidColor={getBeakerColor()}
                        liquidPercentage={stagedChemicals.length > 0 ? (productName ? 100 : Math.min(100, stagedChemicals.reduce((acc, c) => acc + c.quantity / 10, 0))) : 0}
                        solidParticles={getSolidParticles()}
                    />
                    <Button size="lg" className="w-64" onClick={handleMix}>
                        <Flame className="mr-2"/> Mix Chemicals!
                    </Button>
                </CardContent>
              </Card>
        </div>
      </div>

      {showExplosion && <FireBlast />}
      
      {currentReaction?.quiz && (
        <QuizDialog
          isOpen={showQuiz}
          onOpenChange={setShowQuiz}
          quiz={currentReaction.quiz}
          onClose={() => resetLab(false)}
        />
      )}
    </div>
  );
}

    