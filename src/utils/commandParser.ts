/**
 * Normalizes speech input for reliable command matching.
 */
export const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "")
    .replace(/\s{2,}/g, " ");
};

/**
 * Checks if the transcript contains a specific command phrase.
 */
export const matchCommand = (transcript: string, searchPhrases: string[]): boolean => {
  const normalized = normalizeText(transcript);
  return searchPhrases.some(phrase => normalized.includes(phrase.toLowerCase()));
};

/**
 * Maps transcript to specific action keys.
 */
export const parseCommand = (transcript: string): string | null => {
  const normalized = normalizeText(transcript);

  const commandMap: Record<string, string[]> = {
    'OPTION_A': ['option a', 'option alpha', 'option hey', 'option one', 'select a'],
    'OPTION_B': ['option b', 'option beta', 'option be', 'option two', 'select b'],
    'OPTION_C': ['option c', 'option charcoal', 'option see', 'option three', 'select c'],
    'OPTION_D': ['option d', 'option delta', 'option deep', 'option four', 'select d'],
    'NEXT': ['next question', 'next', 'forward'],
    'PREVIOUS': ['previous question', 'previous', 'back', 'go back'],
    'SUBMIT': ['submit exam', 'finish test', 'finish exam', 'submit'],
    'REPEAT': ['repeat question', 'read question', 'read again', 'repeat'],
    'REPEAT_OPTIONS': ['repeat options', 'read options', 'read options again'],
    'CONFIRM': ['confirm', 'yes', 'correct', 'that is right'],
    'CANCEL': ['no', 'cancel', 'stop', 'go back'],
  };

  for (const [key, patterns] of Object.entries(commandMap)) {
    if (patterns.some(pattern => normalized.includes(pattern))) {
      return key;
    }
  }

  return null;
};
