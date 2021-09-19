import React, { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import HighlightCard from "~/components/HighlightCard";
import { HighlightCards } from "~/components/HighlightCard/styles";
import TransactionCard, {
  TransactionCardProps,
} from "~/components/TransactionCard";

import {
  Container,
  Header,
  UserWrapper,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  Icon,
  Transactions,
  Title,
  TransactionList,
  LogoutButton,
  LoadContainer,
} from "./styles";
import { useFocusEffect } from "@react-navigation/core";
import { ActivityIndicator } from "react-native";
import { useTheme } from "styled-components";
import { useAuth } from '~/hooks/auth';

export interface DataListProps extends TransactionCardProps {
  id: string;
}

interface HighlightProps {
  amount: string;
  lastTransaction: string;
}

interface HighlightData {
  entries: HighlightProps;
  costs: HighlightProps;
  total: HighlightProps;
}

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<DataListProps[]>([]);
  const [highlightCardData, setHighlightCardData] = useState<HighlightData>(
    {} as HighlightData
  );

  const { user, signOut } = useAuth();

  const theme = useTheme();

  const getLastTransactionDate = (
    collection: DataListProps[],
    type: "positive" | "negative"
  ) => {

    const collectionFiltered = collection
      .filter((transaction) => transaction.type === type);

      if (collectionFiltered.length === 0)
        return 0;
        
    const lastTransaction = new Date(
      Math.max.apply(
        Math,
        collectionFiltered
          .map((transaction) => new Date(transaction.date).getTime())
      )
    );

    return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString(
      "pt-BR",
      { month: "long" }
    )}`;
  };

  const loadTransactions = async () => {
    const dataKey = `@gofinances:transactions_user:${user.id}`;
    const response = await AsyncStorage.getItem(dataKey);

    const transactions = response ? JSON.parse(response) : [];

    let totalEntries = 0;
    let totalCost = 0;

    const transactionsFormatted: DataListProps[] = transactions.map(
      (item: DataListProps) => {
        if (item.type === "positive") {
          totalEntries += Number(item.amount);
        } else {
          totalCost += Number(item.amount);
        }

        const amount = Number(item.amount).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });

        const date = Intl.DateTimeFormat("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        }).format(new Date(item.date));

        return {
          id: item.id,
          name: item.name,
          amount,
          type: item.type,
          category: item.category,
          date,
        };
      }
    );

    setTransactions(transactionsFormatted);

    const lastEntryTransaction = getLastTransactionDate(
      transactions,
      "positive"
    );
    const lastExpenseTransaction = getLastTransactionDate(
      transactions,
      "negative"
    );

    setHighlightCardData({
      entries: {
        amount: totalEntries.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
        lastTransaction: lastEntryTransaction === 0
        ? "Não há transações"
        : `Última entrada dia ${lastEntryTransaction}`,
      },
      costs: {
        amount: totalCost.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
        lastTransaction: lastEntryTransaction === 0
        ? "Não há transações"
        :`Última saída dia ${lastExpenseTransaction}`,
      },
      total: {
        amount: (totalEntries - totalCost).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
        lastTransaction: (totalEntries - totalCost) === 0
        ? "Não há transações"
        : `01 à  ${lastExpenseTransaction}`,
      },
    });
    setIsLoading(false);
    //await AsyncStorage.removeItem(dataKey);
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, [])
  );

  return (
    <Container>
      {isLoading ? (
        <LoadContainer>
          <ActivityIndicator color={theme.colors.primary} size="large" />
        </LoadContainer>
      ) : (
        <>
          <Header>
            <UserWrapper>
              <UserInfo>
                <Photo source={{ uri: user.photo }} />
                <User>
                  <UserGreeting>Olá,</UserGreeting>
                  <UserName>{user.name}</UserName>
                </User>
              </UserInfo>

              <LogoutButton onPress={signOut}>
                <Icon name="power" />
              </LogoutButton>
            </UserWrapper>
          </Header>

          <HighlightCards>
            <HighlightCard
              title="Entradas"
              amount={highlightCardData.entries.amount}
              lastTransaction={highlightCardData.entries.lastTransaction}
              type="up"
            />
            <HighlightCard
              title="Saídas"
              amount={highlightCardData.costs.amount}
              lastTransaction={highlightCardData.entries.lastTransaction}
              type="down"
            />
            <HighlightCard
              title="Total"
              amount={highlightCardData.total.amount}
              lastTransaction={highlightCardData.total.lastTransaction}
              type="total"
            />
          </HighlightCards>

          <Transactions>
            <Title>Listagem</Title>

            <TransactionList
              data={transactions}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <TransactionCard data={item} />}
            />
          </Transactions>
        </>
      )}
    </Container>
  );
}
