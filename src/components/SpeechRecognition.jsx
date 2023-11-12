import { useState, useEffect } from 'react';
import RecorderIcon from './Icons/RecorderIcon';
import RecordPlayingIcon from './Icons/RecordPlayingIcon';

const SpeechRecognition = () => {
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    let recognition;
    const startRecognition = () => {
      recognition = new (window.SpeechRecognition ||
        window.webkitSpeechRecognition)();
      recognition.lang = 'en-US';

      recognition.onresult = function (event) {
        const speechResult = event.results[0][0].transcript;
        setTranscript(speechResult);
      };

      recognition.onerror = function (event) {
        console.error('Speech Recognition Error:', event.error);
        setIsRecording(false);
      };

      recognition.onend = function () {
        // Set recording to false when recognition ends
        setIsRecording(false);
      };

      recognition.start();
    };

    // stop speech recognition
    const stopRecognition = () => {
      if (recognition) {
        recognition.stop();
      }
    };

    // Start or stop recognition based on isRecording state
    if (isRecording) {
      startRecognition();
    } else {
      stopRecognition();
    }

    // Cleanup the recognition when the component is unmounted
    return () => {
      stopRecognition();
    };
  }, [isRecording]);

  useEffect(() => {
    // Add typing animation effect
    let index = 0;
    const intervalId = setInterval(() => {
      setDisplayText(transcript.slice(0, index));
      index += 1;

      // Stop the typing animation when all the transcript has been displayed
      if (index > transcript.length) {
        clearInterval(intervalId);
      }
    }, 50);
    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, [transcript]);

  const handleRecordButtonClick = () => {
    setIsRecording((prevIsRecording) => !prevIsRecording);
  };

  return (
    <div className='container'>
      <div className='transcript_wrapper'>
        <p>{displayText}</p>
      </div>
      <button type='button' onClick={handleRecordButtonClick}>
        {isRecording ? <RecordPlayingIcon /> : <RecorderIcon />} Start Talking
      </button>
    </div>
  );
};

export default SpeechRecognition;
