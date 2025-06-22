    const ctx = document.getElementById('myChart').getContext('2d');
    const influenceSlider = document.getElementById('influence');
    const valueDisplay = document.getElementById('valueDisplay');

    function generateData(factor) {
      return Array.from({ length: 10 }, () => Math.floor(Math.random() * 10 * factor));
    }

    let currentFactor = influenceSlider.value;

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: Array.from({ length: 10 }, (_, i) => `T${i + 1}`),
        datasets: [{
          label: 'Dynamic data',
          data: generateData(currentFactor),
          borderColor: 'blue',
          borderWidth: 2,
          fill: true
        }]
      },
      options: {
        responsive: true,
        animation: true
      }
    });

    setInterval(() => {
      chart.data.datasets[0].data = generateData(currentFactor);
      chart.update();
    }, 10000);

    influenceSlider.addEventListener('input', () => {
      currentFactor = influenceSlider.value;
      valueDisplay.textContent = currentFactor;
    });