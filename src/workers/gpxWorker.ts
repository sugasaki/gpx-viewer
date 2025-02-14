// Worker 内では window が存在しないため、self を window にエイリアスする
if (typeof window === 'undefined') {
  (globalThis as any).window = self;
}

// ESモジュールとして扱うためのマーカー
export {};

// --- XMLSerializer ポリフィル ---
// xmlserializer をインポート（CommonJS 形式）
import xmlserializer from 'xmlserializer';

// Worker 環境で new XMLSerializer() が呼ばれたときのために、関数コンストラクタとして定義
function WorkerXMLSerializer() {}
WorkerXMLSerializer.prototype.serializeToString = function (node: any): string {
  return xmlserializer.serializeToString(node);
};

// 常に上書きする
(globalThis as any).XMLSerializer = WorkerXMLSerializer;
// --- ポリフィルここまで ---

import * as toGeoJSON from '@mapbox/togeojson';

self.onmessage = (event: MessageEvent<string>) => {
  const gpxContent = event.data;
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(gpxContent, 'application/xml');
    const geojson = toGeoJSON.gpx(xmlDoc);
    self.postMessage({ geojson });
  } catch (error: any) {
    self.postMessage({ error: error.message });
  }
};
