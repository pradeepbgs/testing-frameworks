import cluster from "cluster";
import { cpus } from "os";
import app from "./app.js";

const PORT = 3000;

if (cluster.isMaster) {
  const numCPUs = cpus().length;
  console.log(`Master ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
  });
} else {
  app.listen(PORT, () => {
    console.log(`Worker ${process.pid} is listening on port ${PORT}`);
  });
}
