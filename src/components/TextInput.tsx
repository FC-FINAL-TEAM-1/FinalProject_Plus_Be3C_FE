import { css } from '@emotion/react';
import { COLOR, COLOR_OPACITY } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';

type InputTypes = 'text' | 'password' | 'email' | 'tel' | 'number';
type InputColorTypes = 'default' | 'skyblue';
type InputIconNumTypes = 'none' | 'single' | 'double';
export type InputStateTypes = 'normal' | 'pass' | 'warn' | 'success';

interface InputProps {
  type?: InputTypes;
  placeholder?: string;
  color?: InputColorTypes;
  status?: InputStateTypes;
  fullWidth?: boolean;
  width?: number;
  iconNum?: InputIconNumTypes;
  maxLength?: number;
  height?: number;
  disabled?: boolean;
  value: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const TextInput: React.FC<InputProps> = ({
  type,
  placeholder,
  color = 'default',
  status = 'normal',
  value,
  fullWidth = false,
  width = 360,
  iconNum = 'none',
  maxLength,
  height = 48,
  disabled = false,
  handleChange,
  handleKeyDown,
}) => (
  <>
    <input
      css={inputStyle(color, status, fullWidth, width, height, iconNum)}
      type={type}
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      maxLength={maxLength}
      disabled={disabled}
    />
  </>
);

const inputStyle = (
  color: string,
  status: InputStateTypes,
  fullWidth: boolean,
  width: number,
  height: number,
  iconNum: InputIconNumTypes
) => css`
  position: relative;
  width: ${fullWidth ? '100%' : width ? `${width}px` : 'auto'};
  border: 1px solid
    ${status === 'warn'
      ? COLOR.ERROR_RED
      : status === 'success'
        ? COLOR.CHECK_GREEN
        : color === 'skyblue'
          ? COLOR.PRIMARY100
          : COLOR_OPACITY.BLACK_OPACITY30};
  height: ${height}px;
  outline: none;
  border-radius: 4px;
  padding: 16px;
  padding-right: ${iconNum === 'single'
    ? '48px'
    : iconNum === 'double'
      ? '96px'
      : '16px'};

  font-size: ${height <= 48 ? FONT_SIZE.TEXT_MD : FONT_SIZE.TITLE_XS};
  font-weight: ${height <= 48 ? FONT_WEIGHT.REGULAR : FONT_WEIGHT.BOLD};
  font-family: inherit;
  letter-spacing: -0.32px;

  &:focus {
    border-color: ${status === 'warn'
      ? COLOR.ERROR_RED
      : status === 'success'
        ? COLOR.CHECK_GREEN
        : COLOR.BLACK};
  }

  ::placeholder {
    color: ${COLOR_OPACITY.BLACK_OPACITY30};
  }

  ::-ms-reveal {
    display: none;
  }
`;

export default TextInput;
