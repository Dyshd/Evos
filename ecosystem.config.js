module.exports = {
  apps: [
    {
      name: "EVOS-REACT",
      script: "node_modules/serve/build/main.js",
      args: "-s build -l 3000 --single",
      cwd: "/home/evos-project/Evos",
      interpreter: "node",
    },
  ],
};
