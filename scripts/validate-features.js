// Validates all .feature files under docs/specs/ using @cucumber/gherkin.
// Exits with code 1 if any parse errors are found.
'use strict';

const fs = require('fs');
const path = require('path');
const { generateMessages } = require('@cucumber/gherkin');
const { IdGenerator } = require('@cucumber/messages');

const SPECS_DIR = path.join(__dirname, '..', 'docs', 'specs');

function findFeatureFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findFeatureFiles(full));
    } else if (entry.name.endsWith('.feature')) {
      results.push(full);
    }
  }
  return results;
}

const files = findFeatureFiles(SPECS_DIR);

if (files.length === 0) {
  console.log('No .feature files found.');
  process.exit(0);
}

let totalErrors = 0;

for (const file of files) {
  const source = fs.readFileSync(file, 'utf8');
  const relative = path.relative(process.cwd(), file);
  const messages = Array.from(
    generateMessages(source, relative, 'text/x.cucumber.gherkin+plain', {
      includeSource: false,
      includeGherkinDocument: true,
      includePickles: false,
      newId: IdGenerator.uuid(),
    }),
  );
  const errors = messages.filter((m) => m.parseError);
  if (errors.length > 0) {
    for (const { parseError } of errors) {
      console.error(`✗ ${relative}: ${parseError.message}`);
    }
    totalErrors += errors.length;
  } else {
    console.log(`✓ ${relative}`);
  }
}

if (totalErrors > 0) {
  console.error(`\n${totalErrors} parse error(s) found.`);
  process.exit(1);
} else {
  console.log(`\nAll ${files.length} feature file(s) valid.`);
}
