const fileInput = document.getElementById('fileInput');
const contentInput = document.getElementById('contentInput');
const translateBtn = document.getElementById('translateBtn');
const responseArea = document.getElementById('responseArea');
const apiKeyInput = document.getElementById('apiKey');
const targetLangSelect = document.getElementById('targetLang');
const formatForce = document.getElementById('formatForce');
const modelSelect = document.getElementById('modelSelect');
const downloadBtn = document.getElementById('downloadBtn');
const copyBtn = document.getElementById('copyBtn');

let lastTranslatedText = '';
let uploadedFileName = '';

function buildPrompt(originalText, detectedFormat, targetLang) {
  const prompt = `
🚨🚨🚨 CRITICAL TRANSLATION ASSISTANT - ABSOLUTE STRICT RULES 🚨🚨🚨
🚨🚨🚨 YOU ARE FORBIDDEN TO TRANSLATE KEYS/PROPERTY NAMES 🚨🚨🚨
🚨🚨🚨 IF YOU DO, THE TRANSLATION WILL BE COMPLETELY REJECTED 🚨🚨🚨

TARGET LANGUAGE: "${targetLang}"
INPUT FORMAT: ${detectedFormat.toUpperCase()}

=== 🚫🚫🚫 ABSOLUTE FORBIDDEN ACTIONS (NEVER DO THESE) 🚫🚫🚫 ===

❌❌❌ CRITICAL: NEVER TRANSLATE OR MODIFY KEYS/PROPERTY NAMES ❌❌❌
❌❌❌ CRITICAL: NEVER TRANSLATE OR MODIFY KEYS/PROPERTY NAMES ❌❌❌
❌❌❌ CRITICAL: NEVER TRANSLATE OR MODIFY KEYS/PROPERTY NAMES ❌❌❌

🚨 EXAMPLES OF WHAT YOU MUST NEVER TOUCH (KEYS STAY EXACTLY THE SAME):

FRENCH INPUT → ENGLISH OUTPUT (KEYS MUST REMAIN FRENCH):
- "réponses" → KEEP AS "réponses" (NOT "responses")
- "commun" → KEEP AS "commun" (NOT "common")
- "inconnu" → KEEP AS "inconnu" (NOT "unknown")
- "hub" → KEEP AS "hub" (NOT "hub")
- "configuration" → KEEP AS "configuration" (NOT "configuration")
- "configurationComplète" → KEEP AS "configurationComplète" (NOT "completeConfiguration")
- "invitationModifier" → KEEP AS "invitationModifier" (NOT "invitationToEdit")
- "aperçu" → KEEP AS "aperçu" (NOT "preview")
- "titreSauvegardé" → KEEP AS "titreSauvegardé" (NOT "savedTitle")
- "titreAperçu" → KEEP AS "titreAperçu" (NOT "previewTitle")
- "nom" → KEEP AS "nom" (NOT "name")
- "court" → KEEP AS "court" (NOT "short")
- "description" → KEEP AS "description" (NOT "description")
- "locale" → KEEP AS "locale" (NOT "locale")
- "titreSuccès" → KEEP AS "titreSuccès" (NOT "successTitle")
- "descriptionSuccès" → KEEP AS "descriptionSuccès" (NOT "successDescription")
- "chargement" → KEEP AS "chargement" (NOT "loading")
- "créationHub" → KEEP AS "créationHub" (NOT "hubCreation")

SPANISH INPUT → ENGLISH OUTPUT (KEYS MUST REMAIN SPANISH):
- "respuestas" → KEEP AS "respuestas" (NOT "responses")
- "común" → KEEP AS "común" (NOT "common")
- "desconocido" → KEEP AS "desconocido" (NOT "unknown")
- "configuración" → KEEP AS "configuración" (NOT "configuration")
- "configuraciónCompleta" → KEEP AS "configuraciónCompleta" (NOT "completeConfiguration")

ENGLISH INPUT → SPANISH OUTPUT (KEYS MUST REMAIN ENGLISH):
- "responses" → KEEP AS "responses" (NOT "respuestas")
- "common" → KEEP AS "common" (NOT "común")
- "unknown" → KEEP AS "unknown" (NOT "desconocido")
- "configuration" → KEEP AS "configuration" (NOT "configuración")

🚨🚨🚨 THE RULE IS SIMPLE: KEYS NEVER CHANGE, ONLY VALUES TRANSLATE 🚨🚨🚨

❌ NEVER translate, modify, or change ANY of these:
- Keys/property names (e.g., "title", "description", "user_name")
- Variable placeholders: {user}, {count}, {hubName}, {emoji}, \`{param}\`, \${variable}, etc.
- File paths: /path/to/file, C:\\folder\\file
- URLs: https://example.com, www.site.org
- Email addresses: user@domain.com
- IP addresses: 192.168.1.1, ::1
- Port numbers: 8080, 3000
- Version numbers: v1.2.3, 2.0.0
- File extensions: .json, .yaml, .txt
- Boolean values: true, false
- Numeric values: 42, 3.14, -100
- Null values: null, undefined
- Special characters: @, #, $, %, &, *, +, -, =, |, \, /, <, >, [, ], {, }, (, )
- Markdown syntax: **bold**, *italic*, \`code\`, [link](url), etc.
- Emojis: 💡, 😊, :smile:, etc.
- HTML tags: <div>, <span>, <p>, etc.
- CSS classes: .class-name, #id-name
- Function names: functionName(), method_name()
- Database fields: user_id, created_at, is_active

❌ NEVER change the structure:
- Keep exact same nesting levels
- Keep exact same key order
- Keep exact same indentation/spacing
- Keep exact same quotes (single vs double)
- Keep exact same data types

=== ✅ MANDATORY ACTIONS (ALWAYS DO THESE) ✅ ===

✅ ALWAYS translate ONLY the text content values (the strings after the colons):
- User-facing messages
- Descriptions
- Help text
- Error messages
- Button labels
- Menu items
- Form labels
- Instructions
- Comments (if they contain translatable text)

✅ ALWAYS respect the target language:
- Use proper grammar and spelling for "${targetLang}"
- Follow language-specific conventions
- Use appropriate formal/informal tone
- Respect cultural context when applicable

✅ ALWAYS maintain format integrity:
- Output must be valid ${detectedFormat.toUpperCase()}
- Preserve all syntax exactly
- Keep all structural elements intact

=== 🔒 OUTPUT REQUIREMENTS 🔒 ===
- Return ONLY the translated file content
- NO explanations, NO introductions, NO metadata
- NO additional text or comments
- NO code blocks or markdown formatting
- Just the pure translated file content

=== ⚠️ FINAL WARNING ⚠️ ===
🚨🚨🚨 IF YOU TRANSLATE ANY KEYS/PROPERTY NAMES, THE TRANSLATION WILL BE COMPLETELY REJECTED 🚨🚨🚨
🚨🚨🚨 IF YOU TRANSLATE ANY KEYS/PROPERTY NAMES, THE TRANSLATION WILL BE COMPLETELY REJECTED 🚨🚨🚨
🚨🚨🚨 IF YOU TRANSLATE ANY KEYS/PROPERTY NAMES, THE TRANSLATION WILL BE COMPLETELY REJECTED 🚨🚨🚨

🚨🚨🚨 REMEMBER: KEYS ARE SACRED, NEVER TOUCH THEM 🚨🚨🚨
🚨🚨🚨 ONLY TRANSLATE THE STRING VALUES AFTER THE COLONS 🚨🚨🚨

Your ONLY job is to translate text content while preserving EVERYTHING else exactly as-is.
KEYS = NEVER TOUCH, VALUES = TRANSLATE ONLY

INPUT CONTENT TO TRANSLATE:
<<<INPUT_START>>>
${originalText}
<<<INPUT_END>>>

TRANSLATE NOW - RETURN ONLY THE TRANSLATED FILE CONTENT:
🚨🚨🚨 REMEMBER: KEYS STAY EXACTLY THE SAME, ONLY TRANSLATE THE STRING VALUES 🚨🚨🚨
`;

  return prompt.trim();
}

