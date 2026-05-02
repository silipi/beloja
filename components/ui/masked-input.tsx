'use client';

import * as React from 'react';

import { Input } from '@/components/ui/input';

const defaultTokens = {
  '9': /\d/,
};

type MaskTokens = Record<string, RegExp>;

type MaskedInputProps = Omit<
  React.ComponentProps<typeof Input>,
  'value' | 'defaultValue'
> & {
  mask: string;
  tokens?: MaskTokens;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};

function tokenMatches(token: RegExp, char: string) {
  token.lastIndex = 0;
  return token.test(char);
}

function matchesToken(char: string, tokens: MaskTokens) {
  return Object.values(tokens).some((token) => tokenMatches(token, char));
}

function applyMask(value: string, mask: string, tokens: MaskTokens) {
  const chars = Array.from(value).filter((char) => matchesToken(char, tokens));
  let charIndex = 0;
  let maskedValue = '';

  for (const maskChar of mask) {
    const token = tokens[maskChar];

    if (!token) {
      if (charIndex < chars.length) {
        maskedValue += maskChar;
      }
      continue;
    }

    while (charIndex < chars.length && !tokenMatches(token, chars[charIndex])) {
      charIndex += 1;
    }

    if (charIndex >= chars.length) {
      break;
    }

    maskedValue += chars[charIndex];
    charIndex += 1;
  }

  return maskedValue;
}

function MaskedInput({
  mask,
  tokens = defaultTokens,
  value,
  defaultValue,
  onChange,
  onValueChange,
  ...props
}: MaskedInputProps) {
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = React.useState(() =>
    applyMask(defaultValue ?? '', mask, tokens),
  );
  const maskedValue = isControlled
    ? applyMask(value ?? '', mask, tokens)
    : uncontrolledValue;

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const nextValue = applyMask(event.currentTarget.value, mask, tokens);

    if (!isControlled) {
      setUncontrolledValue(nextValue);
    }
    onValueChange?.(nextValue);

    event.currentTarget.value = nextValue;
    onChange?.(event);
  }

  return <Input {...props} value={maskedValue} onChange={handleChange} />;
}

export { MaskedInput, applyMask };
