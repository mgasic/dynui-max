// Centralized tsup defaults for DynUI-Max packages
export const tsupConfig = {
  splitting: false,
  sourcemap: true,
  clean: true,
  format: ["esm", "cjs"],
  dts: true,
};

// Example usage in a package tsup.config.ts:
// import { defineConfig } from 'tsup';
// import { tsupConfig } from '@dynui-max/build-config';
// export default defineConfig(tsupConfig);