function detectFormatAndNormalize(text) {
  try {
    const parsed = JSON.parse(text);
    return { format: 'json', parsed };
  } catch (e) {
    try {
      const parsed = jsyaml.load(text);
      return { format: 'yaml', parsed };
    } catch (e2) {
      return { format: 'unknown', parsed: null };
    }
  }
}

function extractCodeBlock(text) {
  console.log('Input text:', text);
  
  if (text.includes('<think>')) {
    console.log('Found <think> block');
    const afterThink = text.split('</think>')[1];
    if (afterThink) {
      console.log('Content after think:', afterThink);
      
      const codeMatch = afterThink.match(/```(?:json|yaml|yml)?\s*([\s\S]*?)```/i);
      if (codeMatch) {
        console.log('Found code block:', codeMatch[1]);
        return codeMatch[1].trim();
      }
      
      return afterThink.trim();
    }
  }

  const match = text.match(/```(?:json|yaml|yml)?\s*([\s\S]*?)```/i);
  if (match) {
    console.log('Found direct code block:', match[1]);
    return match[1].trim();
  }

  try {
    const parsed = JSON.parse(text);
    return JSON.stringify(parsed, null, 2);
  } catch (e) {}

  try {
    const parsed = jsyaml.load(text);
    return jsyaml.dump(parsed);
  } catch (e) {}

  return text.trim();
}

