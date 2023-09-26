document.addEventListener('DOMContentLoaded', () => {
    const pages = document.querySelectorAll('.page');
    const nextButtons = document.querySelectorAll('#nextButton, #nextButton2');
    const prevButtons = document.querySelectorAll('#prevButton, #prevButton2');
    const ttsButton = document.getElementById('ttsButton');
    const voiceList = document.getElementById('voiceList');
    const synth = window.speechSynthesis;

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

    function textToSpeech(voiceName) {
        if (!synth.speaking) {
            const selectedVoice = voiceList.value;
            const currentSection = pages[currentPageIndex];
            const textToRead = getVisibleText(currentSection);
            
            let utterance = new SpeechSynthesisUtterance(textToRead.trim());
            for (let voice of synth.getVoices()) {
                if (voice.name === voiceName) {
                    utterance.voice = voice;
                }
            }
            synth.speak(utterance);
        }
    }

    ttsButton.addEventListener('click', () => {
        textToSpeech(voiceList.value);
    });

    let synthVoices = [];

    function populateVoiceList() {
        synthVoices = synth.getVoices();
        voiceList.innerHTML = '';

        for (let voice of synthVoices) {
            let option = document.createElement('option');
            option.textContent = `${voice.name} (${voice.lang})`;
            option.value = voice.name;
            voiceList.appendChild(option);
        }
    }

    synth.addEventListener('voiceschanged', populateVoiceList);
    populateVoiceList();

    showPage(currentPageIndex);

    function getVisibleText(element) {
        let textToRead = '';
        
        function extractText(node) {
            if (node.nodeType === Node.TEXT_NODE && !isButton(node.parentElement)) {
                textToRead += node.textContent;
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                for (let child of node.childNodes) {
                    extractText(child);
                }
            }
        }

        function isButton(element) {
            return element.tagName === 'BUTTON';
        }
        
        extractText(element);
        return textToRead;
    }
});
