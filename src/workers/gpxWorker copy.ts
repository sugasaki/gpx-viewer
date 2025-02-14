// Worker内ではwindowは存在しないため、selfをwindowとしてエイリアスする
if (typeof window === 'undefined') {
  (globalThis as any).window = self;
}

// ファイルをESモジュールとして扱うためのマーカー
export {};

// --- ポリフィル部分 ---
import xmlserializer from 'xmlserializer';

// ネイティブのXMLSerializerが存在しない場合、xmlserializerを使ったラッパーを用意する
if (typeof globalThis.XMLSerializer === 'undefined') {
  class WorkerXMLSerializer {
    serializeToString(node: any): string {
      return xmlserializer.serializeToString(node);
    }
  }
  (globalThis as any).XMLSerializer = WorkerXMLSerializer;
}
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
