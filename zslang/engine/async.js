// Async/background jobs for ZSL

const backgroundJobs = [];

function runInBackground(fn, ...args) {
  // Run a function or code block in the background (async)
  const job = {
    id: Date.now() + Math.random(),
    status: "running",
    result: null,
    error: null,
    promise: null
  };
  job.promise = (async () => {
    try {
      job.result = await fn(...args);
      job.status = "finished";
    } catch (e) {
      job.error = e;
      job.status = "error";
    }
  })();
  backgroundJobs.push(job);
  return job.id;
}

function listJobs() {
  return backgroundJobs.map(j => ({
    id: j.id,
    status: j.status,
    error: j.error
  }));
}

function getJob(id) {
  return backgroundJobs.find(j => j.id === id);
}

export { runInBackground, listJobs, getJob };
