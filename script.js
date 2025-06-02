
const API_BASE = 'https://leetcode-stats-api.herokuapp.com/';
let difficultyChart = null;
let solvedChart = null;

const elements = {
    username: document.getElementById('username'),
    searchBtn: document.getElementById('searchBtn'),
    errorMsg: document.getElementById('errorMsg'),
    stats: {
        totalSolved: document.getElementById('totalSolved'),
        acceptanceRate: document.getElementById('acceptanceRate'),
        contributionPoints: document.getElementById('contributionPoints'),
        ranking: document.getElementById('ranking')
    }
};

function showError(message) {
    elements.errorMsg.style.display = 'block';
    elements.errorMsg.textContent = message;
}

function clearCharts() {
    if (difficultyChart) difficultyChart.destroy();
    if (solvedChart) solvedChart.destroy();
}

function createCharts(data) {
    // Difficulty Distribution Chart
    const difficultyCtx = document.getElementById('difficultyChart').getContext('2d');
    difficultyChart = new Chart(difficultyCtx, {
        type: 'doughnut',
        data: {
            labels: ['Easy', 'Medium', 'Hard'],
            datasets: [{
                data: [data.easySolved, data.mediumSolved, data.hardSolved],
                backgroundColor: [
                    'rgba(76, 175, 80, 0.8)',
                    'rgba(255, 193, 7, 0.8)',
                    'rgba(244, 67, 54, 0.8)'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom' },
                title: {
                    display: true,
                    text: 'Difficulty Distribution',
                    color: '#fff'
                }
            }
        }
    });

    // Solved vs Total Chart
    const solvedCtx = document.getElementById('solvedChart').getContext('2d');
    solvedChart = new Chart(solvedCtx, {
        type: 'bar',
        data: {
            labels: ['Easy', 'Medium', 'Hard'],
            datasets: [
                {
                    label: 'Solved',
                    data: [data.easySolved, data.mediumSolved, data.hardSolved],
                    backgroundColor: 'rgba(0, 188, 212, 0.8)'
                },
                {
                    label: 'Total',
                    data: [data.totalEasy, data.totalMedium, data.totalHard],
                    backgroundColor: 'rgba(255, 255, 255, 0.2)'
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true },
                x: { stacked: true }
            },
            plugins: {
                legend: { position: 'bottom' },
                title: {
                    display: true,
                    text: 'Solved vs Total Problems',
                    color: '#fff'
                }
            }
        }
    });
}

async function fetchUserData(username) {
    try {
        elements.searchBtn.disabled = true;
        elements.searchBtn.textContent = 'Loading...';
        elements.errorMsg.style.display = 'none';

        const response = await fetch(`${API_BASE}${username}`);
        const data = await response.json();
      
        // console.log('response',response);
        
        // console.log('data',data);
        
        if (data.status === 'error') {
            showError(data.message || 'User not found');
            clearCharts();
            return;
        }

        // Update stats
        elements.stats.totalSolved.textContent = data.totalSolved;
        elements.stats.acceptanceRate.textContent = `${data.acceptanceRate}%`;
        elements.stats.contributionPoints.textContent = data.contributionPoints;
        elements.stats.ranking.textContent = `#${data.ranking}`;

        // Create charts
        clearCharts();
        createCharts(data);

    } catch (error) {
        showError('Failed to fetch data. Please try again.');
        console.error('Error:', error);
    } finally {
        elements.searchBtn.disabled = false;
        elements.searchBtn.textContent = 'Analyze';
    }
}

// Event Listeners
elements.searchBtn.addEventListener('click', () => {
    const username = elements.username.value.trim();
    if (username) fetchUserData(username);
});

elements.username.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') elements.searchBtn.click();
});
