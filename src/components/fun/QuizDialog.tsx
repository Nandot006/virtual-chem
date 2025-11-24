"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface Quiz {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface QuizDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  quiz: Quiz;
  onClose: () => void;
}

export default function QuizDialog({ isOpen, onOpenChange, quiz, onClose }: QuizDialogProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!selectedAnswer) return;
    setSubmitted(true);
    if (selectedAnswer === quiz.correctAnswer) {
      toast({
        title: "Correct!",
        description: "Excellent! You know your chemistry.",
        variant: "default",
      });
    } else {
      toast({
        title: "Not Quite",
        description: `The correct answer was ${quiz.correctAnswer}.`,
        variant: "destructive",
      });
    }
    setTimeout(() => {
        onOpenChange(false);
        onClose();
        setSubmitted(false);
        setSelectedAnswer(null);
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Pop Quiz!</DialogTitle>
          <DialogDescription>
            That was a dangerous reaction! Let's see what you know about it.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="font-semibold mb-4">{quiz.question}</p>
          <RadioGroup onValueChange={setSelectedAnswer} value={selectedAnswer || ''} disabled={submitted}>
            {quiz.options.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={option} />
                <Label htmlFor={option} className={`flex-1 p-3 rounded-md transition-colors ${submitted && option === quiz.correctAnswer ? 'bg-green-500/20 border-green-500' : ''} ${submitted && selectedAnswer === option && option !== quiz.correctAnswer ? 'bg-red-500/20 border-red-500' : ''}`}>
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={!selectedAnswer || submitted}>
            Submit Answer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
