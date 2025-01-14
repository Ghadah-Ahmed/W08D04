import React from 'react'
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export default function profileScreen({route, navigation}) {
    // const API_URL = 'http://192.168.100.16:3001';
    const API_URL =  'http://localhost:3001'

    const {id, name} = route.params;

    async function logOut() {
        await SecureStore.deleteItemAsync('token');
        navigation.replace('AuthScreen')
    }

    const [books, setBooks] = React.useState([])
    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
      setRefreshing(true);
      fetch(`${API_URL}/books/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${token}`, 
        },
    })
    .then(async res => { 
        try {
            const jsonRes = await res.json();
            if (res.status === 200) {
                setBooks(jsonRes)
                setRefreshing(false)
            }
        } catch (err) {
            console.log(err);
        };
    })
    .catch(err => {
        console.log(err);
    });
    }, []);

      React.useEffect(()=>{
        fetch(`${API_URL}/books/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${token}`, 
            },
        })
        .then(async res => { 
            try {
                const jsonRes = await res.json();
                if (res.status === 200) {
                    setBooks(jsonRes)
                }
            } catch (err) {
                console.log(err);
            };
        })
        .catch(err => {
            console.log(err);
        });
      }, [])  


      const deleteBook = (id) => {
        fetch(`${API_URL}/books/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${token}`, 
            },
        })
        .then(async res => { 
            try {
                if (res.status === 200) {
                    // console.log(res)
                }
            } catch (err) {
                console.log(err);
            };
        })
        .catch(err => {
            console.log(err);
        });
      }

     

    return (
        <ScrollView>
        <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        <View style={styles.container}>
            <View style={styles.buttonsView}>
                
            <TouchableOpacity style={styles.buttonAlt} onPress={() => logOut()}>
                <Text style={styles.buttonAltText}>log out</Text>
            </TouchableOpacity>
            <Text style={styles.heading}>{name}</Text>

            </View>
            <TouchableOpacity style={{...styles.button, width: '80%'}} onPress={() => navigation.navigate('publishModel', { author_id: id})}>
                <Text style={styles.buttonText}>Publish</Text>
            </TouchableOpacity>
            {books? books.map((book, index)=>(
                <View style={styles.card} key={index}>
                        <Image   style={styles.stretch} source={{ uri: book.image}}/>
                        <Text style={styles.names} >{book.title}</Text>
                        <Text>Pages:{book.pages}</Text>
                        <Text>{book.price}$ </Text>
                        <View style={styles.buttonsView}>
                        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('publishModel', { book_id: book._id})}>
                            <Text style={styles.buttonText}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => deleteBook(book._id)}>
                            <Text style={styles.buttonText}>Delete</Text>
                        </TouchableOpacity>
                        </View>
                </View>
                 )): <Text>Ooops! You have no published books!</Text>}
        </View>
        </ScrollView>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 100,
      },
    stretch: {
        width: 200,
        height: 200,
    },
    card: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        width: '80%',
        marginTop: '10%',
        borderRadius: 20,
        maxHeight: 500,
        paddingVertical: '10%',
        alignItems: 'center',
    },
    names: {
        fontSize: 25,
        fontWeight: 'bold',
        marginVertical: '5%',
        color: 'black',
        textAlign: 'center'
    },
    heading: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'black',
        marginHorizontal: '8%'
    },
    buttonAlt: {
        width: '10%',
        backgroundColor: 'black',
        height: 40,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
        padding: 5
    },
    buttonAltText: {
        color: 'white',
        fontSize: 10,
        fontWeight: '400'
    },
    button: {
        width: '40%',
        borderWidth: 1,
        height: 40,
        borderRadius: 50,
        borderColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
        marginHorizontal: 5,
    },
    buttonText: {
        color: 'black',
        fontSize: 16,
        fontWeight: '400',
    },
    buttonsView: {
        flexDirection: 'row',
        alignItems: 'center'
    }
  });