import { ZBClient } from "zeebe-node";
import * as path from "path";

export class Generator {
  output?: NodeJS.Timeout;
  running: boolean;
  zbc: ZBClient;
  partitionCount: number;
  runningAverage?: string;
  started: number = 0;
  constructor(partitionCount: number) {
    this.running = false;
    this.zbc = new ZBClient({
      loglevel: "DEBUG",
      maxRetries: 1,
    });
    this.partitionCount = partitionCount;
  }

  async start() {
    this.running = true;

    await new Promise((res) => setTimeout(() => res(null), 2000));

    console.log("Deploying workflow...");
    const wf = await this.zbc.deployWorkflow(
      path.join(".", "bpmn", "noop1.bpmn")
    );

    console.log("Workflow deployed: " + wf.key);
    this.started = 0;
    let time = 0;
    let last = 0;
    console.log(`Time : \t Total \t | wf/s\t | running average`);

    this.output = setInterval(() => {
      time += 5;
      console.log(
        `${time}s : \t ${this.started} \t | ${Math.round(
          (this.started - last) / 5
        )} \t | ${Math.round(this.started / time)}/sec`
      );
      last = this.started;
      this.runningAverage = `${Math.round(this.started / time)}/sec`;
    }, 5000);

    new Promise(async (res) => {
      do {
        await this.zbc
          .createWorkflowInstance("noop1", {})
          .then(() => this.started++)
          .catch(() => console.log("Error 13"));
      } while (this.running == true);
      res(null);
    });
    return true;
  }

  async stop() {
    this.running = false;
    clearInterval(this.output!);
    await this.zbc.close();
    return this.started;
  }
}
