import React from "react";
import { TextInputProps } from "react-native";

import { Container, Error } from "./styles";
import Input from "../Input";
import { Control, Controller } from "react-hook-form";

interface Props extends TextInputProps {
  control: Control;
  name: string;
  error: string;
}

export default function InputForm({ control, name, error, ...rest }: Props) {
  return (
    <Container>
      {error && <Error>{error}</Error>}
      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
          <Input onChangeText={onChange} value={value} {...rest} />
        )}
        name={name}
      />
    </Container>
  );
}
