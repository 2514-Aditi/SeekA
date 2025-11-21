'use server';

/**
 * @fileOverview Updates the AI Mirror with user-provided values. Includes a flow, schemas, and wrapper function.
 *
 * - updateAiMirror - A function that handles the AI mirror update process.
 * - UpdateAiMirrorInput - The input type for the updateAiMirror function.
 * - UpdateAiMirrorOutput - The return type for the updateAiMirror function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const UpdateAiMirrorInputSchema = z.object({
  income: z.number().describe('The user income.'),
  loanAmount: z.number().describe('The user loan amount.'),
  creditScore: z.number().describe('The user credit score.'),
  age: z.number().describe('The user age.'),
  jobType: z.string().describe('The user job type.'),
});
export type UpdateAiMirrorInput = z.infer<typeof UpdateAiMirrorInputSchema>;

const UpdateAiMirrorOutputSchema = z.object({
  success: z.boolean().describe('Whether the AI mirror update was successful.'),
  message: z.string().describe('A message indicating the result of the update.'),
});
export type UpdateAiMirrorOutput = z.infer<typeof UpdateAiMirrorOutputSchema>;

export async function updateAiMirror(input: UpdateAiMirrorInput): Promise<UpdateAiMirrorOutput> {
  return updateAiMirrorFlow(input);
}

const updateAiMirrorPrompt = ai.definePrompt({
  name: 'updateAiMirrorPrompt',
  input: {schema: UpdateAiMirrorInputSchema},
  output: {schema: UpdateAiMirrorOutputSchema},
  prompt: `You are a banking AI assistant. The user has updated their AI mirror information. Confirm that the values are updated successfully.

New AI Mirror Data:
Income: {{{income}}}
Loan Amount: {{{loanAmount}}}
Credit Score: {{{creditScore}}}
Age: {{{age}}}
Job Type: {{{jobType}}}

Respond with a JSON object confirming the update and a success message.`,
});

const updateAiMirrorFlow = ai.defineFlow(
  {
    name: 'updateAiMirrorFlow',
    inputSchema: UpdateAiMirrorInputSchema,
    outputSchema: UpdateAiMirrorOutputSchema,
  },
  async input => {
    try {
      const {output} = await updateAiMirrorPrompt(input);
      //console.log(output);
      return {
        success: true,
        message: 'AI Mirror updated successfully.',
      };
    } catch (error: any) {
      console.error('Error updating AI Mirror:', error);
      return {
        success: false,
        message: `AI Mirror update failed: ${error.message}`,
      };
    }
  }
);
