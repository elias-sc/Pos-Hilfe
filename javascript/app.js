function getCodeOutput(code){
    return fetch('https://pos-hilfe.onrender.com/execute-code', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: code }),
    })
    .then(response => response.json())
    .catch(error => {
        console.error('Error connecting with server:', error);
    });
}

async function executeCode(){
    const code = document.getElementById('code-input').value;
    const outputContainer = document.getElementById("output");
    outputContainer.innerHTML = "Running Code...";

    let data = await getCodeOutput(code);

    if(data.error == ''){
        outputContainer.innerHTML = data.output;
    } else{
        outputContainer.innerHTML = data.error;
    }
    
}

function getExercise(id) {
    return fetch('https://pos-hilfe.onrender.com/get-exercise', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id}),
    })
    .then(response => response.json())
    .catch(error => {
        console.error('Error:', error);
        throw error; // Propagate the error to the caller
    });
}

function getAmountOfExercises(){
    return fetch('https://pos-hilfe.onrender.com/get-exercise-amount', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .catch(error => {
        console.error('Error:', error);
        throw error; // Propagate the error to the caller
    });
}

const exerciseElement = document.createElement("a");
exerciseElement.appendChild(document.createElement("div"));
exerciseElement.children[0].className = "exercise";
exerciseElement.children[0].appendChild(document.createElement("p"));
exerciseElement.children[0].children[0].className = "exercise-title";
exerciseElement.children[0].appendChild(document.createElement("p"));
exerciseElement.children[0].children[1].className = "exercise-id";

async function fillExercises() {
    const container = document.getElementById("exercise-container");
    const exerciseAmount = await getAmountOfExercises();

    for(let i = container.childElementCount; i < exerciseAmount; i++){
        container.appendChild(exerciseElement.cloneNode(true));
    }


    for (let i = 0; i < container.childElementCount; i++) {
        try {
            let exercise = await getExercise(i + 1);
            exercise = exercise[0];
            let childLink = container.children[i];
            let childDiv = childLink.getElementsByTagName("div")[0];
            let titleContainer = childDiv.getElementsByClassName("exercise-title")[0];
            let idContainer = childDiv.getElementsByClassName("exercise-id")[0];

            if (exercise !== undefined) {
                titleContainer.innerHTML = exercise.title;
                idContainer.innerHTML = exercise.id;
                
                const isCurrentExerciseCompleted = await isExerciseCompleted(i + 1);
                if(isCurrentExerciseCompleted){
                    childDiv.className += " completed";
                }

                childLink.addEventListener('click', function () {
                    if(currentUser){
                        var exerciseId = childLink.getAttribute('id').split("-")[1];
                        window.location.href = 'übung.html?id=' + exerciseId;
                    } else {
                        showPopup(document.getElementById("signup-container"));
                    }

                });

            } else {
                titleContainer.innerHTML = "";
                childDiv.className += " unavailable";
            }
            childLink.id = "exercise-" + (i + 1);
        } catch (error) {
            console.error('Error:', error);
        }
    }
}

async function loadExercise() {
    const urlParams = new URLSearchParams(window.location.search);
    const exerciseId = urlParams.get('id');
    let exercise = await getExercise(exerciseId);
    exercise = exercise[0];

    const titleContainer = document.getElementById("exercise-title");
    const descriptionContainer = document.getElementById("exercise-description");
    const exampleContainer = document.getElementById("exercise-example");
    const intendedOutputContainer = document.getElementById("exercise-intended-output");
    const difficultyContainer = document.getElementById("exercise-difficulty");

    titleContainer.innerHTML = exercise.title;
    descriptionContainer.innerHTML = exercise.description;
    exampleContainer.innerHTML = exercise.example;
    intendedOutputContainer.innerHTML = exercise.intended_output;
    difficultyContainer.innerHTML = exercise.difficulty;
}

async function fillSolutions() {
    const container = document.getElementById("solution-container");
    const exerciseAmount = await getAmountOfExercises();

    for(let i = container.childElementCount; i < exerciseAmount; i++){
        container.appendChild(exerciseElement.cloneNode(true));
    }

    for (let i = 0; i < container.childElementCount; i++) {
        try {
            let exercise = await getExercise(i + 1);
            exercise = exercise[0];
            let childLink = container.children[i];
            let childDiv = childLink.getElementsByTagName("div")[0];
            let titleContainer = childDiv.getElementsByClassName("exercise-title")[0];
            let idContainer = childDiv.getElementsByClassName("exercise-id")[0];

            if (exercise !== undefined) {
                titleContainer.innerHTML = exercise.title;
                idContainer.innerHTML = exercise.id;

                childLink.addEventListener('click', function () {
                    if(currentUser){
                        var exerciseId = childLink.getAttribute('id').split("-")[1];
                        window.location.href = 'lösung.html?id=' + exerciseId;
                    } else {
                        showPopup(document.getElementById("signup-container"));
                    }

                });

            } else {
                titleContainer.innerHTML = "";
                childDiv.className += " unavailable";
            }
            childLink.id = "solution-" + (i + 1);
        } catch (error) {
            console.error('Error:', error);
        }
    }
}

async function loadSolution() {
    const urlParams = new URLSearchParams(window.location.search);
    const exerciseId = urlParams.get('id');
    let exercise = await getExercise(exerciseId);
    exercise = exercise[0];

    const titleContainer = document.getElementById("solution-title");
    const solutionContainer = document.getElementById("solution");

    titleContainer.innerHTML = exercise.title + " - Lösung";
    solutionContainer.innerHTML = exercise.solution;
}

function getTests(exercise_id) {
    return fetch('https://pos-hilfe.onrender.com/get-tests', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: exercise_id }),
    })
    .then(response => response.json())
    .catch(error => {
        console.error('Error:', error);
        throw error; 
    });
}

