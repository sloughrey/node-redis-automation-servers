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
};

async function importUsers(empNumStartsWith: number[]) {
  console.log(`running job to import users starting with ${empNumStartsWith} from external source (20s)`);

  await wait(20000);
  console.log("importUsers job complete");
}

async function sendReminderEmails() {
  console.log("running job to send reminder emails (20s)");

  await wait(20000);
  console.log("sendReminderEmails job complete");
}

async function performHeavyCalculation() {
  console.log("running job to perform a heavy calculation (40s)");

  await wait(40000);

  console.log("performHeavyCalculation job complete");
}

async function ingestAppData() {
  console.log("running job to ingest app data (20s)");

  await wait(20000);

  console.log("ingestAppData job complete");
}

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
