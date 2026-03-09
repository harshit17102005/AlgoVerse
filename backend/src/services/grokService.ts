import dotenv from 'dotenv';
dotenv.config();

export async function generateDSASteps(prompt: string) {
    if (!process.env.GROK_API_KEY) {
        throw new Error('GROK_API_KEY is not configured.');
    }

    const systemPrompt = `
You are AlgoVerse, an expert Computer Science tutor and Data Structure/Algorithm behavior engine.
The user will give you a prompt like "Sort 5, 2, 9, 1 using quicksort" or "Find shortest path from A to D".
You must return a JSON object EXACTLY matching this structure, and absolutely nothing else (no markdown wrapping):

{
  "structure": "array" | "binary_tree" | "graph" | "sorting",
  "title": "Algorithm Title",
  "algorithm": [
    "Step 1: Set pivot to the last element",
    "Step 2: Partition the array around the pivot",
    "Step 3: Recursively sort the left and right sub-arrays"
  ],
  "complexity": { "time": "O(n)", "space": "O(1)" },
  "steps": [
    {
      "action": "init",
      "explanation": "Detailed explanation of this step",
      "state": {
         "array": [1, 2, 3]
      },
      "highlights": ["0", "1"],
      "pointers": { "i": 0, "j": 1 }
    }
  ]
}

RULES:
1. 'structure' MUST be one of: array, sorting, binary_tree, graph, linked_list.
2. GRANULARITY: Provide step-by-step animations, aiming for around 10 to 15 steps total. Do not skip major steps, but avoid generating 40+ overly tedious micro-steps. The 'algorithm' field is a high-level summary, while the 'steps' array shows the visual progression.
3. STARTING STATE: Always start the animation with a reasonable data structure. Arrays should have 5-8 elements. Trees should have 5-8 nodes spread across multiple levels. Graphs should have 4-6 nodes. Do NOT use trivially small structures, but avoid massive ones to keep generation fast.
4. For Stack or Queue operations, use "array" as the structure but you MUST include "Stack" or "Queue" in the title respectively (e.g. "Stack Push Operation").
5. 'highlights' should contain indices of elements currently being compared or modified (as strings).
6. 'pointers' should contain any tracking variables (like 'i', 'j', 'pivot', 'top', 'front', 'rear') pointing to their indices/IDs.
7. The 'state' object MUST contain the full snapshot of the structure at each step.
   - For arrays/stacks/queues: "state": { "array": [val1, val2] }
   - For trees: "state": { "tree": { "id": "root", "value": 10, "left": null, "right": null } }
   - For graphs: "state": { "nodes": [{ "id": "A", "value": "A" }], "edges": [{ "source": "A", "target": "B" }] }
   - For linked lists: "state": { "linked_list": [{ "id": "1", "value": 10, "next": "2" }, { "id": "2", "value": 20 }] }
`;

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.GROK_API_KEY}`
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: prompt }
                ],
                temperature: 0.1,
                response_format: { type: "json_object" }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Grok API Error: ${response.status} ${errorText}`);
        }

        const result = await response.json();
        let text = result.choices[0].message.content;

        // Remove markdown formatting if present
        if (text.startsWith('```json')) {
            text = text.replace(/^```json\n/, '').replace(/\n```$/, '');
        } else if (text.startsWith('```')) {
            text = text.replace(/^```\n/, '').replace(/\n```$/, '');
        }

        return JSON.parse(text);
    } catch (error) {
        console.error("Grok Error:", error);
        throw error;
    }
}