async function runTests(){
    const urlParams = new URLSearchParams(window.location.search);
    const exerciseId = urlParams.get('id');
    const tests = await getTests(exerciseId);
    const code = document.getElementById('code-input').value;

    const outputContainer = document.getElementById("output");
    outputContainer.innerHTML = "Running Test Cases...";

    let passed = true;

    for (let i = 0; i < tests.length; i++) {
        let test = tests[i];
        let finalCode = test.input + "\n\n" + code;
        let data = await getCodeOutput(finalCode);

        if(data.output == test.expected_output){
            outputContainer.innerHTML = (i+1) + " / " + tests.length + " Tests bestanden";
        } else{
            passed = false;
            outputContainer.innerHTML = "Test " + (i+1) + " failed\n\n";
            outputContainer.innerHTML += "Erwarteter Output:\n" + test.expected_output;
            outputContainer.innerHTML += "\nErhalten:\n" + data.output;
            break;
        }
        
    }

    if(passed){
        outputContainer.innerHTML = "Alle Tests bestanden!";
        fire();
        markExerciseCompleted(exerciseId);
    }
}

async function markExerciseCompleted(exerciseId) {
    if(!currentUser){
        return;
    }

    const isCurrentExerciseCompleted = await isExerciseCompleted(exerciseId);
    if(isCurrentExerciseCompleted){
        return;
    }

    fetch('https://pos-hilfe.onrender.com/store-completed-exercise', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "userId": currentUser.id, "exerciseId": exerciseId }),
    })
    .then(response => response.json())
    .catch(error => {
        console.error('Error:', error);
        throw error; 
    });
}

let completedExercises = [];

function getCompletedExercises(){
    if(!currentUser){
        return;
    }

    return fetch('https://pos-hilfe.onrender.com/get-completed-exercises', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "userId": currentUser.id}),
    })
    .then(response => response.json())
    .catch(error => {
        console.error('Error:', error);
        throw error; 
    });
}

async function isExerciseCompleted(exerciseId) {
    if(!currentUser){
        return false;
    }
    let exercises;

    if(completedExercises.length == 0){
        const result = await getCompletedExercises(exerciseId);
        completedExercises = result.exercises;
    }

    exercises = completedExercises;
       
    return exercises.includes(exerciseId);
}
