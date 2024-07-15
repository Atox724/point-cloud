import { readFileSync } from "fs";
import { isArray, mergeWith } from "lodash-es";
import * as path from "path";
import {
  defineConfig as ViteDefineConfig,
  UserConfig,
  UserConfigFnObject
} from "vite";

// 辅助函数：读取并解析 package.json 文件
const readPackageJson = (filePath: string) => {
  return JSON.parse(readFileSync(path.resolve(filePath), "utf-8"));
};

// 获取 dependencies 和 peerDependencies
const getDependencies = (pkgJson: Record<string, string>) => [
  ...Object.keys(pkgJson.dependencies || {}),
  ...Object.keys(pkgJson.peerDependencies || {})
];

const rootPkg = readPackageJson(path.resolve(__dirname, "..", "package.json"));
const pkg = readPackageJson(path.resolve(process.cwd(), "package.json"));
const externalDependencies = [
  ...getDependencies(rootPkg),
  ...getDependencies(pkg)
];
export const defineConfig = (config?: UserConfig | UserConfigFnObject) => {
  const baseConfig: UserConfig = {
    build: {
      lib: {
        entry: "./src/index.ts"
      },
      rollupOptions: {
        external: externalDependencies,
        output: [
          {
            dir: "dist/es",
            entryFileNames: "[name].js",
            chunkFileNames({ name }) {
              const normalizedPath = path.normalize(name);

              // 去除文件扩展名
              const baseName = path.basename(
                normalizedPath,
                path.extname(normalizedPath)
              );
              const dirName = path.dirname(normalizedPath);
              const chunkPath = path.join(dirName, baseName);

              return `${chunkPath}.js`;
            },
            manualChunks(id: string) {
              const url = path.normalize(id);
              const searchString1 = `node_modules${path.sep}`;
              const nodeModulesIndex = url.lastIndexOf(searchString1);

              if (nodeModulesIndex !== -1) {
                const relativePath = url.slice(
                  nodeModulesIndex + searchString1.length
                );
                const dirs = relativePath.split(path.sep);
                return `vendor${path.sep}${path.join(...dirs)}`;
              }

              const searchString2 = `src${path.sep}`;
              const srcIndex = url.indexOf(searchString2);
              if (srcIndex !== -1) {
                const relativePath = url.slice(srcIndex + searchString2.length); // 获取 src 后面的路径
                const dirs = relativePath.split(path.sep);
                return path.join(...dirs);
              }
            }
          },
          {
            format: "umd",
            name: "Global",
            dir: "dist/umd",
            entryFileNames: "[name].js",
            globals: (name) => {
              // 根据模块名称转换为大写形式
              const parts = name.split("/");
              const moduleName = parts[parts.length - 1]; // 获取模块名部分
              return moduleName.charAt(0).toUpperCase() + moduleName.slice(1);
            }
          }
        ]
      }
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src")
      }
    }
  };
  function customizer(objValue: unknown, srcValue: unknown) {
    if (isArray(objValue)) {
      return objValue.concat(srcValue);
    }
  }

  if (config instanceof Function) {
    return ViteDefineConfig((env) => {
      return mergeWith({}, baseConfig, config(env), customizer);
    });
  }
  const merged = mergeWith({}, baseConfig, config, customizer);
  return ViteDefineConfig(merged);
};
