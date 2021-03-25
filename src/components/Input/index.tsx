import {
  useEffect,
  useRef,
  useState,
  useCallback,
  ReactNode,
} from 'react';

import { useField } from '@unform/core';

import { Container } from './styles';

interface InputProps {
  name: string;
  icon?: ReactNode;
  [property: string]: any;
}

export default function Input({ name, icon, ...rest }: InputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { fieldName, defaultValue, registerField } = useField(name);

  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);
  
  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
    });
  }, [fieldName, registerField]);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);

    setIsFilled(!!inputRef.current?.value);
  }, []);
  
  return (
    <Container isFilled={isFilled} isFocused={isFocused}>
      {icon}

      <input
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        defaultValue={defaultValue}
        ref={inputRef}
        {...rest}
      />
    </Container>
  );
}

// const Input2 = ({ name, icon: Icon, ...rest }) => {


//   const { fieldName, defaultValue, registerField } = useField(name);

  



  

//   return (
//     <Container isFilled={isFilled} isFocused={isFocused}>
//       {Icon && <Icon size={20} />}

//       <input
//         onFocus={handleInputFocus}
//         onBlur={handleInputBlur}
//         defaultValue={defaultValue}
//         ref={inputRef}
//         {...rest}
//       />
//     </Container>
//   );
// };
