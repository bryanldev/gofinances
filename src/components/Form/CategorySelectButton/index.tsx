import React from "react";
import { RectButtonProps } from "react-native-gesture-handler";

import { Container, Category, Icon } from "./styles";

interface Props extends RectButtonProps {
  title: string;
}

export default function CategorySelectButton({ title, ...rest }: Props) {
  return (
    <Container {...rest}>
      <Category>{title}</Category>
      <Icon name="chevron-down" />
    </Container>
  );
}
