import "jsr:@supabase/functions-js/edge-runtime.d.ts"

// Some environments running TypeScript checks may not have Deno types available.
declare const Deno: {
  env: {
    get(key: string): string | undefined
  }
  serve?: (handler: (req: Request) => Promise<Response> | Response) => void
}

console.log("Generate code function started!")

Deno.serve!(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' } })
  }

  try {
  const { prompt, image } = await req.json()
  const runId = `${Date.now()}-${Math.random().toString(36).slice(2,8)}`
  const steps: Array<{ ts: string; message: string }> = []
  const push = (msg: string) => steps.push({ ts: new Date().toISOString(), message: msg })
  push('received request')
    
    if (!prompt && !image) {
      push('validation failed: missing prompt and image')
      return new Response(
        JSON.stringify({ error: 'Prompt or image is required', runId, steps }),
        { headers: { "Content-Type": "application/json" }, status: 400 }
      )
    }

    const apiKey = Deno.env.get('LLAMA_API_KEY')
    if (!apiKey) {
      push('configuration error: missing LLAMA_API_KEY')
      return new Response(
        JSON.stringify({ error: 'LLAMA_API_KEY not configured', runId, steps }),
        { headers: { "Content-Type": "application/json" }, status: 500 }
      )
    }

  // Use a single, clearer system prompt that always asks for a self-contained HTML document
  // (the user asked that all outputs be HTML-only so the preview iframe can render them)
  const systemPrompt = `You are Llamable, an assistant that returns a single, self-contained HTML document (no explanations, no markdown, no surrounding text).

  IMPORTANT OUTPUT RULES:
  - Return EXACTLY one complete HTML document starting with <!DOCTYPE html> and ending with </html>.
  - Put all CSS inside a single <style> tag in the <head> and all JavaScript inside a single <script> tag just before </body>.
  - Do NOT output TypeScript, JSX, React components, or any framework-specific code.
  - Do NOT include any explanatory text or code fences; the response must be raw HTML only.

  RENDERING / UX REQUIREMENTS:
  - Mobile-first responsive design; it must render cleanly inside an iframe.
  - Use semantic HTML and accessible attributes (aria-*, alt text on images, labels for forms).
  - Include a top navigation bar with 3–5 anchor links that map to section IDs on the page.
  - External links must include target="_blank" rel="noopener noreferrer".
  - Include copyright year 2025 in the footer.

  PRACTICAL CONSTRAINTS:
  - Prefer clarity and a usable, visually-pleasing design over extremely large repetitive sites.
  - If an image URL is provided by the user, include it in the page (use the provided URL as the image src).
  - Keep markup pragmatic and reasonably sized (avoid thousands of near-duplicate sections).

  WHEN THE USER ASKS FOR A "CLONE" OR SUPPLIES A SCREENSHOT:
  - Analyze the screenshot URL and produce an HTML page that approximates the visual layout, colors, typography, and spacing.
  - Do not invent or output additional assets; reference the provided image URL.

  IN ALL CASES:
  - The document must be self-contained and render without external build steps.
  - Use Google Fonts if needed via <link> in the head.
  - Use modern CSS (custom properties, flexbox/grid) but ensure broad browser compatibility.
  - Do not return JSON or any wrapper; only the HTML document.
  `;

    // Stage 1: Prompt enhancer — ask the model to produce a short, focused enhanced prompt / design brief.
    // IMPORTANT: ask for no chain-of-thought and return only the enhanced brief in plain text or JSON.
    const enhancerSystem = `You are a prompt enhancer and design brief generator. Given a user's request and optional screenshot URL, return a concise, actionable enhanced prompt and a short design brief that a website generator can consume.

    OUTPUT FORMAT RULES:
    - Return only JSON with the following keys: enhanced_prompt (string), images (array of suggested image URLs or empty), videos (array of suggested video URLs or empty), notes (short string).
    - Do NOT include chain-of-thought, internal reasoning, or any extra text outside the JSON.
    - Keep values brief but specific: list hero elements, sections to include, suggested image placements, color palette (3 colors), fonts, and key animations/interactions.
    `;

    const enhancerUserContent = image
      ? {
          role: 'user',
          content: [
            { type: 'text', text: (prompt || 'Create a website from this screenshot or description') + '\n\nReturn the enhanced prompt JSON as specified.' },
            { type: 'image_url', image_url: { url: image } },
          ],
        }
      : { role: 'user', content: (prompt || 'Create a website from this description. Return the enhanced prompt JSON as specified.') };

  let enhancedPromptText: string | null = null;
  push('starting prompt enhancer')

    try {
      const enhancerResp = await fetch('https://api.llama.com/compat/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'Llama-4-Maverick-17B-128E-Instruct-FP8',
          messages: [ { role: 'system', content: enhancerSystem }, enhancerUserContent ],
          max_tokens: 1500,
          temperature: 0.7,
        }),
      });

  if (enhancerResp.ok) {
        const enhancerData = await enhancerResp.json();
        const raw = enhancerData.choices?.[0]?.message?.content || '';
        // Try to extract JSON from the response
        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            const parsed = JSON.parse(jsonMatch[0]);
            enhancedPromptText = parsed.enhanced_prompt || null;
          } catch (e) {
            // fallback to raw if JSON.parse fails
            enhancedPromptText = raw;
          }
        } else {
          enhancedPromptText = raw;
        }
        push('prompt enhancer completed')
      }
    } catch (e) {
      console.error('Enhancer error:', e);
      push('prompt enhancer failed')
      enhancedPromptText = null;
    }

  // If enhancer didn't produce anything, fall back to the original prompt.
  const finalPromptSource = enhancedPromptText || prompt || 'Create a single self-contained HTML document that implements the requested UI; return only the HTML.';
  push('final prompt prepared')

    // Stage 2: HTML generator — encourage images/videos, animations, and rich interactive sections.
    const htmlSystem = systemPrompt + `

IMPORTANT IMAGE REQUIREMENTS:
- For ALL images, use reliable Picsum URLs with seeds for consistency: https://picsum.photos/seed/[unique-seed]/[width]/[height]
- Use different seeds for different images (e.g., hero1, gallery1, team1, feature1, etc.)
- Always wrap images in <figure> tags with proper alt text and figcaptions
- Include error handling: onerror="this.src='https://placehold.co/[width]x[height]?text=Image+not+found'; this.onerror=null;"
- Add loading="lazy" and decoding="async" for performance
- Example: <figure><img src="https://picsum.photos/seed/hero1/800/600" alt="Hero image" width="800" height="600" loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror="this.src='https://placehold.co/800x600?text=Image+not+found'; this.onerror=null;"><figcaption>Description</figcaption></figure>

Additional instructions: Aim for a richly detailed, modern page with multiple well-structured sections, polished animations, and accessible markup. Include multiple images using the Picsum pattern above. Avoid unnecessary repetition; prefer meaningful, diverse content across sections.`;

  push('starting HTML generation')
  const response = await fetch('https://api.llama.com/compat/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'Llama-4-Maverick-17B-128E-Instruct-FP8',
        messages: [
          { role: 'system', content: htmlSystem },
          image
            ? {
                role: 'user',
                content: [
                  { type: 'text', text: finalPromptSource + '\n\nRespond with a single self-contained HTML document. Do not include any explanatory text.' },
                  { type: 'image_url', image_url: { url: image } },
                ],
              }
            : { role: 'user', content: finalPromptSource + '\n\nRespond with a single self-contained HTML document. Do not include any explanatory text.' },
        ],
        max_tokens: 50000,
        temperature: 0.75,
      }),
    });

    if (!response.ok) {
      push(`HTML generation failed: ${response.status}`)
      throw new Error(`Llama API error: ${response.status}`)
    }

    const data = await response.json()
    let generatedCode = data.choices[0]?.message?.content || '';
    const tokens = data.usage?.total_tokens;
    
    push('HTML generation completed; cleaning response')
    // Clean up the response - remove any markdown or explanations
    if (generatedCode.includes('```')) {
      const codeMatch = generatedCode.match(/```(?:html|javascript|typescript|jsx|tsx)?\n?([\s\S]*?)\n?```/);
      if (codeMatch) {
        generatedCode = codeMatch[1];
      }
    }
    push('finished; returning response')
    const summary = `Completed generation: enhancer ${enhancedPromptText ? 'used' : 'skipped'}, image ${image ? 'provided' : 'not provided'}, tokens ${tokens || 'unknown'}`

    return new Response(
      JSON.stringify({ 
        code: generatedCode,
        hasImage: !!image,
        tokens,
        runId,
        summary,
        steps,
        status: 'done'
      }),
      { 
        headers: { 
          "Content-Type": "application/json",
          'Access-Control-Allow-Origin': '*'
        } 
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 
          "Content-Type": "application/json",
          'Access-Control-Allow-Origin': '*'
        }, 
        status: 500 
      }
    )
  }
})