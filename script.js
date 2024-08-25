        const speedElement = document.getElementById('speed');
        const altitudeElement = document.getElementById('altitude');
        const environmentSelect = document.getElementById('environment');
        const groundAnalysis = document.getElementById('ground-analysis');
        const airAnalysis = document.getElementById('air-analysis');
        const waterAnalysis = document.getElementById('water-analysis');

        let speed = 0;
        let altitude = 0;

        // Function to update speed and altitude
        function updateSpeedAndAltitude() {
            speed += Math.random() * 0.5; // Simulate speed change
            altitude += Math.random() * 0.2; // Simulate altitude change

            speedElement.innerText = speed.toFixed(2);
            altitudeElement.innerText = altitude.toFixed(2);
        }

        // Function to handle environment change
        function handleEnvironmentChange() {
            const environment = environmentSelect.value;

            groundAnalysis.style.display = 'none';
            airAnalysis.style.display = 'none';
            waterAnalysis.style.display = 'none';

            if (environment === 'ground') {
                groundAnalysis.style.display = 'block';
            } else if (environment === 'air') {
                airAnalysis.style.display = 'block';
            } else if (environment === 'water') {
                waterAnalysis.style.display = 'block';
            }
        }

        // Function to handle gyroscope data
        function handleGyroscope(event) {
            const gamma = event.gamma; // Left to right tilt
            const beta = event.beta;   // Front to back tilt

            const cgPositionX = 50 + (gamma / 90) * 50; // Normalized CG position X (0% to 100%)
            const cgPositionY = 50 + (beta / 90) * 50;  // Normalized CG position Y (0% to 100%)

            const cgVisualization = document.getElementById('cg-visualization');
            let cgPoint = cgVisualization.querySelector('.cg-point');

            cgPoint.style.left = `${cgPositionX}%`;
            cgPoint.style.top = `${cgPositionY}%`;

            document.getElementById('cg-position').innerText = `CG Position: X = ${cgPositionX.toFixed(2)}%, Y = ${cgPositionY.toFixed(2)}%`;
        }

        // Event listeners
        environmentSelect.addEventListener('change', handleEnvironmentChange);
        window.addEventListener('devicemotion', (event) => {
            if (environmentSelect.value === 'water') {
                handleGyroscope(event);
            }
        });

        // Update speed and altitude every 0.1 seconds
        setInterval(updateSpeedAndAltitude, 100);

        // Initial environment setup
        handleEnvironmentChange();
