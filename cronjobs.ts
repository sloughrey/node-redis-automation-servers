interface job {
  name: string;
  callback: Function;
  retryCount: number;
  errors: string[];
}

interface jobs {
  [key: string]: job[];
}

const jobData: jobs = {
  sequentialJobs: [
    {
      name: "Import Users",
      callback: importUsers,
      retryCount: 0,
      errors: [],
    },
    {
      name: "Perform Heavy Calculation",
      callback: performHeavyCalculation,
      retryCount: 0,
      errors: [],
    },
    {
      name: "Send Reminder Emails",
      callback: sendReminderEmails,
      retryCount: 0,
      errors: [],
    },

  ],
  importUsers: [
    {
      name: "Import Users",
      callback: importUsers,
      retryCount: 0,
      errors: [],
    },
  ],
  sendReminderEmails: [
    {
      name: "Send Reminder Emails",
      callback: sendReminderEmails,
      retryCount: 0,
      errors: [],
    },
  ],
  performHeavyCalculation: [
    {
      name: "Perform Heavy Calculation",
      callback: performHeavyCalculation,
      retryCount: 0,
      errors: [],
    },
  ],
  ingestAppData: [
    {
      name: "Ingest Application Data",
      callback: ingestAppData,
      retryCount: 0,
      errors: [],
    },
  ],
  importUsers2: [
    {
      name: "Import Users 2",
      callback: importUsers,
      retryCount: 0,
      errors: [],
    },
  ],
  sendReminderEmails2: [
    {
      name: "Send Reminder Emails 2",
      callback: sendReminderEmails,
      retryCount: 0,
      errors: [],
    },
  ],
  performHeavyCalculation2: [
    {
      name: "Perform Heavy Calculation 2",
      callback: performHeavyCalculation,
      retryCount: 0,
      errors: [],
    },
  ],
  ingestAppData2: [
    {
      name: "Ingest Application Data 2",
      callback: ingestAppData,
      retryCount: 0,
      errors: [],
    },
  ],
};

async function importUsers() {
  console.log("running job to import users from external source (20s)");

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
