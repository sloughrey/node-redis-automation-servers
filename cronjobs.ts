import { server } from "./batchServer";

interface job {
  name: string;
  callback: Function;
  callbackParams: any[],
  retryCount: number;
  errors: string[];
}

interface jobs {
  [key: string]: job[];
}

const jobData: jobs = {
  sequentialJobs: [
    {
      name: "Import Users 111",
      callback: importUsers,
      callbackParams: [[111]],
      retryCount: 0,
      errors: [],
    },
    {
      name: "Import Users 222",
      callback: importUsers,
      callbackParams: [[222]],
      retryCount: 0,
      errors: [],
    },
    {
      name: "Perform Heavy Calculation",
      callback: performHeavyCalculation,
      callbackParams: [],
      retryCount: 0,
      errors: [],
    },
    {
      name: "Send Reminder Emails",
      callback: sendReminderEmails,
      callbackParams: [],
      retryCount: 0,
      errors: [],
    },

  ],
  importUsers: [
    {
      name: "Import Users 333 444 555",
      callback: importUsers,
      callbackParams: [[333, 444, 555]],
      retryCount: 0,
      errors: [],
    },
  ],
  sendReminderEmails: [
    {
      name: "Send Reminder Emails",
      callback: sendReminderEmails,
      callbackParams: [],
      retryCount: 0,
      errors: [],
    },
  ],
  performHeavyCalculation: [
    {
      name: "Perform Heavy Calculation",
      callback: performHeavyCalculation,
      callbackParams: [],
      retryCount: 0,
      errors: [],
    },
  ],
  ingestAppData: [
    {
      name: "Ingest Application Data",
      callback: ingestAppData,
      callbackParams: [],
      retryCount: 0,
      errors: [],
    },
  ],
  importUsers2: [
    {
      name: "Import Users 666 777 888 9999",
      callback: importUsers,
      callbackParams: [[666, 777, 888, 999]],
      retryCount: 0,
      errors: [],
    },
  ],
  sendReminderEmails2: [
    {
      name: "Send Reminder Emails 2",
      callback: sendReminderEmails,
      callbackParams: [],
      retryCount: 0,
      errors: [],
    },
  ],
  performHeavyCalculation2: [
    {
      name: "Perform Heavy Calculation 2",
      callback: performHeavyCalculation,
      callbackParams: [],
      retryCount: 0,
      errors: [],
    },
  ],
  ingestAppData2: [
    {
      name: "Ingest Application Data 2",
      callback: ingestAppData,
      callbackParams: [],
      retryCount: 0,
      errors: [],
    },
  ],
  importUsers3: [
    {
      name: "Import Users 666 777 888 9999",
      callback: importUsers,
      callbackParams: [[666, 777, 888, 999]],
      retryCount: 0,
      errors: [],
    },
  ],
  sendReminderEmails3: [
    {
      name: "Send Reminder Emails 2",
      callback: sendReminderEmails,
      callbackParams: [],
      retryCount: 0,
      errors: [],
    },
  ],
  performHeavyCalculation3: [
    {
      name: "Perform Heavy Calculation 2",
      callback: performHeavyCalculation,
      callbackParams: [],
      retryCount: 0,
      errors: [],
    },
  ],
  ingestAppData3: [
    {
      name: "Ingest Application Data 2",
      callback: ingestAppData,
      callbackParams: [],
      retryCount: 0,
      errors: [],
    },
  ],
};

async function importUsers(empNumStartsWith: number[]) {
  console.log(`running job to import users starting with ${empNumStartsWith} from external source (60s)`);

  await wait(60000);
  console.log("importUsers job complete");
  server.decrementActiveJobCount();
}

async function sendReminderEmails() {
  console.log("running job to send reminder emails (60s)");

  await wait(60000);
  console.log("sendReminderEmails job complete");
  server.decrementActiveJobCount();
}

async function performHeavyCalculation() {
  console.log("running job to perform a heavy calculation (120s)");

  await wait(120000);

  console.log("performHeavyCalculation job complete");
  server.decrementActiveJobCount();
}

async function ingestAppData() {
  console.log("running job to ingest app data (60s)");

  await wait(60000);

  console.log("ingestAppData job complete");
  server.decrementActiveJobCount();
}

// simple awaitable setTimeout calls to simulate job running
const wait = (t: number) =>
  new Promise((resolve, reject) => setTimeout(resolve, t));

class JobFactory {
  static get(name: string): job[] {
    if (typeof jobData[name] == "undefined") {
      throw new Error("Invalid job group name supplied");
    }
    return jobData[name];
  }
}

export default JobFactory;
