//selectors
let taskList = document.querySelector('.task-challenge')
let versus = document.querySelector('.taskVschallenge')

//functions
// main function that will run all other functions on page
async function mainFunction(){ 
  let logs = await fetchData();
  let tracker = getTotal(logs);
  analyzeData(tracker);
  taskVsChallenges(logs);

}

// makes the fetch call to the API, convets the data to JSON and return an array of objects containing the task and the time spent
async function fetchData(){ 
  try{
    let results = await fetch(`https://www.workramp.com/engineering/interviews/time-tracking-api.php`);
    let data = await results.json();
    return data.logs;
  }catch(error){
    console.log('error',error);
  }
}

//itterates through the data and creates an object where each task/ challenge is the keys and the value is an array with each element being a time spent for that task/challenge
function getTotal(logs){
  const tracker = {};
  logs.forEach((task) => {
    if(!tracker[task.content_url]){
      tracker[task.content_url] = [task.time_spent];
    } else {
      tracker[task.content_url].push(task.time_spent);
    };
  })
  return tracker;
}

//takes in the object from the getTotal function and iterates through the keys of our object and analyzes the data
// so that we can find the medians, sums and averages for each task/challenge
function analyzeData(tracker){
  Object.keys(tracker).forEach((task) => { // iterate through the keys of the object
    let times = tracker[task];
    let sortedTimes = times.sort((a,b) => a - b); 
    let median = Math.floor(sortedTimes.length / 2 ); 
    let sum = sortedTimes.reduce((a,b) => a + b, 0);

    let taskData = `Task/ Challenge Name: ${task} - Median: ${sortedTimes[median]} - Total: ${sum} - Average: ${Math.round(sum / sortedTimes.length)}`;
    const taskListItem = document.createElement('li');
    taskListItem.innerText = taskData;
    taskList.appendChild(taskListItem);
  })
}

//function that finds the total spent for each task and challenge
//itterate through each task/challenge and divide into a new object based on if the task/challenge contains either 'task' or 'challenge' in content_url key
function taskVsChallenges(logs){
  const tracker = {};
  logs.forEach((log) => {
    if (log.content_url.includes('challenge') && tracker['challenge']){
      tracker['challenge'] += log.time_spent;
    } else if (log.content_url.includes('challenge') && !tracker['challenge']){
      tracker['challenge'] = log.time_spent;
    } else if (log.content_url.includes('task') && tracker['task']){
      tracker['task'] += log.time_spent;
    } else {
      tracker['task'] = log.time_spent;
    }
  })

  let results =  `Challenge Total = ${tracker['challenge']} | Task Total = ${tracker['task']}`;
  const taskVsChallenge = document.createElement('p');
  taskVsChallenge.innerText = results;
  versus.appendChild(taskVsChallenge);
}

mainFunction();