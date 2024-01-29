import monaco from "./setup";
import * as vscode from "vscode";
import { createConfiguredEditor, createModelReference } from "vscode/monaco";
import "@codingame/monaco-vscode-theme-defaults-default-extension";
import "@codingame/monaco-vscode-javascript-default-extension";
import "@codingame/monaco-vscode-typescript-basics-default-extension";
// import '@codingame/monaco-vscode-typescript-language-features-default-extension';

// await initializeVscodeExtensions();

const editorDiv = document.createElement("div");
editorDiv.style.height = "100%";
const uri = vscode.Uri.file("/path/to/index.ts");

monaco.editor.createModel('console.log("hi")', undefined, uri);
const modelRef = await createModelReference(uri);

const editor = createConfiguredEditor(editorDiv, {
  model: modelRef.object.textEditorModel,
  automaticLayout: true,
});

export default function MonacoEditor() {
  return (
    <div
      ref={(div) => (div ? div.replaceWith(editorDiv) : editor.dispose())}
    ></div>
  );
}
