declare module '@mapbox/togeojson' {
    /**
     * GPX の XML ドキュメントを GeoJSON に変換します。
     * @param doc - GPX の XML Document
     * @returns GeoJSON オブジェクト
     */
    export function gpx(doc: Document): any;
  }

