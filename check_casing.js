import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.resolve(__dirname, 'frontend/src');

function getAllFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            getAllFiles(filePath, fileList);
        } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
            fileList.push(filePath);
        }
    });
    return fileList;
}

const files = getAllFiles(srcDir);
let errorsFound = false;

files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const importRegex = /import\s+.*\s+from\s+['"](.*)['"]/g;
    let match;
    while ((match = importRegex.exec(content)) !== null) {
        const importPath = match[1];
        if (importPath.startsWith('.')) {
            const fullImportPath = path.resolve(path.dirname(file), importPath);
            const possibleExtensions = ['', '.js', '.jsx', '.css', '/index.js', '/index.jsx'];

            let found = false;
            let actualPath = '';

            for (const ext of possibleExtensions) {
                const testPath = fullImportPath + ext;
                if (fs.existsSync(testPath)) {
                    // Check casing
                    const dir = path.dirname(testPath);
                    const base = path.basename(testPath);
                    const filesInDir = fs.readdirSync(dir);
                    if (filesInDir.includes(base)) {
                        found = true;
                        break;
                    } else {
                        // Found but casing different
                        const correctCasing = filesInDir.find(f => f.toLowerCase() === base.toLowerCase());
                        console.error(`Case Mismatch in ${path.relative(srcDir, file)}:`);
                        console.error(`  Imported: ${importPath}`);
                        console.error(`  Actual:   ${correctCasing}`);
                        errorsFound = true;
                        found = true;
                        break;
                    }
                }
            }
        }
    }
});

if (!errorsFound) {
    console.log('No casing mismatches found in relative imports.');
}
