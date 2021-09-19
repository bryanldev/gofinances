import React, { useState } from "react";
import { Platform, Alert } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

import { 
  Container, 
  Footer, 
  FooterWrapper, 
  Header, 
  Load, 
  SignInTitle, 
  Title, 
  TitleWrapper } from "./styles";

import LogoSvg from "~/assets/logo.svg";
import GoogleSvg from "~/assets/google.svg";
import AppleSvg from "~/assets/apple.svg";
import SignInSocialButton from '~/components/SignInSocialButton';

import { useAuth } from '~/hooks/auth';


export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);

  const { signInWithGoogle, signInWithApple } = useAuth();

  const handleSignInWithGoogle = async () => {
    setIsLoading(true);
    
    try {
      return await signInWithGoogle();
    } catch (error) {
      console.log(error);
      Alert.alert('Não foi possível conectar a conta Google');
      setIsLoading(false);
    }
  }

  const handleSignInWithApple = async () => {
    setIsLoading(true);

    try {
      return await signInWithApple();
    } catch (error) {
      console.log(error);
      Alert.alert('Não foi possível conectar a conta Apple');
      setIsLoading(false);
    }
  }

  return (
    <Container>
      <Header>
        <TitleWrapper>
          <LogoSvg
            width={RFValue(120)}
            height={RFValue(68)}
          />
          <Title>
            Controle suas {'\n'}
            finanças de forma  {'\n'}
            muito simples
          </Title>
        </TitleWrapper>

        <SignInTitle>
          Faça seu login com  {'\n'}
          uma das contas abaixo  {'\n'}
        </SignInTitle>
      </Header>

      <Footer>
        <FooterWrapper>
          <SignInSocialButton 
            title="Entrar com Google"
            svg={GoogleSvg}
            onPress={handleSignInWithGoogle}
          />

        {
          Platform.OS === 'ios' &&
          <SignInSocialButton 
          title="Entrar com Apple"
          svg={AppleSvg}
          onPress={handleSignInWithApple}
        />
        }
        </FooterWrapper>

        { isLoading && <Load/> }
      </Footer>
    </Container>
  );
}
