/**
 * Used to package and output gzip. Note that this does not work properly in Vite, the specific reason is still being investigated
 * gzip压缩
 * https://github.com/anncwb/vite-plugin-compression
 */
import type { Plugin } from "vite";
import compressPlugin from "vite-plugin-compression";

export function configCompressPlugin(compress: "gzip" | "brotli", deleteOriginFile = false): Plugin {
  const defaultPlugin = compressPlugin({
    ext: ".gz",
    deleteOriginFile,
  });

  switch (compress) {
    case "gzip":
      return defaultPlugin;
    case "brotli":
      return compressPlugin({
        ext: ".br",
        algorithm: "brotliCompress",
        deleteOriginFile,
      });
    default:
      console.warn("warning unknown compress type");
  }

  return defaultPlugin;
}

export default configCompressPlugin;
