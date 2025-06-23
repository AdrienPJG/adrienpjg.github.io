    const ctx = document.getElementById('myChart').getContext('2d');
    //const influenceSlider = document.getElementById('influence');
    //const valueDisplay = document.getElementById('valueDisplay');

    const data = {
      labels: [],
      datasets: [{
        label: 'Prix de l\'option Call (€)',
        data: [],
        borderColor: 'blue',
        segment: {
          borderColor: ctx => {
            const {p0, p1} = ctx.segment;
            if (!p0 || !p1) return 'gray';
            const delta = p1.parsed.y - p0.parsed.y;
            const intensity = Math.min(Math.abs(delta) / 5, 1); // 0 à 1

            if (delta > 0) {
             
              return `rgba(0, 0, 255, ${0.2 + 0.8 * intensity})`;
            } else if (delta < 0) {
              
              return `rgba(255, 0, 0, ${0.2 + 0.8 * intensity})`;
            } else {
              return 'gray';
            }
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
        scales: {
          x: {
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
            beginAtZero: true
          }
        }
      }
    };

    const callChart = new Chart(ctx, config);

    let time = 0;

    function addNewDataPoint() {
      const lastValue = data.datasets[0].data.slice(-1)[0] || 10;
      const variation = (Math.random() - 0.5) * 5; // +/- 2.5 environ
      const newValue = parseFloat((lastValue + variation).toFixed(2));

      data.labels.push(`${time}s`);
      data.datasets[0].data.push(newValue);
      time += 5;

      if (data.labels.length > 10) {
        data.labels.shift();
        data.datasets[0].data.shift();
      }

      callChart.update();
    }

    setInterval(addNewDataPoint, 1000);