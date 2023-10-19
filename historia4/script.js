document.addEventListener('DOMContentLoaded', () => {
    const pages = document.querySelectorAll('.page');
    const nextButtons = document.querySelectorAll('.nextButton');
    const prevButtons = document.querySelectorAll('.prevButton');
    const ttsButton = document.getElementById('ttsButton');
    const startAutoReadButton = document.getElementById('startAutoReadButton');
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

    function textToSpeech() {
        if (synth && !synth.speaking) {
            const selectedVoice = voiceList.value; // Use a voz selecionada no menu suspenso
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

        function extractText(node, isFirstNodeInElement) {
            if (node.nodeType === Node.TEXT_NODE && !isButton(node.parentElement)) {
                if (isFirstNodeInElement) {
                    textToRead += '\n';
                }
                textToRead += node.textContent;
            } else if (node.nodeType === Node.ELEMENT_NODE) {
            // Check if the element has the "arrow" class and skip it.
            if (!node.classList.contains('arrow')) {
                let isFirstNodeInCurrentElement = true;
                for (let child of node.childNodes) {
                    extractText(child, isFirstNodeInCurrentElement);
                    isFirstNodeInCurrentElement = false;
                }
            }
        }
    }

        function isButton(element) {
            return element.tagName === 'BUTTON';
        }

        extractText(element, false);
        return textToRead;
    }

    startAutoReadButton.addEventListener('click', () => {
        const pages = document.querySelectorAll('.page');
        const synth = window.speechSynthesis;
    
        let currentPageIndex = 0;
    
        function readNextPage() {
            if (currentPageIndex < pages.length) {
                const currentSection = pages[currentPageIndex];
                const textToRead = getVisibleText(currentSection);
    
                let utterance = new SpeechSynthesisUtterance(textToRead.trim());
    
                utterance.onend = () => {
                    if (currentPageIndex < pages.length - 1) {
                        showPage(currentPageIndex + 1);
                        currentPageIndex++;
                        setTimeout(readNextPage, 2000); // Correção: remova os parênteses aqui
                    }
                };
    
                synth.speak(utterance);
            }
        }
    
        readNextPage();
    });
    



});
