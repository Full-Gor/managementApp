import { useState, useEffect, useCallback, useRef } from 'react';
import { Platform, Alert } from 'react-native';

// Import conditionnel pour expo-speech-recognition
let ExpoSpeechRecognition = null;
try {
  ExpoSpeechRecognition = require('expo-speech-recognition');
} catch (e) {
  console.log('expo-speech-recognition not available');
}

/**
 * Hook personnalisé pour la reconnaissance vocale
 * Fonctionne sur iOS, Android et Web
 */
export function useSpeechRecognition({ language = 'fr-FR', continuous = false } = {}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState(null);
  const [isSupported, setIsSupported] = useState(false);

  // Références pour Web Speech API
  const webRecognitionRef = useRef(null);

  // Vérifier le support au montage
  useEffect(() => {
    checkSupport();
    return () => {
      stopListening();
    };
  }, []);

  const checkSupport = async () => {
    if (Platform.OS === 'web') {
      // Vérifier Web Speech API
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      setIsSupported(!!SpeechRecognition);
    } else if (ExpoSpeechRecognition) {
      // Vérifier expo-speech-recognition
      try {
        const result = await ExpoSpeechRecognition.getPermissionsAsync();
        setIsSupported(true);
      } catch (e) {
        setIsSupported(false);
      }
    } else {
      setIsSupported(false);
    }
  };

  const requestPermissions = async () => {
    if (Platform.OS === 'web') {
      // Le navigateur demande automatiquement
      return true;
    } else if (ExpoSpeechRecognition) {
      try {
        const { status } = await ExpoSpeechRecognition.requestPermissionsAsync();
        return status === 'granted';
      } catch (e) {
        console.error('Permission error:', e);
        return false;
      }
    }
    return false;
  };

  // Démarrer l'écoute
  const startListening = useCallback(async () => {
    setError(null);
    setTranscript('');
    setInterimTranscript('');

    if (Platform.OS === 'web') {
      // Web Speech API
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognition) {
        setError('La reconnaissance vocale n\'est pas supportée par ce navigateur');
        return false;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = continuous;
      recognition.interimResults = true;
      recognition.lang = language;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        let interimText = '';
        let finalText = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalText += result[0].transcript;
          } else {
            interimText += result[0].transcript;
          }
        }

        if (finalText) {
          setTranscript((prev) => prev + finalText);
        }
        setInterimTranscript(interimText);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setError('Accès au microphone refusé. Autorisez l\'accès dans les paramètres.');
        } else if (event.error === 'no-speech') {
          setError('Aucune parole détectée. Réessayez.');
        } else {
          setError(`Erreur: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript('');
      };

      webRecognitionRef.current = recognition;

      try {
        recognition.start();
        return true;
      } catch (e) {
        setError('Impossible de démarrer la reconnaissance vocale');
        return false;
      }

    } else if (ExpoSpeechRecognition) {
      // Expo Speech Recognition (iOS/Android)
      const hasPermission = await requestPermissions();

      if (!hasPermission) {
        setError('Permission microphone requise');
        Alert.alert(
          'Permission requise',
          'Autorisez l\'accès au microphone pour utiliser la reconnaissance vocale',
          [{ text: 'OK' }]
        );
        return false;
      }

      try {
        setIsListening(true);

        ExpoSpeechRecognition.start({
          language: language,
          interimResults: true,
          continuous: continuous,
        });

        // Listeners pour expo-speech-recognition
        const subscription = ExpoSpeechRecognition.addOnResultListener((event) => {
          if (event.results && event.results.length > 0) {
            const result = event.results[0];
            if (result.isFinal) {
              setTranscript((prev) => prev + result.transcript);
              setInterimTranscript('');
            } else {
              setInterimTranscript(result.transcript);
            }
          }
        });

        const errorSubscription = ExpoSpeechRecognition.addOnErrorListener((event) => {
          console.error('Speech recognition error:', event);
          setError(event.message || 'Erreur de reconnaissance vocale');
          setIsListening(false);
        });

        const endSubscription = ExpoSpeechRecognition.addOnEndListener(() => {
          setIsListening(false);
          setInterimTranscript('');
        });

        // Stocker les subscriptions pour cleanup
        webRecognitionRef.current = {
          subscription,
          errorSubscription,
          endSubscription,
        };

        return true;
      } catch (e) {
        setError('Impossible de démarrer la reconnaissance vocale');
        setIsListening(false);
        return false;
      }
    } else {
      setError('La reconnaissance vocale n\'est pas disponible sur cet appareil');
      return false;
    }
  }, [language, continuous]);

  // Arrêter l'écoute
  const stopListening = useCallback(() => {
    if (Platform.OS === 'web') {
      if (webRecognitionRef.current) {
        webRecognitionRef.current.stop();
        webRecognitionRef.current = null;
      }
    } else if (ExpoSpeechRecognition) {
      try {
        ExpoSpeechRecognition.stop();

        // Cleanup subscriptions
        if (webRecognitionRef.current) {
          webRecognitionRef.current.subscription?.remove();
          webRecognitionRef.current.errorSubscription?.remove();
          webRecognitionRef.current.endSubscription?.remove();
          webRecognitionRef.current = null;
        }
      } catch (e) {
        console.error('Error stopping recognition:', e);
      }
    }

    setIsListening(false);
    setInterimTranscript('');
  }, []);

  // Réinitialiser le transcript
  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    setError(null);
  }, []);

  return {
    isListening,
    transcript,
    interimTranscript,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  };
}

export default useSpeechRecognition;
