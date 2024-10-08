import { Redis } from "ioredis";
import { CronJob } from "cron";
import JobFactory from "./cronjobs";

let IS_PROCESSING = false;
let redis: Redis | null = null;

async function init() {
  redis = new Redis();
  //await redis.connect();

  // queue up our jobs using cron jobs (e.g. hourly, daily, weekly)
  await queueJobs();

  // start listening for jobs to process
  const jobProcessor = new CronJob("*/15 * * * * *", async () => {
    await processJob();
  }).start();
}

/**
 * Queue the batch job groups we want to run
 * Batch job group names must match the names of the "jobs" array in cronjobs.ts
 * Set a key using distributed lock to ensure only 1 server pushes jobs onto the queue
 */
async function queueJobs() {
  new CronJob("*/5 * * * *", async () => {
    console.log("Pushing fresh batch of jobs onto the queue (every 5 mins)");
    const res = await redis?.set("jobsQueued", 1, "EX", 300, "NX");
    if (res) {
      // @todo use a json stringified object of job metadata here (e.g. name, frequency, errors, retries)
      redis?.lpush(
        "jobs",
        "sequentialJobs",
        "importUsers",
        "sendReminderEmails",
        "performHeavyCalculation",
        "ingestAppData",
        "importUsers2",
        "sendReminderEmails2",
        "performHeavyCalculation2",
        "ingestAppData2"
      );
    }
  }).start();
}

/**
 * Processes a job based off the job name from the Redis queue
 */
async function processJob() {
  try {
    if (!IS_PROCESSING) {
      // @todo need to start a redis transaction here
      const jobData = await redis?.brpop("jobs", 15);

      let jobGroupName = jobData ? jobData[1] : null;
      if (jobGroupName) {
        console.log("--------------------------------------------------");
        IS_PROCESSING = true;
        console.log("starting to process job group: ", jobGroupName);

        const jobGroup = JobFactory.get(jobGroupName);

        for (const job of jobGroup) {
          console.log(`Processing job ${job.name}`)
          console.log(`parameters passed: `, job.callbackParams)
          await job.callback(...job.callbackParams);
          console.log(`Done proccessing job ${job.name}`);
        }

        // @todo when job is done, commit the transaction

        IS_PROCESSING = false;

        console.log("done processing job group: ", jobGroupName);
        console.log("--------------------------------------------------");
      }
    } else {
      console.log("job group is still running");
    }
  } catch (e) {
    // @todo if job failed, increase retry count, retain errors, push back onto the queue to try again
    console.log("Error while processing job group: ", e);
  }
}

// start the demo
init();
