'use server';

/**
 * @fileOverview AI-powered loan explanation flow.
 *
 * - generateLoanExplanation - A function that generates a human-readable explanation of a loan decision based on user-provided financial information.
 * - GenerateLoanExplanationInput - The input type for the generateLoanExplanation function.
 * - GenerateLoanExplanationOutput - The return type for the generateLoanExplanation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateLoanExplanationInputSchema = z.object({
  income: z.number().describe('Annual income of the applicant.'),
  loanAmount: z.number().describe('The amount of loan requested.'),
  creditScore: z.number().describe('Credit score of the applicant.'),
  age: z.number().describe('Age of the applicant.'),
  jobType: z.string().describe('Job type of the applicant.'),
});
export type GenerateLoanExplanationInput = z.infer<typeof GenerateLoanExplanationInputSchema>;

const GenerateLoanExplanationOutputSchema = z.object({
  explanation: z.string().describe('A human-readable explanation of the loan decision.'),
});
export type GenerateLoanExplanationOutput = z.infer<typeof GenerateLoanExplanationOutputSchema>;

export async function generateLoanExplanation(input: GenerateLoanExplanationInput): Promise<GenerateLoanExplanationOutput> {
  return generateLoanExplanationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateLoanExplanationPrompt',
  input: {schema: GenerateLoanExplanationInputSchema},
  output: {schema: GenerateLoanExplanationOutputSchema},
  prompt: `You are an AI assistant that provides explanations for loan decisions based on applicant's financial information.

  Given the following information about a loan applicant, generate a concise and human-readable explanation of the factors influencing the loan decision.

  Income: {{{income}}}
  Loan Amount: {{{loanAmount}}}
  Credit Score: {{{creditScore}}}
  Age: {{{age}}}
  Job Type: {{{jobType}}}
  `,
});

const generateLoanExplanationFlow = ai.defineFlow(
  {
    name: 'generateLoanExplanationFlow',
    inputSchema: GenerateLoanExplanationInputSchema,
    outputSchema: GenerateLoanExplanationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
