document.addEventListener('DOMContentLoaded', () => {
    const pages = document.querySelectorAll('.page');
    const nextButtons = document.querySelectorAll('#nextButton, #nextButton2');
    const prevButtons = document.querySelectorAll('#prevButton, #prevButton2');
    const ttsButton = document.getElementById('ttsButton');
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

    function textToSpeech() {
        if (!synth.speaking) {
            const selectedVoice = 'Google português do Brasil'; // Defina a voz desejada aqui
            const currentSection = pages[currentPageIndex];
            const textToRead = getVisibleText(currentSection);
            
            let utterance = new SpeechSynthesisUtterance(textToRead.trim());
            synth.getVoices().forEach((voice) => {
                if (voice.name === selectedVoice) {
                    utterance.voice = voice;
                }
            });
            synth.speak(utterance);
        }
    }

    ttsButton.addEventListener('click', () => {
        textToSpeech();
    });

    showPage(currentPageIndex);

    function getVisibleText(element) {
        let textToRead = '';
        
        function extractText(node) {
            if (node.nodeType === Node.TEXT_NODE) {
                textToRead += node.textContent;
            } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'BUTTON') {
                for (let child of node.childNodes) {
                    extractText(child);
                }
            }
        }
        
        extractText(element);
        return textToRead;
    }
});
