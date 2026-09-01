// Web Speech Synthesis Helper for Interactive Emergency Voice Guide

export const isSpeechSupported = (): boolean => {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
};

export const stopSpeech = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

export const speakProtap = (
  title: string,
  steps: string[],
  onEndCallback?: () => void,
  onErrorCallback?: () => void
) => {
  if (!isSpeechSupported()) {
    if (onErrorCallback) onErrorCallback();
    return;
  }

  // Cancel any ongoing speech first
  stopSpeech();

  const textToRead = `${title}. Langkah pertama: ${steps.join('. Langkah selanjutnya: ')}. Selesai. Segera hubungi tim tanggap darurat bila diperlukan.`;

  const utterance = new SpeechSynthesisUtterance(textToRead);
  utterance.lang = 'id-ID'; // Bahasa Indonesia
  utterance.rate = 0.95; // Slightly slower for emergency clarity
  utterance.pitch = 1.0;

  // Try to find Indonesian voice if available
  const voices = window.speechSynthesis.getVoices();
  const idVoice = voices.find(
    (v) => v.lang.includes('id') || v.lang.includes('ID') || v.name.toLowerCase().includes('indonesia')
  );
  if (idVoice) {
    utterance.voice = idVoice;
  }

  utterance.onend = () => {
    if (onEndCallback) onEndCallback();
  };

  utterance.onerror = () => {
    if (onErrorCallback) onErrorCallback();
  };

  window.speechSynthesis.speak(utterance);
};
