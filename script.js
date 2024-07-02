const U = new SpeechSynthesisUtterance();
const voiceSelect = document.querySelector('.hero__select');

let voices = [];

function populateVoices() {
	voices = speechSynthesis.getVoices();
	voiceSelect.innerHTML = '';

	voices.forEach((voice, index) => {
		voiceSelect.options[index] = new Option(`${voice.lang}: ${voice.name}`, index);
	});

	let defaultVoiceIndex = (voices.findIndex((voice) => voice.name === "Google UK English Female") + 1 || 1) - 1;
	voiceSelect.selectedIndex = defaultVoiceIndex;
	initializeHandlers();
}

populateVoices();
if (speechSynthesis.onvoiceschanged !== undefined) {
	speechSynthesis.onvoiceschanged = populateVoices;
}

function initializeHandlers() {
	U.onstart = () => console.log('Started!');
	U.onend = () => console.log('Finished!');
	U.onerror = (err) => console.error(err);
	U.onpause = () => console.log('Pause!');
	U.onresume = () => console.log('Resumed!');

	document.querySelector('.hero__actions').addEventListener('click', ({ target: { className } }) => {
		switch (className) {
			case "hero__button hero__button--speak":
				if (!speechSynthesis.speaking) {
					convertTextToSpeech();
				}
				break;
			case "hero__button hero__button--cancel":
				return speechSynthesis.cancel();
			case "hero__button hero__button--pause":
				return speechSynthesis.pause();
			case "hero__button hero__button--resume":
				return speechSynthesis.resume();
			default:
				return;
		}
	})
}

function convertTextToSpeech() {
	const trimmedText = document.querySelector('.hero__text').value.trim();
	if (!trimmedText) return;
	U.text = trimmedText;
	const voice = voices[voiceSelect.value];
	U.voice = voice;
	U.lang = voice.lang;
	speechSynthesis.speak(U);
}

window.onkeydown = ({ key }) => {
	switch (key.toLowerCase()) {
		case "s":
			if (!speechSynthesis.speaking) {
				convertTextToSpeech();
			}
			break;
		case "c":
			return speechSynthesis.cancel();
		case "p":
			return speechSynthesis.pause();
		case "r":
			return speechSynthesis.resume();
		default:
			return;
	}
};
