import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useState, useEffect } from 'react';
import LoadingScreen from './src/view/LoadingScreen';

export default function App() {

  const db = SQLite.openDatabase('database.db');

  const [isLoading, setIsLoading] = useState(true);
  const [names, setNames] = useState([]);
  const [currentName, setCurrentName] = useState(undefined);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS names (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)');
    });

    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM names', null,
        (_, resultSet) => setNames(resultSet.rows._array),
        (_, error) => console.error(error)
      );
    });

    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <LoadingScreen />
    );
  }

  const showNames = () => {
    return names.map((name, index) => (
      <View key={index} style={styles.row}>
        <Text style={styles.nameText}>{name.name}</Text>
        <View style={styles.buttonContainer}>
          <Button title='Update' onPress={() => updateName(name.id)} style={styles.button} />
          <Button title='Delete' onPress={() => deleteName(name.id)} style={styles.button} />
        </View>
      </View>
    ));
  }

  const formatName = (name) => {
    name = name.trim();
    const words = name.split(' ');
    const formattedWords = words.map(word => {
      return word.charAt(0).toUpperCase()
        + word.slice(1).toLowerCase();
    });
    const formattedName = formattedWords.join(' ');
    return formattedName;
  }

  const addName = () => {

    let nameToAdd = currentName;
    nameToAdd = formatName(nameToAdd);

    db.transaction((tx) => {
      tx.executeSql('INSERT INTO names (name) VALUES (?)',
        [currentName],
        (_, resultSet) => {
          let existingNames = [...names];
          existingNames.push({ id: resultSet.insertId, name: currentName });
          setNames(existingNames);
          setCurrentName(undefined);
        },
        (_, error) => console.error(error)
      );
    });
  }

  const updateName = (id) => {
    db.transaction((tx) => {
      tx.executeSql('UPDATE names SET name = ? WHERE id = ?',
        [currentName, id],
        (_, resultSet) => {
          if (resultSet.rowsAffected > 0) {
            let existingNames = [...names];
            const indexToUpdate = existingNames.findIndex(name => name.id === id);
            existingNames[indexToUpdate].name = currentName;
            setNames(existingNames);
            setCurrentName(undefined);
          }
        },
        (_, error) => console.error(error)
      );
    });
  }

  const deleteName = (id) => {
    db.transaction((tx) => {
      tx.executeSql('DELETE FROM names WHERE id = ?',
        [id],
        (_, resultSet) => {
          if (resultSet.rowsAffected > 0) {
            let existingNames = [...names].filter(name => name.id !== id);
            setNames(existingNames);
          }
        },
        (_, error) => console.error(error)
      );
    });
  }

  return (
    <View style={styles.container}>
      <TextInput
        value={currentName}
        placeholder='Enter a name here'
        onChangeText={setCurrentName}
      />
      <Button title='Save' onPress={addName} />
      {showNames()}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    marginHorizontal: 15,
    marginTop: 10
  },
  nameText: {
    flex: 1,
    fontSize: 16
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10
  },
  button: {
    marginLeft: 8,
  },
});
