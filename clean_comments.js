const fs = require('fs');
const path = require('path');

function removeComments(code) {
  let inString = false;
  let stringChar = null;
  let inSingleComment = false;
  let inMultiComment = false;
  let isJsDoc = false;
  let result = '';

  for (let i = 0; i < code.length; i++) {
    const c = code[i];
    const next = code[i + 1];

    if (!inString && !inSingleComment && !inMultiComment && !isJsDoc) {
      if ((c === '"' || c === "'" || c === '`')) {
        inString = true;
        stringChar = c;
        result += c;
      } else if (c === '/' && next === '/') {
        inSingleComment = true;
        i++; // skip next
      } else if (c === '/' && next === '*') {
        if (code[i + 2] === '*') {
          isJsDoc = true;
          result += c;
          result += next;
          i++; // skip next
        } else {
          inMultiComment = true;
          i++; // skip next
        }
      } else {
        result += c;
      }
    } else if (inString) {
      result += c;
      if (c === '\\') {
        if (next !== undefined) {
            result += next; // escape
            i++;
        }
      } else if (c === stringChar) {
        inString = false;
        stringChar = null;
      }
    } else if (inSingleComment) {
      if (c === '\n' || c === '\r') {
        inSingleComment = false;
        result += c;
      }
    } else if (inMultiComment) {
      if (c === '*' && next === '/') {
        inMultiComment = false;
        i++; // skip next
      }
    } else if (isJsDoc) {
      result += c;
      if (c === '*' && next === '/') {
        isJsDoc = false;
        result += next; // keep it
        i++;
      }
    }
  }
  
  // Clean up empty lines
  result = result.replace(/(\n\s*)+\n/g, '\n\n');
  // Remove starting empty lines
  result = result.replace(/^\s+/, '');
  return result;
}

const dir = 'd:/AVC/AI/do-an-cuoi-ky/lap-trinh-web/milkshop-online/assets/js';
fs.readdirSync(dir).forEach(file => {
  if (file.endsWith('.js')) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let cleaned = removeComments(content);
    fs.writeFileSync(filePath, cleaned, 'utf8');
  }
});
console.log('Cleaned');
