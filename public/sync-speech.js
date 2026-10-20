/**
 * SYNC SPEECH & STREAM ENGINE (sync-speech.js)
 * High-performance, synchronized TTS audio & word-by-word text streaming for Dang Nam AI.
 * Designed to eliminate text dump bugs, duplicate lines, layout breaking, and mobile Web Speech API quirks.
 */

(function (root, factory) {
  const lib = factory();
  if (typeof exports === 'object') {
    Object.assign(exports, lib);
  }
  if (typeof module === 'object' && module.exports) {
    module.exports = lib;
  }
  if (typeof define === 'function' && define.amd) {
    define([], function () { return lib; });
  }
  if (typeof window !== 'undefined') {
    window.SyncSpeech = lib;
  }
  if (typeof globalThis !== 'undefined') {
    globalThis.SyncSpeech = lib;
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  let activeSession = null;

  // Clean Markdown syntax for natural Vietnamese TTS pronunciation
  function cleanMarkdownForSpeech(raw) {
    if (!raw) return '';
    return String(raw)
      .replace(/```[\s\S]*?```/g, ' đoạn mã ')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/#{1,6}\s+/g, '')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/__([^_]+)__/g, '$1')
      .replace(/_([^_]+)_/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
      .replace(/^>\s+/gm, '')
      .replace(/^[-*+]\s+/gm, '')
      .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '') // remove icons/emojis from speech
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Split text into natural, readable sentences without breaking decimal numbers (e.g. 3.5)
  function splitSentences(text) {
    if (!text) return [];
    const normalized = String(text).replace(/\r\n/g, '\n');
    const sentences = [];
    let cur = '';

    for (let i = 0; i < normalized.length; i++) {
      const ch = normalized[i];
      cur += ch;

      const isNewline = ch === '\n';
      const isPunctuation = (ch === '.' || ch === '!' || ch === '?' || ch === ';');

      if (isNewline) {
        if (cur.trim()) sentences.push(cur);
        cur = '';
      } else if (isPunctuation) {
        const prev = normalized[i - 1];
        const next = normalized[i + 1];
        // Don't split inside decimal numbers like "3.5" or "10.000"
        const isDecimalOrNumber = prev && /\d/.test(prev) && next && /\d/.test(next);
        if (!isDecimalOrNumber && (!next || /\s/.test(next))) {
          sentences.push(cur);
          cur = '';
        }
      }
    }

    if (cur.length > 0) {
      if (cur.trim()) {
        sentences.push(cur);
      } else if (sentences.length > 0) {
        sentences[sentences.length - 1] += cur;
      }
    }

    return sentences.length ? sentences : [normalized];
  }

  // Split a sentence into word tokens for word-by-word inline revelation
  function tokenizeSentence(sentence) {
    if (!sentence) return [];
    // Match each non-whitespace block followed by any trailing whitespaces
    const matches = sentence.match(/\S+\s*/g);
    return matches && matches.length ? matches : [sentence];
  }

  function isSpeechSupported() {
    return typeof window !== 'undefined' && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined';
  }

  /**
   * Stop active speech session immediately, clear timers, and guarantee full text is revealed.
   */
  function stopActiveSpeech() {
    if (!activeSession) return;
    const session = activeSession;
    activeSession = null;

    if (session.fallbackTimer) {
      clearInterval(session.fallbackTimer);
      clearTimeout(session.fallbackTimer);
      session.fallbackTimer = null;
    }

    try {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    } catch (e) {}

    // Guarantee that stopping speech instantly reveals the complete full text
    if (typeof session.onWord === 'function') {
      session.onWord(session.fullOriginalText, true, {
        sentenceIndex: session.sentences.length - 1,
        totalSentences: session.sentences.length,
        stopped: true
      });
    }

    if (typeof session.onDone === 'function') {
      session.onDone(session.fullOriginalText);
    }
  }

  /**
   * Synchronized Speech & Text Revealer
   * Reliable on Mobile browsers (iOS Safari, Android Chrome) with fallback timing.
   */
  function speakWithSync(options) {
    const {
      id = 'tts-' + Date.now(),
      text = '',
      rate = 1.0,
      pitch = 1.0,
      voice = null,
      onWord = null,
      onSentenceStart = null,
      onDone = null,
      onError = null
    } = options || {};

    // Stop any ongoing speech first
    stopActiveSpeech();

    const fullOriginalText = String(text || '');
    if (!fullOriginalText.trim()) {
      if (typeof onDone === 'function') onDone('');
      return { stop: () => {} };
    }

    const sentences = splitSentences(fullOriginalText);
    const session = {
      id,
      fullOriginalText,
      sentences,
      sentenceTokens: sentences.map(s => tokenizeSentence(s)),
      currentSentenceIdx: 0,
      revealedTokensInCurSentence: 0,
      accumulatedPrevText: '',
      fallbackTimer: null,
      boundaryFiredForCurSentence: false,
      stopped: false,
      onWord,
      onDone,
      onError
    };

    activeSession = session;

    // If speech synthesis is completely unsupported in this browser environment,
    // gracefully reveal the text word-by-word using high-speed timer fallback
    if (!isSpeechSupported()) {
      runTimerOnlyMode(session, rate);
      return { stop: stopActiveSpeech };
    }

    try {
      window.speechSynthesis.cancel();
    } catch (e) {}

    playNextSentence(session, rate, pitch, voice);

    return {
      stop: stopActiveSpeech,
      getId: () => session.id
    };
  }

  function playNextSentence(session, rate, pitch, voice) {
    if (!activeSession || activeSession !== session) return;

    if (session.currentSentenceIdx >= session.sentences.length) {
      // Completed all sentences
      const finalText = session.fullOriginalText;
      activeSession = null;
      if (typeof session.onWord === 'function') {
        session.onWord(finalText, true, {
          sentenceIndex: session.sentences.length - 1,
          totalSentences: session.sentences.length,
          completed: true
        });
      }
      if (typeof session.onDone === 'function') {
        session.onDone(finalText);
      }
      return;
    }

    const sIdx = session.currentSentenceIdx;
    const rawSentence = session.sentences[sIdx];
    const tokens = session.sentenceTokens[sIdx];
    const cleanSpoken = cleanMarkdownForSpeech(rawSentence);

    session.revealedTokensInCurSentence = 0;
    session.boundaryFiredForCurSentence = false;

    if (typeof session.onSentenceStart === 'function') {
      session.onSentenceStart(sIdx, session.sentences.length, rawSentence);
    }

    // If sentence has no speakable words (e.g. only punctuation or whitespace), reveal immediately and step next
    if (!cleanSpoken.trim() || tokens.length === 0) {
      session.accumulatedPrevText += rawSentence;
      session.currentSentenceIdx++;
      if (typeof session.onWord === 'function') {
        session.onWord(session.accumulatedPrevText, false, {
          sentenceIndex: sIdx,
          totalSentences: session.sentences.length
        });
      }
      playNextSentence(session, rate, pitch, voice);
      return;
    }

    // Build the Utterance
    let utterance = null;
    try {
      utterance = new SpeechSynthesisUtterance(cleanSpoken);
      utterance.lang = 'vi-VN';
      utterance.rate = Math.max(0.6, Math.min(2.0, Number(rate) || 1.0));
      utterance.pitch = Math.max(0.5, Math.min(1.5, Number(pitch) || 1.0));
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang || 'vi-VN';
      }
    } catch (e) {
      // Fallback to timer-only if utterance creation fails
      runSentenceTimerFallback(session, sIdx, tokens, rate, () => {
        session.accumulatedPrevText += rawSentence;
        session.currentSentenceIdx++;
        playNextSentence(session, rate, pitch, voice);
      });
      return;
    }

    let sentenceEnded = false;

    function finishSentence() {
      if (sentenceEnded) return;
      sentenceEnded = true;

      if (session.fallbackTimer) {
        clearInterval(session.fallbackTimer);
        clearTimeout(session.fallbackTimer);
        session.fallbackTimer = null;
      }

      // Ensure all tokens of this sentence are fully revealed
      session.accumulatedPrevText += rawSentence;
      session.currentSentenceIdx++;

      if (activeSession === session && typeof session.onWord === 'function') {
        session.onWord(session.accumulatedPrevText, session.currentSentenceIdx >= session.sentences.length, {
          sentenceIndex: sIdx,
          totalSentences: session.sentences.length
        });
      }

      // Next sentence
      playNextSentence(session, rate, pitch, voice);
    }

    // 1. Native onboundary listener (supported on Desktop Chrome, Edge, Safari Desktop)
    utterance.onboundary = function (event) {
      if (!activeSession || activeSession !== session || sentenceEnded) return;
      if (event.name === 'word') {
        session.boundaryFiredForCurSentence = true;
        // In browsers where onboundary works, stop the fallback timer
        if (session.fallbackTimer) {
          clearInterval(session.fallbackTimer);
          session.fallbackTimer = null;
        }

        if (session.revealedTokensInCurSentence < tokens.length) {
          session.revealedTokensInCurSentence++;
          emitSentenceProgress(session, sIdx, tokens);
        }
      }
    };

    utterance.onend = function () {
      if (!activeSession || activeSession !== session) return;
      finishSentence();
    };

    utterance.onerror = function (event) {
      if (!activeSession || activeSession !== session) return;
      // Many mobile browsers fire an error if interrupted; gracefully complete this sentence
      finishSentence();
    };

    // 2. CRITICAL MOBILE FALLBACK TIMER (iOS Safari / Android Chrome):
    // In mobile WebKit/Blink, onboundary does NOT fire. We pace words using custom timer
    // matching average Vietnamese speech speed (~200-260ms per word token, scaled by rate).
    const spokenWordCount = Math.max(1, tokens.length);
    const charCount = cleanSpoken.length;
    const effectiveRate = Math.max(0.6, Number(rate) || 1.0);

    // Approximate duration for Vietnamese utterance
    const estimatedSentenceMs = Math.max(
      600,
      Math.min(12000, ((charCount * 55) + (spokenWordCount * 120)) / effectiveRate)
    );
    const intervalPerWord = Math.max(45, Math.min(320, Math.round(estimatedSentenceMs / spokenWordCount)));

    // Start pacing timer
    session.fallbackTimer = setInterval(function () {
      if (!activeSession || activeSession !== session || sentenceEnded) {
        clearInterval(session.fallbackTimer);
        return;
      }
      // Only advance timer if native boundary has not taken over
      if (!session.boundaryFiredForCurSentence) {
        if (session.revealedTokensInCurSentence < tokens.length) {
          session.revealedTokensInCurSentence++;
          emitSentenceProgress(session, sIdx, tokens);
        } else {
          // All tokens shown for this sentence; keep waiting for onend or safety timeout
          clearInterval(session.fallbackTimer);
          session.fallbackTimer = null;
        }
      }
    }, intervalPerWord);

    // Safety watchdog timer: in case utterance gets stuck or blocked by mobile autoplay policy
    const safetyTimeoutMs = estimatedSentenceMs + 3500;
    setTimeout(function () {
      if (activeSession === session && !sentenceEnded && session.currentSentenceIdx === sIdx) {
        finishSentence();
      }
    }, safetyTimeoutMs);

    try {
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      finishSentence();
    }
  }

  function emitSentenceProgress(session, sIdx, tokens) {
    if (!activeSession || activeSession !== session) return;
    const revealedSentencePart = tokens.slice(0, session.revealedTokensInCurSentence).join('');
    const fullRevealedSoFar = session.accumulatedPrevText + revealedSentencePart;

    if (typeof session.onWord === 'function') {
      session.onWord(fullRevealedSoFar, false, {
        sentenceIndex: sIdx,
        totalSentences: session.sentences.length,
        revealedTokens: session.revealedTokensInCurSentence,
        totalTokensInSentence: tokens.length
      });
    }
  }

  function runSentenceTimerFallback(session, sIdx, tokens, rate, onComplete) {
    const rawSentence = session.sentences[sIdx];
    const effectiveRate = Math.max(0.6, Number(rate) || 1.0);
    const intervalPerWord = Math.max(40, Math.min(250, Math.round(180 / effectiveRate)));
    let revealed = 0;

    session.fallbackTimer = setInterval(function () {
      if (!activeSession || activeSession !== session) {
        clearInterval(session.fallbackTimer);
        return;
      }
      if (revealed < tokens.length) {
        revealed++;
        session.revealedTokensInCurSentence = revealed;
        emitSentenceProgress(session, sIdx, tokens);
      } else {
        clearInterval(session.fallbackTimer);
        session.fallbackTimer = null;
        onComplete();
      }
    }, intervalPerWord);
  }

  function runTimerOnlyMode(session, rate) {
    const tokens = tokenizeSentence(session.fullOriginalText);
    const effectiveRate = Math.max(0.6, Number(rate) || 1.0);
    const intervalPerWord = Math.max(35, Math.min(200, Math.round(160 / effectiveRate)));
    let index = 0;

    session.fallbackTimer = setInterval(function () {
      if (!activeSession || activeSession !== session) {
        clearInterval(session.fallbackTimer);
        return;
      }
      if (index < tokens.length) {
        index++;
        const currentText = tokens.slice(0, index).join('');
        if (typeof session.onWord === 'function') {
          session.onWord(currentText, index >= tokens.length, {
            revealedTokens: index,
            totalTokens: tokens.length
          });
        }
      } else {
        clearInterval(session.fallbackTimer);
        session.fallbackTimer = null;
        activeSession = null;
        if (typeof session.onDone === 'function') {
          session.onDone(session.fullOriginalText);
        }
      }
    }, intervalPerWord);
  }

  /**
   * SmoothStreamPacer:
   * Paces real-time SSE chunks word-by-word into ONE single message container
   * without creating duplicate lines, block tags, or layout stutter.
   */
  function createStreamPacer(options) {
    const {
      onTextUpdate = () => {},
      onDone = () => {},
      paceIntervalMs = 28 // 25-35ms per word for natural, fluid stream
    } = options || {};

    let targetText = '';
    let currentRevealedText = '';
    let targetTokens = [];
    let revealedTokenCount = 0;
    let timerId = null;
    let isStreamDone = false;

    function step() {
      if (revealedTokenCount < targetTokens.length) {
        // Step 1 token forward, or step 2 if buffer is getting large to avoid falling behind
        const lag = targetTokens.length - revealedTokenCount;
        const stepSize = lag > 15 ? 3 : (lag > 8 ? 2 : 1);
        revealedTokenCount = Math.min(targetTokens.length, revealedTokenCount + stepSize);
        currentRevealedText = targetTokens.slice(0, revealedTokenCount).join('');
        onTextUpdate(currentRevealedText, false);
      }

      if (revealedTokenCount >= targetTokens.length) {
        if (isStreamDone) {
          stopTimer();
          onTextUpdate(targetText, true);
          onDone(targetText);
          return;
        }
      }

      timerId = setTimeout(step, paceIntervalMs);
    }

    function startTimer() {
      if (timerId === null) {
        timerId = setTimeout(step, paceIntervalMs);
      }
    }

    function stopTimer() {
      if (timerId !== null) {
        clearTimeout(timerId);
        timerId = null;
      }
    }

    return {
      pushDelta(newFullText) {
        targetText = String(newFullText || '');
        targetTokens = targetText.match(/\S+\s*/g) || [targetText];
        startTimer();
      },
      complete(finalText) {
        isStreamDone = true;
        targetText = String(finalText || targetText || '');
        targetTokens = targetText.match(/\S+\s*/g) || [targetText];
        // If buffer is small, quickly drain
        if (targetTokens.length - revealedTokenCount <= 3) {
          stopTimer();
          currentRevealedText = targetText;
          onTextUpdate(targetText, true);
          onDone(targetText);
        } else {
          startTimer();
        }
      },
      abort() {
        stopTimer();
        isStreamDone = true;
      },
      getCurrentText() {
        return currentRevealedText || targetText;
      }
    };
  }

  /**
   * Anti-Jitter Smooth Scroll Helper
   * Uses throttled instant scroll inside requestAnimationFrame.
   * Respects user scrolling up to read earlier history.
   */
  function smoothScrollToBottom(containerElem, force) {
    if (!containerElem) return;
    const distFromBottom = containerElem.scrollHeight - containerElem.scrollTop - containerElem.clientHeight;
    // Don't yank user down if they deliberately scrolled up to read earlier messages
    if (!force && distFromBottom > 90) return;

    if (!containerElem._scrollRafScheduled) {
      containerElem._scrollRafScheduled = true;
      requestAnimationFrame(function () {
        containerElem._scrollRafScheduled = false;
        containerElem.scrollTop = containerElem.scrollHeight;
      });
    }
  }

  return {
    isSupported: isSpeechSupported,
    cleanText: cleanMarkdownForSpeech,
    splitSentences: splitSentences,
    speakWithSync: speakWithSync,
    stop: stopActiveSpeech,
    getActiveId: () => activeSession ? activeSession.id : null,
    isSpeaking: () => Boolean(activeSession),
    createStreamPacer: createStreamPacer,
    smoothScrollToBottom: smoothScrollToBottom
  };
}));
