import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Beaker, BookOpen } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Logo from "@/components/icons/Logo";

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === "hero-lab");

  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Logo className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Valence</h1>
        </div>
      </header>
      <main className="flex-grow">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter bg-gradient-to-r from-primary via-blue-400 to-cyan-300 text-transparent bg-clip-text">
              Discover the World of Chemistry
            </h2>
            <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Experiment with chemical reactions in a safe, fun, and
              interactive virtual lab. From explosive fun to structured
              learning, Valence has you covered.
            </p>
          </div>
          {heroImage && (
            <div className="mt-8 md:mt-12 rounded-lg overflow-hidden shadow-2xl shadow-primary/20">
              <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                width={1200}
                height={600}
                className="w-full h-auto object-cover"
                data-ai-hint={heroImage.imageHint}
                priority
              />
            </div>
          )}
        </section>

        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="hover:border-primary/80 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Beaker className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Fun Mode</CardTitle>
                    <CardDescription>Unleash your inner scientist</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Experiment freely with a vast array of chemicals. Mix and
                  match to see what happens, but be warned: some reactions are
                  explosive!
                </p>
                <Button asChild className="w-full">
                  <Link href="/fun">
                    Start Experimenting <ArrowRight className="ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:border-primary/80 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <BookOpen className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Learning Mode</CardTitle>
                    <CardDescription>Guided lessons and exams</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Follow structured lessons based on your syllabus, take exams,
                  and master chemistry concepts in a practical, hands-on
                  environment.
                </p>
                <Button asChild className="w-full">
                  <Link href="/learn">
                    Enter Learning Mode <ArrowRight className="ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <footer className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Valence. All rights reserved.</p>
      </footer>
    </div>
  );
}
