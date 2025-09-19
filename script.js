// Function to generate a random password
function generatePassword(length, useUppercase, useNumbers, useSymbols) {
    let characters = 'abcdefghijklmnopqrstuvwxyz';
    if (useUppercase) characters += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (useNumbers) characters += '0123456789';
    if (useSymbols) characters += '!@#$%^&*()-_=+[]{}|;:,.<>?';

    let password = '';
    for (let i = 0; i < length; i++) {
        password += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return password;
}

// Function to calculate password entropy
function getPasswordEntropy(password) {
    let charSetSize = 0;
    if (/[a-z]/.test(password)) charSetSize += 26;
    if (/[A-Z]/.test(password)) charSetSize += 26;
    if (/[0-9]/.test(password)) charSetSize += 10;
    if (/[!@#$%^&*()-_=+[\]{}|;:,.<>?]/.test(password)) charSetSize += 32;

    if (charSetSize === 0 || password.length === 0) {
        return 0;
    }

    return password.length * (Math.log2(charSetSize));
}

// Function to estimate time to crack
function getTimeToCrack(entropyBits) {
    const guessesPerSecond = 10 ** 12; // 1 trillion guesses/second
    if (entropyBits === 0) {
        return "Instantly";
    }

    const totalCombinations = 2 ** entropyBits;
    let timeInSeconds = totalCombinations / guessesPerSecond;

    if (timeInSeconds < 60) return `${timeInSeconds.toFixed(2)} seconds`;
    if (timeInSeconds < 3600) return `${(timeInSeconds / 60).toFixed(2)} minutes`;
    if (timeInSeconds < 86400) return `${(timeInSeconds / 3600).toFixed(2)} hours`;
    if (timeInSeconds < 31536000) return `${(timeInSeconds / 86400).toFixed(2)} days`;
    return `${(timeInSeconds / 31536000).toFixed(2)} years`;
}

// Event listener for the "Generate" button
document.getElementById('generateBtn').addEventListener('click', () => {
    const length = document.getElementById('length').value;
    const useUppercase = document.getElementById('uppercase').checked;
    const useNumbers = document.getElementById('numbers').checked;
    const useSymbols = document.getElementById('symbols').checked;

    const password = generatePassword(length, useUppercase, useNumbers, useSymbols);
    document.getElementById('generatedPassword').textContent = password;
});

// Event listener for the password check input field
document.getElementById('passwordCheck').addEventListener('input', (e) => {
    const password = e.target.value;
    const entropy = getPasswordEntropy(password);
    const timeToCrack = getTimeToCrack(entropy);

    document.getElementById('entropyResult').textContent = `${entropy.toFixed(2)} bits`;
    document.getElementById('timeToCrackResult').textContent = timeToCrack;

    // Update the strength bar
    let percentage = Math.min(entropy / 100 * 100, 100);
    const strengthBar = document.getElementById('strengthBar');
    strengthBar.style.width = `${percentage}%`;

    // Change bar color based on strength
    if (entropy < 40) {
        strengthBar.style.backgroundColor = '#dc3545'; // Red
    } else if (entropy < 60) {
        strengthBar.style.backgroundColor = '#ffc107'; // Yellow
    } else {
        strengthBar.style.backgroundColor = '#28a745'; // Green
    }
});
