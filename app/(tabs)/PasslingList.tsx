import { collection, getDocs, getFirestore } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

const PasslingList = () => {
  const [passlings, setPasslings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPasslings = async () => {
      try {
        const db = getFirestore(app);
        const querySnapshot = await getDocs(collection(db, "Passlings"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPasslings(data);
      } catch (err) {
        setError(err.message || "Error getting passlings");
      } finally {
        setLoading(false);
      }
    };
    fetchPasslings();
  }, []);

  if (loading)
    return <ActivityIndicator style={styles.centered} size="large" />;
  if (error) return <Text style={styles.error}>{error}</Text>;

  return (
    <View style={styles.container}>
      <FlatList
        data={passlings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.title}>{item.name || "Unnamed Passling"}</Text>
            {/* Will update */}
          </View>
        )}
        ListEmptyComponent={<Text>No passlings found.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  error: { color: "red", textAlign: "center", marginTop: 20 },
  item: { padding: 10, borderBottomWidth: 1, borderColor: "#000000" },
  title: { fontSize: 14, fontWeight: "bold" },
});

export default PasslingList;
