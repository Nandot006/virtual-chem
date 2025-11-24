"use client";

import { useState } from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import BeakerIcon from "@/components/icons/BeakerIcon";
import { Chemical, chemicals, reactions, Reaction } from "@/lib/valence-data";
import { Atom, FlaskConical, Flame, Plus, Sparkles, Trash2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Blast from "./Blast";
import QuizDialog from "./QuizDialog";

interface StagedChemical extends Chemical {
  quantity: number;
}

export default function ExperimentWorkspace() {
  const [stagedChemicals, setStagedChemicals] = useState<StagedChemical[]>([]);
  const [isExploded, setIsExploded] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentReaction, setCurrentReaction] = useState<Reaction | null>(null);
  const [productName, setProductName] = useState<string | null>(null);
  const { toast } = useToast();

  const addChemical = (chemical: Chemical) => {
    if (stagedChemicals.find((c) => c.id === chemical.id)) {
      toast({
        title: "Chemical already added",
        description: "You can adjust the quantity in the staging area.",
      });
      return;
    }
    setStagedChemicals([...stagedChemicals, { ...chemical, quantity: 100 }]);
  };

  const removeChemical = (id: string) => {
    setStagedChemicals(stagedChemicals.filter((c) => c.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    setStagedChemicals(
      stagedChemicals.map((c) =>
        c.id === id ? { ...c, quantity: Math.max(10, quantity) } : c
      )
    );
  };

  const handleMix = () => {
    setProductName(null);
    const stagedIds = stagedChemicals.map((c) => c.id).sort();
    const reaction = reactions.find((r) => {
      const sortedReagents = [...r.reagents].sort();
      return JSON.stringify(sortedReagents) === JSON.stringify(stagedIds);
    });

    setCurrentReaction(reaction || null);

    if (reaction) {
      if (reaction.isDangerous) {
        setIsExploded(true);
        setTimeout(() => {
          setIsExploded(false);
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

  const resetWorkspace = () => {
    setStagedChemicals([]);
    setCurrentReaction(null);
    setProductName(null);
    setShowQuiz(false);
    toast({
        title: "Workspace Cleared",
        description: "The lab bench has been reset.",
    });
  };

  const getBeakerColor = () => {
    if (productName && currentReaction) {
      return currentReaction.product.color;
    }
    if (stagedChemicals.length === 0) {
      return 'hsla(210, 20%, 50%, 0.1)';
    }

    const liquidChemicals = stagedChemicals.filter(c => c.state === 'liquid');
    if (liquidChemicals.length === 0) {
        return 'hsla(210, 20%, 50%, 0.1)'; // Default color if no liquids
    }

    const totalQuantity = liquidChemicals.reduce((acc, c) => acc + c.quantity, 0);
    if (totalQuantity === 0) {
        return 'hsla(210, 20%, 50%, 0.1)';
    }
    
    const avgColor = liquidChemicals.reduce((acc, c) => {
      const [h, s, l, a] = c.color.match(/\d+(\.\d+)?/g)!.map(parseFloat);
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
      const solids = stagedChemicals.filter(c => c.state === 'solid');
      // Create more particles based on quantity
      return solids.flatMap(solid => Array.from({ length: Math.ceil(solid.quantity / 100) }, (_, i) => ({ id: `${solid.id}-${i}`, color: solid.color })));
  }

  return (
    <SidebarProvider>
      <div className={`relative ${isExploded ? 'animate-shake' : ''}`}>
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2">
              <FlaskConical />
              <h2 className="font-semibold text-lg">Chemicals</h2>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <ScrollArea className="h-full">
              <SidebarMenu>
                {chemicals.map((chem) => (
                  <SidebarMenuItem key={chem.id}>
                    <Card className="w-full bg-secondary/50">
                      <CardContent className="p-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold">{chem.name}</p>
                            <p className="text-xs text-muted-foreground">{chem.formula}</p>
                          </div>
                          <Button size="sm" onClick={() => addChemical(chem)}>
                            <Plus className="mr-2 h-4 w-4" /> Add
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </ScrollArea>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <div className="p-4 md:p-8 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div className="flex gap-2 items-center">
                    <SidebarTrigger className="md:hidden" />
                    <h1 className="text-2xl md:text-3xl font-bold">Experiment Lab</h1>
                </div>
              <Button variant="destructive" onClick={resetWorkspace}><Trash2 className="mr-2"/> Clear All</Button>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 flex-1">
              <Card className="md:col-span-1 h-full flex flex-col">
                <CardHeader>
                  <CardTitle>Staging Area</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <ScrollArea className="h-[calc(100%-2rem)]">
                    <div className="space-y-4">
                      {stagedChemicals.length === 0 && (
                          <div className="text-center text-muted-foreground py-10">
                              <p>Select chemicals from the left panel to begin.</p>
                          </div>
                      )}
                      {stagedChemicals.map((chem) => (
                        <div key={chem.id} className="p-3 rounded-md border bg-secondary flex flex-col gap-2">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold">{chem.name}</p>
                                    <p className="text-xs text-muted-foreground">{chem.formula}</p>
                                </div>
                                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => removeChemical(chem.id)}>
                                    <X className="h-4 w-4"/>
                                </Button>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs">Qty (ml):</span>
                                <input type="range" min="10" max="1000" step="10" value={chem.quantity} 
                                    onChange={(e) => updateQuantity(chem.id, parseInt(e.target.value))}
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

              <div className="md:col-span-2 h-full flex flex-col items-center justify-center gap-6 p-4 rounded-lg bg-secondary/30 border-dashed border-2">
                <div className="text-center">
                  <h3 className="text-2xl font-semibold">Reaction Vessel</h3>
                  {productName && <p className="text-lg text-primary">Product: {productName}</p>}
                </div>
                <BeakerIcon 
                    className="w-48 h-48 transition-all duration-500"
                    liquidColor={getBeakerColor()}
                    liquidPercentage={stagedChemicals.length > 0 ? (productName ? 100 : Math.min(100, stagedChemicals.reduce((acc, c) => acc + c.quantity / 10, 0))) : 0}
                    solidParticles={getSolidParticles()}
                />
                <Button size="lg" className="w-64" onClick={handleMix}>
                    <Flame className="mr-2"/> Mix Chemicals!
                </Button>
              </div>
            </div>
          </div>
        </SidebarInset>
      </div>
      {isExploded && <Blast />}
      {currentReaction?.quiz && (
        <QuizDialog
          isOpen={showQuiz}
          onOpenChange={setShowQuiz}
          quiz={currentReaction.quiz}
          onClose={resetWorkspace}
        />
      )}
    </SidebarProvider>
  );
}
