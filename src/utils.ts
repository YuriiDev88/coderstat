import ICoderStat from "./interfaces/ICoderStat";

export 	const getStatsString = (stats: ICoderStat): string => {
  return Object.entries(stats).map(([statName, stat]) => `${statName}: ${stat}`).join('\n');
};

export const getWebViewString = (stats: ICoderStat): string  => {
  return Object.entries(stats).map(([statName, stat]) => `<p>${statName}: ${stat}</p>`).join(' ');
}; 

export const getWebviewTemplate = (content: string) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cat Coding</title>
</head>
<body>
    ${content}
    <script>
      const data = document.querySelectorAll('p');
      console.log(data);
      data.forEach((element) => element.style.color = 'blue');
    </script>
</body>
</html>`;
};