function showActionButtons() {
  copyBtn.style.display = 'inline-block';
  downloadBtn.style.display = 'inline-block';
}

function hideActionButtons() {
  copyBtn.style.display = 'none';
  downloadBtn.style.display = 'none';
}

fileInput.addEventListener('change', (ev) => {
  const f = ev.target.files[0];
  if (!f) return;
  
  uploadedFileName = f.name;
  const reader = new FileReader();
  reader.onload = (e) => {
    contentInput.value = e.target.result;
  };
  reader.readAsText(f, 'utf-8');
});

translateBtn.addEventListener('click', async () => {
  const apiKey = apiKeyInput.value.trim();
  if (!apiKey) {
    alert('Please paste your Groq API Key in the "Groq API Key" field.');
    return;
  }

  let content = contentInput.value.trim();
  if (!content) {
    alert('No content to translate. Paste JSON/YAML or upload a file.');
    return;
  }

  translateBtn.disabled = true;
  translateBtn.textContent = '⏳ Translating...';

  const detected = detectFormatAndNormalize(content);
  if (detected.format === 'unknown') {
    if (formatForce.value === 'auto') {
      const proceed = confirm('I could not automatically parse the content as JSON or YAML. Do you want to send the text as-is for the model to process as plain text? (Recommended: fix format).');
      if (!proceed) {
        translateBtn.disabled = false;
        translateBtn.textContent = '🔁 Translate';
        return;
      }
    }
  }

  let outputFormat = detected.format === 'unknown' ? 'json' : detected.format;
  if (formatForce.value === 'json') outputFormat = 'json';
  if (formatForce.value === 'yaml') outputFormat = 'yaml';

  const targetLang = targetLangSelect.value;
  const prompt = buildPrompt(content, detected.format === 'unknown' ? 'plaintext' : detected.format, targetLang);

  try {
    const modelName = modelSelect.value;
    const endpoint = `https://api.groq.com/openai/v1/chat/completions`;

    const body = {
      model: modelName,
      messages: [{
        role: "user",
        content: prompt
      }],
      temperature: 0.3
    };

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Response not OK: ${res.status} ${res.statusText}\n${text}`);
    }

    const json = await res.json();

    let modelText = '';
    if (json.choices && json.choices[0] && json.choices[0].message && json.choices[0].message.content) {
      modelText = json.choices[0].message.content;
    } else if (json.output && typeof json.output === 'string') {
      modelText = json.output;
    } else if (json.outputs && Array.isArray(json.outputs) && json.outputs[0] && json.outputs[0].content) {
      modelText = Array.isArray(json.outputs[0].content) ? json.outputs[0].content.map(c=>c.text||'').join('') : (json.outputs[0].content.text || JSON.stringify(json.outputs[0].content));
    } else if (json.result && typeof json.result === 'string') {
      modelText = json.result;
    } else {
      modelText = JSON.stringify(json, null, 2);
    }

    modelText = modelText.trim();

    const extractedText = extractCodeBlock(modelText);
    if (extractedText !== modelText) {
      console.log('Extracted content from response:', extractedText);
      modelText = extractedText;
    }

    let isValid = true;
    try {
      if (outputFormat === 'json') {
        JSON.parse(modelText);
      } else if (outputFormat === 'yaml') {
        jsyaml.load(modelText);
      }
    } catch (e) {
      isValid = false;
    }

    responseArea.textContent = modelText;
    lastTranslatedText = modelText;
    showActionButtons();

    if (!isValid) {
      alert('The model output is not syntactically valid for the requested format. Check the displayed text.');
    }
  } catch (err) {
    console.error(err);
    alert('Error: ' + (err.message || String(err)));
  } finally {
    translateBtn.disabled = false;
    translateBtn.textContent = '🔁 Translate';
  }
});

downloadBtn.addEventListener('click', () => {
  if (!lastTranslatedText) return;
  
  const targetLang = targetLangSelect.value;
  let fileName = '';
  
  if (uploadedFileName) {
    const nameWithoutExt = uploadedFileName.replace(/\.[^/.]+$/, '');
    fileName = `${nameWithoutExt}-${targetLang}.json`;
  } else {
    fileName = `translation-${targetLang}.json`;
  }
  
  const blob = new Blob([lastTranslatedText], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
});

copyBtn.addEventListener('click', async () => {
  if (!lastTranslatedText) return;
  
  try {
    await navigator.clipboard.writeText(lastTranslatedText);
    const originalText = copyBtn.textContent;
    copyBtn.textContent = '✅ Copied!';
    setTimeout(() => {
      copyBtn.textContent = originalText;
    }, 2000);
  } catch (err) {
    console.error('Failed to copy:', err);
    alert('Failed to copy to clipboard');
  }
});
