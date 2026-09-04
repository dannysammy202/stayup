import fs from 'node:fs'

const promptsPath = new URL('../src/data/prompts.js', import.meta.url)
const appPath = new URL('../src/App.jsx', import.meta.url)

const followUps = [
  'Give me the story behind your answer.',
  'What made you think of that first?',
  'Give me one real example.',
  'What changed your mind about it?',
  'What part of your answer would surprise people?',
  'What is the part you usually leave out?',
  'When did you first realise this about yourself?',
  'What would your younger self say about your answer?',
  'Who influenced your answer the most?',
  'Has your answer changed over time?',
  'What is the funniest example you have?',
  'What is the most honest version of your answer?',
  'What would make your answer different a year from now?',
  'What is one detail you still think about?',
  'What would someone close to you say about your answer?',
  'What is the lesson behind your answer?',
  'What part of this do you care about more than people realise?',
  'What is one thing you are still figuring out about it?',
  'What is the strongest memory connected to your answer?',
  'What would make you answer differently?',
]

let prompts = fs.readFileSync(promptsPath, 'utf8')

if (!prompts.includes('// stayup-1000-expanded')) {
  prompts = prompts.replace(
    "} from './categories.js'\n",
    "} from './categories.js'\n\n// stayup-1000-expanded\n",
  )

  prompts = prompts.replace(
    '  return prompts.slice(0, 500)\n}',
    `  const basePrompts = prompts.slice(0, 500)\n  const followUps = ${JSON.stringify(followUps, null, 2)}\n  const extraPrompts = basePrompts.map((prompt, i) => {\n    const text = \`\${prompt.text} \${followUps[i % followUps.length]}\`\n    return {\n      ...prompt,\n      id: \`\${categoryId}-\${mode}-\${500 + i}\`,\n      text,\n      copyText: text,\n      tags: [...prompt.tags, 'expanded'],\n    }\n  })\n\n  return [...basePrompts, ...extraPrompts]\n}`,
  )

  prompts = prompts.replace(
    'function buildTruthDare(mode) {',
    `const secondSetFollowUps = ${JSON.stringify(followUps, null, 2)}\n\nfunction addSecondSetFollowUp(text, i) {\n  if (i < 500) return text\n  return \`\${text} \${secondSetFollowUps[(i - 500) % secondSetFollowUps.length]}\`\n}\n\nfunction buildTruthDare(mode) {`,
  )

  prompts = prompts.replace('for (let i = 0; i < 500; i += 1)', 'for (let i = 0; i < 1000; i += 1)')
  prompts = prompts.replaceAll('Array.from({ length: 500 }', 'Array.from({ length: 1000 }')

  prompts = prompts.replace('const truthText = template(s)', 'const truthText = addSecondSetFollowUp(template(s), i)')
  prompts = prompts.replace('const dareText = `${action}. ${twist}`', 'const dareText = addSecondSetFollowUp(`${action}. ${twist}`, i)')
  prompts = prompts.replace('const text = `Never have I ever ${action}${context ? ` ${context}` : \'\'}.`', 'const text = addSecondSetFollowUp(`Never have I ever ${action}${context ? ` ${context}` : \'\'}.`, i)')
  prompts = prompts.replace('const text = `Scenario: ${scenarios[i % scenarios.length]}. ${scenarioTwists[Math.floor(i / scenarios.length) % scenarioTwists.length]}`', 'const text = addSecondSetFollowUp(`Scenario: ${scenarios[i % scenarios.length]}. ${scenarioTwists[Math.floor(i / scenarios.length) % scenarioTwists.length]}`, i)')
  prompts = prompts.replace('const text = `If you had to choose, would you rather ${a} or ${b}?`', 'const text = addSecondSetFollowUp(`If you had to choose, would you rather ${a} or ${b}?`, i)')
  prompts = prompts.replace('const text = `Who is more likely to ${action} ${context}?`', 'const text = addSecondSetFollowUp(`Who is more likely to ${action} ${context}?`, i)')
  prompts = prompts.replace('const text = knowTemplates[Math.floor(i / topics.length) % knowTemplates.length](topics[i % topics.length])', 'const text = addSecondSetFollowUp(knowTemplates[Math.floor(i / topics.length) % knowTemplates.length](topics[i % topics.length]), i)')
  prompts = prompts.replace('const text = `Finish the sentence: “${starter}${context ? ` ${context}` : \'\'}…”`', 'const text = addSecondSetFollowUp(`Finish the sentence: “${starter}${context ? ` ${context}` : \'\'}…”`, i)')

  fs.writeFileSync(promptsPath, prompts)
}

let app = fs.readFileSync(appPath, 'utf8')

if (!app.includes('// stayup-1000-ui')) {
  app = app.replace("import { APP_NAME } from './config'", "import { APP_NAME } from './config'\n\n// stayup-1000-ui")
  app = app.replace("category.id === 'truth-dare' ? '1,000' : '500'", "category.id === 'truth-dare' ? '2,000' : '1,000'")
  app = app.replace('conversationCategories.length * 500', 'conversationCategories.length * 1000')
  app = app.replace("c.id === 'truth-dare' ? 1000 : 500", "c.id === 'truth-dare' ? 2000 : 1000")
  app = app.replace("categoryId === 'truth-dare' && subtype !== 'All' ? '500' : categoryId === 'truth-dare' ? '1,000' : '500'", "categoryId === 'truth-dare' && subtype !== 'All' ? '1,000' : categoryId === 'truth-dare' ? '2,000' : '1,000'")
  fs.writeFileSync(appPath, app)
}
