export function downLoadJsonFile<T extends object>(object: T, fileName: string) {
    const data = `text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(object))}`;
    const anchorElement = document.createElement('a');
    anchorElement.href = `data:${data}`;
    anchorElement.download = `${fileName}.json`;
    anchorElement.innerHTML = 'download JSON';
    anchorElement.click();
}