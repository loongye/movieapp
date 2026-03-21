import { Layout } from "../common/Layout";
import { CategoryDropdown } from "./CategoryDropdown";
import { SortDropdown } from "./SortDropdown";
import { SearchBar } from "./SearchBar";
import { View } from "react-native";

export const Page = () => (
    <Layout>
        <View style={{ paddingHorizontal: 29 }}>
            <CategoryDropdown />
            <SortDropdown />
            <SearchBar />
        </View>
    </Layout>
);