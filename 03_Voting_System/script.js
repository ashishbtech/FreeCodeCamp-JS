const poll = new Map();

const optionInput = document.getElementById('option-input');
const addOptionBtn = document.getElementById('add-option-btn');
const voteOptionInput = document.getElementById('vote-option-input');
const voterIdInput = document.getElementById('voter-id-input');
const voteBtn = document.getElementById('vote-btn');
const resultsContainer = document.getElementById('results-container');
const messageLog = document.getElementById('message-log');

function addOption(option) {
    if (!option) {
        return "Option cannot be empty.";
    }
    if (poll.has(option)) {
        return `Option "${option}" already exists.`;
    }
    poll.set(option, new Set());
    return `Option "${option}" added to the poll.`;
}

function vote(option, voterId) {
    if (!poll.has(option)) {
        return `Option "${option}" does not exist.`;
    }
    const voters = poll.get(option);
    if (voters.has(voterId)) {
        return `Voter ${voterId} has already voted for "${option}".`;
    }
    voters.add(voterId);
    return `Voter ${voterId} voted for "${option}".`;
}

function displayResults() {
    resultsContainer.innerHTML = '';
    for (let [option, voters] of poll.entries()) {
        const div = document.createElement('div');
        div.className = 'result-card';
        div.innerHTML = `
            <span>${option}</span> 
            <span class="vote-count">${voters.size} votes</span>
        `;
        resultsContainer.appendChild(div);
    }
}

function showMessage(msg) {
    messageLog.textContent = msg;
    setTimeout(() => {
        messageLog.textContent = '';
    }, 3500);
}

addOptionBtn.addEventListener('click', () => {
    const msg = addOption(optionInput.value.trim());
    showMessage(msg);
    optionInput.value = '';
    displayResults();
});

voteBtn.addEventListener('click', () => {
    const msg = vote(voteOptionInput.value.trim(), voterIdInput.value.trim());
    showMessage(msg);
    voteOptionInput.value = '';
    voterIdInput.value = '';
    displayResults();
});

addOption("Turkey");
addOption("Morocco");
addOption("Spain");
vote("Turkey", "traveler1");
vote("Turkey", "traveler2");
vote("Morocco", "traveler3");
displayResults();