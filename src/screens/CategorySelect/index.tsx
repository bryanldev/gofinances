import React from "react";
import { FlatList, gestureHandlerRootHOC } from "react-native-gesture-handler";
import Button from "~/components/Form/Button";
import { categories } from "~/utils/categories";

import {
  Container,
  Header,
  Title,
  Category,
  Icon,
  Name,
  Separator,
  Footer,
} from "./styles";

interface Category {
  key: string;
  name: string;
}

interface Props {
  category: Category;
  setCategory: (category: Category) => void;
  closeSelectCategory: () => void;
}

export default function CategorySelect({
  category,
  setCategory,
  closeSelectCategory,
}: Props) {
  const handleCategorySelect = (category: Category) => {
    setCategory(category);
  };

  const CategorySelectWithHOC = gestureHandlerRootHOC(() => (
    <Container>
      <Header>
        <Title>Categoria</Title>
      </Header>

      <FlatList
        data={categories}
        style={{ flex: 1, width: "100%" }}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <Category
            onPress={() => handleCategorySelect(item)}
            isActive={category.key === item.key}
          >
            <Icon name={item.icon} />
            <Name>{item.name}</Name>
          </Category>
        )}
        ItemSeparatorComponent={() => <Separator />}
      />
      <Footer>
        <Button title="Selecionar" onPress={closeSelectCategory} />
      </Footer>
    </Container>
  ));

  return <CategorySelectWithHOC />;
}
