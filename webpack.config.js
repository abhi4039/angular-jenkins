const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const mf = require("@angular-architects/module-federation/webpack");
const path = require("path");
const share = mf.share;

const sharedMappings = new mf.SharedMappings();
sharedMappings.register(path.join(__dirname, "tsconfig.json"), [
  /* mapped paths to share */
]);

module.exports = {
  output: {
    uniqueName: "remoteApp1",
    publicPath: "auto"
  },
  optimization: {
    runtimeChunk: false,
  },
  resolve: {
    alias: {
      ...sharedMappings.getAliases(),
    },
  },
  experiments: {
    outputModule: true,
  },
  plugins: [
    new ModuleFederationPlugin({
      library: { type: "module" },

      // For remotes (please adjust)
      name: "remoteApp1",
      filename: "remoteEntry.js",
      exposes: {
        "./HomeModule": ".//src/app/home/home.module.ts",
        "./HomeComponent": ".//src/app/home/home.component.ts",
        './CounterModule': './src/app/home/store/counter.module.ts', 
      },

      // For hosts (please adjust)
      // remotes: {
      //     "mfe1": "http://localhost:3000/remoteEntry.js",

      // },

      shared: share({

        "@angular/core": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
          "@angular/common": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
          "@angular/common/http": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
          "@angular/router": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
          
          '@ngrx/store': { singleton: true, strictVersion: true, requiredVersion:'auto' },
          '@ngrx/effects': { singleton: true, strictVersion: true, requiredVersion:'auto' },
          '@ngrx/entity': { singleton: true, strictVersion: true, requiredVersion:'auto' },
          
        // "@angular/core": {
        //   singleton: true,
        //   // strictVersion: false,
        //   requiredVersion: false,
        // },
        // "@angular/common": {
        //   singleton: true,
        //   // strictVersion: false,
        //   requiredVersion: false,
        // },
        // "@angular/common/http": {
        //   singleton: true,
        //   // strictVersion: false,
        //   requiredVersion: false,
        // },
        // "@angular/router": {
        //   singleton: true,
        //   // strictVersion: false,
        //   requiredVersion: false,
        // },

        ...sharedMappings.getDescriptors(),
      }),
    }),
    sharedMappings.getPlugin(),
  ],
};
