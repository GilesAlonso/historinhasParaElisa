const pages = document.querySelectorAll('.page');
const nextButtons = document.querySelectorAll('#nextButton, #nextButton2');
const prevButtons = document.querySelectorAll('#prevButton, #prevButton2');
const ttsButton = document.getElementById('ttsButton');

let currentPageIndex = 0;

function showPage(index) {
    pages[currentPageIndex].classList.remove('visible');
    currentPageIndex = index;
    pages[currentPageIndex].classList.add('visible');
}

nextButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
        if (currentPageIndex < pages.length - 1) {
            showPage(currentPageIndex + 1);
        }
    });
});

prevButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
        if (currentPageIndex > 0) {
            showPage(currentPageIndex - 1);
        }
    });
});


// ... (código anterior)

const voiceList = document.getElementById('voiceList');
const ttsButton = document.getElementById('ttsButton');
const ttsSections = document.querySelectorAll('[data-tts]');

function populateVoiceList() {
    const voices = synth.getVoices();

    for (let voice of voices) {
        let option = document.createElement('option');
        option.textContent = `${voice.name} (${voice.lang})`;
        option.value = voice.name;
        voiceList.appendChild(option);
    }
}

populateVoiceList();

ttsButton.addEventListener('click', () => {
    if (!synth.speaking) {
        const selectedVoice = voiceList.value;
        for (let section of ttsSections) {
            const textToRead = section.textContent;
            if (textToRead.trim() !== '') {
                textToSpeech(textToRead, selectedVoice);
            }
        }
    }
});

// ...





showPage(currentPageIndex);

