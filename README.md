[![Community Extension](https://img.shields.io/badge/Community%20Extension-An%20open%20source%20community%20maintained%20project-FF4700)](https://github.com/camunda-community-hub/community)
[![Lifecycle: Stable](https://img.shields.io/badge/Lifecycle-Stable-brightgreen)](https://github.com/Camunda-Community-Hub/community/blob/main/extension-lifecycle.md#stable-)

# Zeebe TPS Test

Uses the Zeebe Node client to do a TPS test. See [this post in the Zeebe forum](https://forum.zeebe.io/t/whats-the-broker-ratelimit-strategy/1370/2) for an example of the output.

This is only useful to test the relative performance of releases - that is: you run this test on the same hardware with different releases to see how they differ.

This starts workflows as fast as possible. The BPMN model has a single service task.

The workflows are started by a single thread that sends a `CreateWorkflowInstance` command, and waits for the response from the Broker before sending another command. When testing with two requests in parallel, the performance dropped significantly.

By default, the test does not service the task or complete the workflow.

To run the test with backpressure disabled in the broker, use the `-d` switch.

## Example Output

```
Version: 0.22.5 | Time: 30s
Starting Zeebe 0.22.5 with 2 partitions | Backpressure disabled...
Started Zeebe broker
Time :   Total   | wf/s  | running average
5s :     288     | 58    | 58/sec
10s :    640     | 70    | 64/sec
15s :    1007    | 73    | 67/sec
20s :    1385    | 76    | 69/sec
25s :    1731    | 69    | 69/sec
Average TPS: 69/sec.

Version: 0.23.5 | Time: 30s
Starting Zeebe 0.23.5 with 2 partitions | Backpressure disabled...
Started Zeebe broker
Time :   Total   | wf/s  | running average
5s :     76      | 15    | 15/sec
10s :    146     | 14    | 15/sec
15s :    216     | 14    | 14/sec
20s :    289     | 15    | 14/sec
25s :    359     | 14    | 14/sec
Average TPS: 14/sec.

Version: 0.24.1 | Time: 30s
Starting Zeebe 0.24.1 with 2 partitions | Backpressure disabled...
Started Zeebe broker
Time :   Total   | wf/s  | running average
5s :     55      | 11    | 11/sec
10s :    144     | 18    | 14/sec
15s :    255     | 22    | 17/sec
20s :    381     | 25    | 19/sec
25s :    530     | 30    | 21/sec
Average TPS: 21/sec.

Version: 0.25.0-alpha2 | Time: 30s
Starting Zeebe 0.25.0-alpha2 with 2 partitions | Backpressure disabled...
Started Zeebe broker
Time :   Total   | wf/s  | running average
5s :     145     | 29    | 29/sec
10s :    311     | 33    | 31/sec
15s :    484     | 35    | 32/sec
20s :    658     | 35    | 33/sec
25s :    837     | 36    | 33/sec
Average TPS: 33/sec.
```

## Prerequisites

* Docker
* Node.js
* NPM 

## Install Dependencies

```bash
npm i -g ts-node typescript
npm i
```

## Run

For example, to test the 0.22, 0.23, 0.24, and 0.25 alpha brokers with a 45 second test run with one partition: 

```bash
ts-node test.ts -z 0.22.5,0.23.5,0.24.1,0.25.0-alpha2 -t 45
```

To do the same test with backpressure disabled: 

```bash
ts-node test.ts -z 0.22.5,0.23.5,0.24.1,0.25.0-alpha2 -t 45 -d
```

To do the same test with 2 partitions: 

```bash 
ts-node test.ts -z 0.22.5,0.23.5,0.24.1,0.25.0-alpha2 -t 45 -p 2 -d
```

To do a test with a worker completing jobs in another thread:

```bash
ts-node test.ts -z 0.22.5,0.23.5,0.24.1,0.25.0-alpha2 -t 45 -p 2 -d -w
```

To specify four CPU and threads IO Threads for the Zeebe broker (default is 2 for each):

```bash
ts-node test.ts -z 0.22.5,0.23.5,0.24.1,0.25.0-alpha2 -t 45 -p 2 -d -w -c 4 -i 3
```

## Notes

I recommend that you run the tests for some time, as the broker performance can change over time.

Obviously, the resources available to Docker, and the hardware that you are running on will impact the performance.

## TODO

* Enable testing different backpressure algorithms and configurations.
    - Test spec file to configure test parameters, incl. backpressure
* Enable csv output for import to spreadsheets.
* Measure end-to-end latency for a workflow.
* Make it easy to BYO workflow and worker code.
* Enable payload size in KB for workload start.
* Enable running on Kubernetes.

