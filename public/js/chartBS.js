window.onload = function () {
    const ctx = document.getElementById('callChart').getContext('2d');
    const callPriceDisplay = document.getElementById('callPrice');

    const data = {
        datasets: [
        {
            label: 'Prix du sous-jacent (€)',
            data: [],
            borderColor: 'blue',
            segment: {
            borderColor: ctx => {
                const segment = ctx.segment;
                if (!segment || !segment.p0 || !segment.p1) {
                return 'gray';
                }

                const delta = segment.p1.parsed.y - segment.p0.parsed.y;
                const intensity = Math.min(Math.abs(delta) / 5, 1);
                return delta > 0
                ? `rgba(0, 0, 255, ${0.2 + 0.8 * intensity})`
                : `rgba(255, 0, 0, ${0.2 + 0.8 * intensity})`;
            }
            },
            fill: false,
            tension: 0.3
        }
        ]
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
                text: 'Temps (mois)'
            }
            },
            y: {
            title: {
                display: true,
                text: 'Prix du sous-jacent (€)'
            },
            beginAtZero: false
            }
        }
        }
    };

    const chart = new Chart(ctx, config);

    // === Parameters ===
    let S = 100;             
    const K = 100;           
    const r = 0.01;          
    const sigma = 0.2;       
    const deltaT = 1 / 12;    // 1 month
    let time = 0;

    function simulateNextPrice(S_prev) {
        const Z = randn_bm();
        const drift = (r - 0.5 * sigma * sigma) * deltaT;
        const diffusion = sigma * Math.sqrt(deltaT) * Z;
        return S_prev * Math.exp(drift + diffusion);
    }

    function randn_bm() {
        let u = 0, v = 0;
        while(u === 0) u = Math.random();
        while(v === 0) v = Math.random();
        return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    }

    function normCDF(x) {
        return 0.5 * (1 + erf(x / Math.sqrt(2)));
    }

    function erf(x) {
        const sign = (x >= 0) ? 1 : -1;
        x = Math.abs(x);
        const a1 =  0.254829592, a2 = -0.284496736, a3 = 1.421413741,
            a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
        const t = 1 / (1 + p * x);
        const y = 1 - (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x));
        return sign * y;
    }

    function callPriceBlackScholes(S, K, r, sigma, T) {
        const d1 = (Math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T));
        const d2 = d1 - sigma * Math.sqrt(T);
        return S * normCDF(d1) - K * Math.exp(-r * T) * normCDF(d2);
    }

    function addNewDataPoint() {
        S = simulateNextPrice(S);
        const T = Math.max(1 - time / 12, 0.01); // T in years until strike (12 months max)

        const call = callPriceBlackScholes(S, K, r, sigma, T);
        callPriceDisplay.textContent = call.toFixed(2);

        data.datasets[0].data.push({ x: time, y: S });
        time += 1;

        if (data.datasets[0].data.length > 10) {
        data.datasets[0].data.shift();
        }

        chart.update();
    }

    setInterval(addNewDataPoint, 1000);
};