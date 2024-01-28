import {
  RegisteredFileSystemProvider,
  registerFileSystemOverlay,
  RegisteredReadOnlyFile,
  RegisteredMemoryFile,
  initFile,
} from '@codingame/monaco-vscode-files-service-override';
import * as vscode from 'vscode';

void initFile(
  vscode.Uri.file('/tmp/test.js'),
  `// import anotherfile
let variable = 1
function inc () {
  variable++
}

while (variable < 5000) {
  inc()
  console.log('Hello world', variable);
}`
);

const fileSystemProvider = new RegisteredFileSystemProvider(false);
fileSystemProvider.registerFile(
  new RegisteredReadOnlyFile(
    vscode.Uri.file('/tmp/test_readonly.js'),
    async () => 'This is a readonly static file'
  )
);

fileSystemProvider.registerFile(
  new RegisteredMemoryFile(
    vscode.Uri.file('/tmp/jsconfig.json'),
    `{
  "compilerOptions": {
    "target": "es2020",
    "module": "esnext",
    "lib": [
      "es2021",
      "DOM"
    ]
  }
}`
  )
);

fileSystemProvider.registerFile(
  new RegisteredMemoryFile(
    vscode.Uri.file('/tmp/index.html'),
    `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>monaco-vscode-api demo</title>
    <link rel="stylesheet" href="test.css">
  </head>
  <body>
    <style type="text/css">
      h1 {
        color: DeepSkyBlue;
      }
    </style>

    <h1>Hello, world!</h1>
  </body>
</html>`
  )
);

fileSystemProvider.registerFile(
  new RegisteredMemoryFile(
    vscode.Uri.file('/tmp/test.md'),
    `
***Hello World***

Math block:
$$
\\displaystyle
\\left( \\sum_{k=1}^n a_k b_k \\right)^2
\\leq
\\left( \\sum_{k=1}^n a_k^2 \\right)
\\left( \\sum_{k=1}^n b_k^2 \\right)
$$

# Easy Math

2 + 2 = 4 // this test will pass
2 + 2 = 5 // this test will fail

# Harder Math

230230 + 5819123 = 6049353
`
  )
);

fileSystemProvider.registerFile(
  new RegisteredMemoryFile(
    vscode.Uri.file('/tmp/test.customeditor'),
    `
Custom Editor!`
  )
);

fileSystemProvider.registerFile(
  new RegisteredMemoryFile(
    vscode.Uri.file('/tmp/test.css'),
    `
h1 {
  color: DeepSkyBlue;
}`
  )
);

registerFileSystemOverlay(1, fileSystemProvider);
