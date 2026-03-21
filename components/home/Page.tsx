import { Layout } from "../common/Layout";
import { CategoryDropdown } from "./CategoryDropdown";
import { SortDropdown } from "./SortDropdown";
import { View } from "react-native";

export const Page = () => (
    <Layout>
        <View style={{ paddingHorizontal: 29 }}>
            <CategoryDropdown />
            <SortDropdown />
        </View>
    </Layout>
);