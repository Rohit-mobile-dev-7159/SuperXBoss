import React, {useState} from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Accordion from "react-native-collapsible/Accordion";
import {Header} from "../../Component/Index";
import {useFetchFAQs} from "../../Services/Main/Hooks";

const Faqs = () => {
  const {data, isLoading} = useFetchFAQs({page: 1, page_size: 10});
  const [activeSections, setActiveSections] = useState<number[]>([]);

  const SECTIONS = data?.result || [];

  const renderHeader = (section: any, _: any, isActive: boolean) => (
    <View style={styles.headerRow}>
      <Text style={styles.question}>{section.question}</Text>
      <Icon
        name={isActive ? "chevron-up-outline" : "chevron-down-outline"}
        size={20}
        color="#333"
      />
    </View>
  );

  const renderContent = (section: any) => (
    <View style={styles.answerBox}>
      <Text style={styles.answer}>{section.answer}</Text>
    </View>
  );

  return (
    <View testID="wrapper" style={{flex: 1}}>
      <Header title="FAQs" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={{paddingBottom: 50}}
      >
        <Accordion
          sections={SECTIONS}
          activeSections={activeSections}
          renderHeader={renderHeader}
          renderContent={renderContent}
          onChange={setActiveSections}
          underlayColor="transparent"
          expandMultiple={false}
        />

        {SECTIONS.length === 0 && (
          <Text style={styles.empty}>No FAQs available</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    padding: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 8,
    elevation: 1,
  },
  question: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
    paddingRight: 8,
  },
  answerBox: {
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
  },
  answer: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
  empty: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 15,
    color: "#888",
  },
});

export default Faqs;
