document.addEventListener('DOMContentLoaded', () => {
    const pages = document.querySelectorAll('.page');
    const nextButtons = document.querySelectorAll('#nextButton, #nextButton2');
    const prevButtons = document.querySelectorAll('#prevButton, #prevButton2');
    const ttsButton = document.getElementById('ttsButton');
    const voiceList = document.getElementById('voiceList');
    const ttsSections = document.querySelectorAll('[data-tts]');

    let synth = speechSynthesis;

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

function textToSpeech(element, voiceName) {
    let textToRead = '';

    function extractVisibleText(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            textToRead += node.textContent;
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            const computedStyle = window.getComputedStyle(node);

            if (computedStyle.display !== 'none' && computedStyle.visibility !== 'hidden') {
                for (let child of node.childNodes) {
                    extractVisibleText(child);
                }
            }
        }
    }

    extractVisibleText(element);

    let utterance = new SpeechSynthesisUtterance(textToRead.trim());
    for (let voice of synth.getVoices()) {
        if (voice.name === voiceName) {
            utterance.voice = voice;
        }
    }
    synth.speak(utterance);
}

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

    let currentPageIndex = 0;
    showPage(currentPageIndex);
});
