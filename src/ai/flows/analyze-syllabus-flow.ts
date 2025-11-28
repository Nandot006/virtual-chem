
'use server';
/**
 * @fileOverview An AI flow to analyze a syllabus or lab document.
 *
 * - analyzeSyllabus - A function that extracts chemical information from a document.
 * - AnalyzeSyllabusInput - The input type for the analyzeSyllabus function.
 * - AnalyzeSyllabusOutput - The return type for the analyzeSyllabus function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const AnalyzeSyllabusInputSchema = z.object({
  fileDataUri: z.string().describe(
    "A document (PDF, JPG, PNG) as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
  ),
});
export type AnalyzeSyllabusInput = z.infer<typeof AnalyzeSyllabusInputSchema>;

const ChemicalSchema = z.object({
  name: z.string().describe('The common name of the chemical (e.g., Water, Sodium Chloride).'),
  formula: z.string().describe('The chemical formula (e.g., H₂O, NaCl).'),
});

const AnalyzeSyllabusOutputSchema = z.object({
  chemicals: z.array(ChemicalSchema).describe('A list of chemicals mentioned in the document.'),
});
export type AnalyzeSyllabusOutput = z.infer<typeof AnalyzeSyllabusOutputSchema>;


export async function analyzeSyllabus(input: AnalyzeSyllabusInput): Promise<AnalyzeSyllabusOutput> {
  return analyzeSyllabusFlow(input);
}


const syllabusPrompt = ai.definePrompt({
  name: 'syllabusPrompt',
  input: { schema: AnalyzeSyllabusInputSchema },
  output: { schema: AnalyzeSyllabusOutputSchema },
  prompt: `You are an expert chemist's assistant. Your task is to analyze the provided document (a syllabus, lab notes, etc.) and extract a list of all chemicals mentioned.

For each chemical, provide its common name and its chemical formula.

Analyze the following document:
{{media url=fileDataUri}}`,
});


const analyzeSyllabusFlow = ai.defineFlow(
  {
    name: 'analyzeSyllabusFlow',
    inputSchema: AnalyzeSyllabusInputSchema,
    outputSchema: AnalyzeSyllabusOutputSchema,
  },
  async (input) => {
    const {output} = await syllabusPrompt(input);
    if (!output) {
        throw new Error("The model failed to produce an output.");
    }
    return output;
  }
);
