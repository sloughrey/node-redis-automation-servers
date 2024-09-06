import { CronJob } from "cron";
import JobFactory from "./cronjobs";
import { Redis } from "ioredis";

class BatchServer {
  private redis: Redis;

  private isProcessing: boolean = false;

  private numActiveJobs: number = 0;

  private maxConcurrentJobs: number = 3;

  constructor(redis: Redis) {
    this.redis = redis;
  }

  /**
   * Initialize the server event loop
   *
   * @returns {Promise<void>}
   */
  async init() {
    // queue up our jobs using cron jobs (e.g. hourly, daily, weekly)
    await this.queueJobs();

    // start listening for jobs to process every 5 seconds
    const jobProcessor = new CronJob("*/15 * * * * *", async () => {
      //await this.processJob();
      this.processJob();
    }).start();
  }
  /**
   * Queue the batch job groups we want to run
   * Batch job group names must match the names of the "jobs" array in cronjobs.ts
   * Set a key using distributed lock to ensure only 1 server pushes jobs onto the queue
   *
   * @returns {Promise<void>}
   */
  async queueJobs(): Promise<void> {
    new CronJob("*/1 * * * *", async () => {
      console.log("Pushing fresh batch of jobs onto the queue (every 1 mins)");
      const res = await this.redis.set("jobsQueued", 1, "EX", 300, "NX");
      console.log("jobsQueued in queueJobs is: ", res);
      if (res) {
        // @todo use a json stringified object of job metadata here (e.g. name, frequency, errors, retries)
        await this.redis.lpush(
          "jobs",
          "sequentialJobs",
          "importUsers",
          "sendReminderEmails",
          "performHeavyCalculation",
          "ingestAppData",
          "importUsers2",
          "sendReminderEmails2",
          "performHeavyCalculation2",
          "ingestAppData2",
          "importUsers3",
          "sendReminderEmails3",
          "performHeavyCalculation3",
          "ingestAppData3"
        );
        console.log("jobs pushed onto queue");
      }
    }).start();
  }

  /**
   * Processes a job based off the job name from the Redis queue
   * @returns {Promise<void>}
   */
  async processJob(): Promise<void> {
    if (this.canProcessJob()) {
      try {
        const jobData = await this.redis.blpop("jobs", 15);

        // element 0 is the queue name, 1 is the value we got from the queue (job group name)
        let jobGroupName = jobData ? jobData[1] : null;
        if (jobGroupName) {
          console.log("--------------------------------------------------");
          this.numActiveJobs++;
          this.isProcessing = true;
          console.log("starting to process job group: ", jobGroupName);

          const jobGroup = JobFactory.get(jobGroupName);

          for (const job of jobGroup) {
            console.log(`Processing job ${job.name}`);
            console.log(`parameters passed: `, job.callbackParams);
            await job.callback(...job.callbackParams);
            console.log(`Done proccessing job ${job.name}`);
          }

          if (this.numActiveJobs == 0) {
            this.isProcessing = false;
          }

          console.log("done processing job group: ", jobGroupName);
          console.log("--------------------------------------------------");
        }
      } catch (e) {
        // @todo if job failed, increase retry count, retain errors, push back onto the queue to try again
        console.log("Error while processing job group: ", e);
      }
    } else {
      console.log(`server is at max capacity running ${this.numActiveJobs} jobs`)
    }
  }

  /**
   * Determines if a new job can be started or not
   *
   * @returns {boolean}
   */
  canProcessJob(): boolean {
    return this.numActiveJobs < this.maxConcurrentJobs;
  }

  decrementActiveJobCount() {
    this.numActiveJobs--;
  }
}

const redis = new Redis();
const server = new BatchServer(redis);

export default BatchServer;
export { server };
