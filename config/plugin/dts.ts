/**
 * Generation dts
 * 生成 TypeScript 类型
 */
import dts from "vite-plugin-dts";

export default function configDTSPlugin() {
  return [dts()];
}
