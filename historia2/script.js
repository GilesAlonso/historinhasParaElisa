document.addEventListener('DOMContentLoaded', () => {
    const pages = document.querySelectorAll('.page');
    const nextButtons = document.querySelectorAll('#nextButton, #nextButton2, #nextButton3, #nextButton4, #nextButton5, #nextButton6, #nextButton7, #nextButton8');
    const prevButtons = document.querySelectorAll('#prevButton, #prevButton2, #prevButton3, #prevButton4, #prevButton5, #prevButton6, #prevButton7, #prevButton8');
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
    
        function extractText(node, isFirstNodeInElement) {
            if (node.nodeType === Node.TEXT_NODE && !isButton(node.parentElement)) {
                if (isFirstNodeInElement) {
                    textToRead += '.\n'; // Adiciona ponto e quebra de linha no início do elemento
                }
                textToRead += node.textContent;
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                let isFirstNodeInCurrentElement = true;
                for (let child of node.childNodes) {
                    extractText(child, isFirstNodeInCurrentElement);
                    isFirstNodeInCurrentElement = false; // Define como falso após processar o primeiro nó
                }
            }
        }
    
        function isButton(element) {
            return element.tagName === 'BUTTON';
        }
    
        extractText(element, false); // Começa com isFirstNodeInElement como falso
        return textToRead;
    }
});
