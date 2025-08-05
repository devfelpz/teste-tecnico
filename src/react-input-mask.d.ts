
declare module "react-input-mask" {
  import * as React from "react";

  interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
    mask?: string | (string | RegExp)[];
    maskChar?: string | null;
    formatChars?: { [key: string]: string };
    alwaysShowMask?: boolean;
    beforeMaskedValueChange?: (
      newState: {
        value: string;
        selection: { start: number; end: number };
      },
      oldState: {
        value: string;
        selection: { start: number; end: number };
      },
      userInput: string
    ) => {
      value: string;
      selection?: { start: number; end: number };
    };
  }

  class ReactInputMask extends React.Component<Props> {}
  export default ReactInputMask;
}
