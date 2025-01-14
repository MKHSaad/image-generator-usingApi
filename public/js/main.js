// public/js/main.js
document.addEventListener('DOMContentLoaded', () => {
    const promptInput = document.getElementById('prompt');
    const generateBtn = document.getElementById('generateBtn');
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    const image = document.getElementById('generatedImage');

    const showError = (message) => {
        error.textContent = message;
        error.classList.remove('hidden');
    };

    const hideError = () => {
        error.textContent = '';
        error.classList.add('hidden');
    };

    generateBtn.addEventListener('click', async () => {
        const prompt = promptInput.value.trim();

        if (!prompt) {
            showError('Please enter a prompt');
            return;
        }

        try {
            // Reset UI state
            hideError();
            image.classList.add('hidden');
            loading.classList.remove('hidden');
            generateBtn.disabled = true;

            const response = await fetch('/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt })
            });

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            image.src = data.image;
            image.classList.remove('hidden');
        } catch (err) {
            showError(err.message);
            image.classList.add('hidden');
        } finally {
            loading.classList.add('hidden');
            generateBtn.disabled = false;
        }
    });
});