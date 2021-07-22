import * as vscode from 'vscode';

const cats = {
  'Coding Cat': 'https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif',
  'Compiling Cat': 'https://media.giphy.com/media/mlvseq9yvZhba/giphy.gif'
};


const CatsProvider = (context: vscode.ExtensionContext) => {
  const panel = vscode.window.createWebviewPanel(
    'catCoding',
    'Cat Coding',
    vscode.ViewColumn.One,
    {}
  );

  let iteration = 0;
  const updateWebview = () => {
    const cat = iteration++ % 2 ? 'Compiling Cat' : 'Coding Cat';
    panel.title = cat;
    panel.webview.html = getWebviewContent(cat);
  };

  // Set initial content
  updateWebview();

  // And schedule updates to the content every second
  const interval = setInterval(updateWebview, 1000);

  panel.onDidDispose(
    () => {
      // When the panel is closed, cancel any future updates to the webview content
      clearInterval(interval);
    },
    null,
    context.subscriptions
  );
};

function getWebviewContent(cat: keyof typeof cats) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cat Coding</title>
</head>
<body>

    <div class="test"></div>
    <script>
      const a = 10;
      const divElement = document.querySelector('.test');
      divElement.innerHTML = a
    <script>
</body>
</html>`;
}

export default CatsProvider;