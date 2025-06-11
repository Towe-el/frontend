import { API_BASE_URL } from '../services/api'

// Create a SpeechRecognition instance
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
const recognition = new SpeechRecognition()

// Configure recognition settings
recognition.continuous = true
recognition.interimResults = true
recognition.lang = 'en-US'

// Track recognition state
let isRecognitionActive = false

export const checkMicrophonePermission = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    stream.getTracks().forEach(track => track.stop()) // Stop the stream immediately
    return true
  } catch (error) {
    console.error('Microphone permission error:', error)
    return false
  }
}

export const startRecording = (onInterimResult, onFinalResult) => {
  try {
    console.log('Starting speech recognition...')
    
    // If recognition is already active, stop it first
    if (isRecognitionActive) {
      console.log('Stopping existing recognition session...')
      recognition.stop()
      isRecognitionActive = false
    }
    
    // Handle interim results
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('')
      
      const isFinal = event.results[0].isFinal
      
      if (isFinal) {
        console.log('Final transcript:', transcript)
        onFinalResult(transcript)
      } else {
        console.log('Interim transcript:', transcript)
        onInterimResult(transcript)
      }
    }

    // Handle errors
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      isRecognitionActive = false
    }

    // Handle end of recognition
    recognition.onend = () => {
      console.log('Speech recognition ended')
      isRecognitionActive = false
    }

    // Start recognition
    recognition.start()
    isRecognitionActive = true
    console.log('Speech recognition started')

    return {
      stop: () => {
        if (isRecognitionActive) {
          recognition.stop()
          isRecognitionActive = false
        }
      }
    }
  } catch (error) {
    console.error('Error starting speech recognition:', error)
    isRecognitionActive = false
    throw error
  }
}

export const downloadAudioBlob = (audioBlob, filename = 'recording.webm') => {
  try {
    // Create a URL for the blob
    const url = URL.createObjectURL(audioBlob)
    
    // Create a temporary link element
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    
    // Append to body, click, and remove
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    // Clean up the URL
    URL.revokeObjectURL(url)
    
    console.log('Audio file download initiated:', filename)
  } catch (error) {
    console.error('Error downloading audio file:', error)
    throw error
  }
} 