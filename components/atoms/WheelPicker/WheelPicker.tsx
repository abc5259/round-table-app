import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  ListRenderItemInfo,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  View,
  ViewStyle,
} from "react-native";

interface Props {
  items: string[];
  onItemChange: (item: string) => void;
  itemHeight: number;
  initValue?: string;
  containerStyle?: ViewStyle;
}

const WheelPicker: React.FC<Props> = props => {
  const { items, onItemChange, itemHeight, initValue } = props;
  const scrollY = useRef(new Animated.Value(0)).current;
  const initValueIndex = initValue ? items.indexOf(initValue) : null;
  const [selectedIndex, setSelectedIndex] = useState(
    initValueIndex != null ? items[initValueIndex] : items[0]
  );

  const renderItem = ({ item, index }: ListRenderItemInfo<string>) => {
    const inputRange = [
      (index - 2) * itemHeight,
      (index - 1) * itemHeight,
      index * itemHeight,
    ];
    const scale = scrollY.interpolate({
      inputRange,
      outputRange: [0.8, 1, 0.8],
    });

    return (
      <Animated.View
        style={[
          {
            height: itemHeight,
            transform: [{ scale }],
            alignItems: "center",
            justifyContent: "center",
          },
        ]}
      >
        <Text
          style={[
            {
              fontSize: 16,
              fontWeight: "bold",
              color: selectedIndex === item ? "#3F4245" : "#9F9F9F",
            },
          ]}
        >
          {item}
        </Text>
      </Animated.View>
    );
  };

  const modifiedItems = ["", ...items, ""];

  const momentumScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / itemHeight);
    setSelectedIndex(items[index]);
  };

  useEffect(() => {
    onItemChange(selectedIndex);
  }, [selectedIndex]);

  return (
    <View style={[{ height: itemHeight * 3 }, props.containerStyle]}>
      <Animated.FlatList
        data={modifiedItems}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        snapToInterval={itemHeight}
        onMomentumScrollEnd={momentumScrollEnd}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        getItemLayout={(_, index) => ({
          length: itemHeight,
          offset: itemHeight * index,
          index,
        })}
        initialScrollIndex={initValueIndex}
      />
    </View>
  );
};

export default WheelPicker;
