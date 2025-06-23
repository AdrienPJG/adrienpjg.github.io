const ctx = document.getElementById('callChart').getContext('2d');

const data = {
    datasets: [{
    label: 'Prix du sous-jacent (€)',
    data: [],
    borderColor: 'blue',
    segment: {
        borderColor: ctx => {
        const { p0, p1 } = ctx.segment;
        if (!p0 || !p1) return 'gray';
        const delta = p1.parsed.y - p0.parsed.y;
        const intensity = Math.min(Math.abs(delta) / 5, 1);
        return delta > 0
            ? `rgba(0, 0, 255, ${0.2 + 0.8 * intensity})`
            : `rgba(255, 0, 0, ${0.2 + 0.8 * intensity})`;
        }
    },
    fill: false,
    tension: 0.3
    }]
};

const config = {
    type: 'line',
    data: data,
    options: {
    responsive: true,
    animation: false,
    parsing: false,
    scales: {
        x: {
        type: 'linear',
        title: {
            display: true,
            text: 'Temps (s)'
        }
        },
        y: {
        title: {
            display: true,
            text: 'Prix (€)'
        },
        beginAtZero: false
        }
    }
    }
};

const callChart = new Chart(ctx, config);

// === Paramètres Black-Scholes ===
let S = 100;              // Prix initial
const mu = 0.05;          // Rendement espéré (5%/an)
const sigma = 0.2;        // Volatilité (20%/an)
const deltaT = 5 / (365 * 24 * 60 * 60); // 5 secondes en années
let time = 0;

function simulateNextPrice(S_prev) {
    const Z = randn_bm(); // tirage normal standard
    const drift = (mu - 0.5 * sigma * sigma) * deltaT;
    const diffusion = sigma * Math.sqrt(deltaT) * Z;
    return S_prev * Math.exp(drift + diffusion);
}

// Générateur normal standard (Box-Muller)
function randn_bm() {
    let u = 0, v = 0;
    while(u === 0) u = Math.random(); // évite log(0)
    while(v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function addNewDataPoint() {
    S = simulateNextPrice(S);
    data.datasets[0].data.push({ x: time, y: S });
    time += 5;

    if (data.datasets[0].data.length > 10) {
    data.datasets[0].data.shift();
    }

    callChart.update();
}

setInterval(addNewDataPoint, 5000);
