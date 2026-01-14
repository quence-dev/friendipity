import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
  Home: undefined;
  Login: undefined;
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;