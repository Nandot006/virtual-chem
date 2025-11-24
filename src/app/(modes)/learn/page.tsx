import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BookCopy, FlaskConical, PencilRuler } from "lucide-react";

export default function LearningModePage() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
        <Card className="max-w-2xl w-full shadow-2xl shadow-primary/10">
          <CardHeader>
            <CardTitle className="text-4xl font-bold">Learning Mode is Coming Soon!</CardTitle>
            <CardDescription className="text-lg text-muted-foreground mt-2">
              Get ready for a structured way to master chemistry.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-left space-y-6 my-8">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <BookCopy className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Syllabus Integration</h4>
                  <p className="text-muted-foreground text-sm">Upload your course syllabus to get personalized lessons and experiments.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <FlaskConical className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Guided Experiments</h4>
                  <p className="text-muted-foreground text-sm">Follow step-by-step instructions for key chemical reactions.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <PencilRuler className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Exam Simulation</h4>
                  <p className="text-muted-foreground text-sm">Test your knowledge with simulated lab exams and practicals.</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
                <p className="text-sm font-medium">Be the first to know when it launches!</p>
                <div className="flex w-full max-w-md mx-auto items-center space-x-2">
                    <Input type="email" placeholder="Email" disabled />
                    <Button type="submit" disabled>Notify Me</Button>
                </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
