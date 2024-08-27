interface jobDict {
  [key: string]: Function;
}

const jobs: jobDict = {
  importUsers: importUsers,
  sendReminderEmails: sendReminderEmails,
  performHeavyCalculation: performHeavyCalculation,
  ingestAppData: ingestAppData,
  importUsers2: importUsers,
  sendReminderEmails2: sendReminderEmails,
  performHeavyCalculation2: performHeavyCalculation,
  ingestAppData2: ingestAppData,
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
  console.log("running job to perform a heavy calculation (60s)");

  await wait(60000);

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
  static get(name: string) {
    if (typeof jobs[name] == "undefined") {
      throw new Error("Invalid job name supplied");
    }
    return jobs[name];
  }
}

export default JobFactory;
