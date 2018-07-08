import {ActivityIndicator, ScrollView, Text, TouchableOpacity, Image, KeyboardAvoidingView, View, StyleSheet} from 'react-native';
import {TextInput} from 'react-native-paper'
import {Mutation} from 'react-apollo';
import gql from "graphql-tag";
import React from 'react';
import {ImagePicker, Permissions} from 'expo';

const CREATE_RECIPE = gql`
    mutation addRecipe($title: String!, $description: String!, $ingredients: [String!]!, $instructions: [String!]!, $imageId: ID) {
        createRecipe(title: $title, description: $description, ingredients: $ingredients, instructions: $instructions, imageId: $imageId) {
            id
        }
    }
`;

const FILE_UPLOAD_URL = "https://api.graph.cool/file/v1/cjj7133zl1xfp0183epkv9j7n";

export default class CreateRecipeForm extends React.Component{

    static navigationOptions = {
        title: 'Create Recipe',
      };

    state = {
        titleInputValue: '',
        descriptionValue: '',
        ingredientsValue: '',
        instructionsValue: '',
        ingredientsList: [],
        instructionsList: [],
        photo: "https://icons.iconarchive.com/icons/designbolts/free-multimedia/1024/Photo-icon.png"
    }

    handleChangeTitle = (text) => {
        this.setState({
            titleInputValue: text
        });
    };

    handleChangeDescription = (text) => {
        this.setState({
            descriptionValue: text
        });
    };

    handleChangeIngredients = (text) => {
        this.setState({
            ingredientsValue: text
        });
    };

    handleChangeInstructions = (text) => {
        this.setState({
            instructionsValue: text
        });
    };

    handleAddIngredients = () => {
        if(this.state.ingredientsValue !== ''){
            this.setState(prevState => ({
                ingredientsList: [...this.state.ingredientsList, this.state.ingredientsValue],
                ingredientsValue: ''
            }));
        }
    }

    handleAddInstructions = () => {
        if(this.state.instructionsValue !== ''){
            this.setState({
                instructionsList: [...this.state.instructionsList, this.state.instructionsValue],
                instructionsValue: ''
            });
        }
    }

    handlePickImage = async() => {
        await Permissions.askAsync(Permissions.CAMERA_ROLL)
        const photo = await ImagePicker.launchImageLibraryAsync();
        console.log("photo", photo)
        this.setState({ photo: photo.uri });
    }

    

    render(){
        return (
            <Mutation mutation={CREATE_RECIPE}>
                {(createRecipe, {data, loading, error}) => (
                    <KeyboardAvoidingView
                        behavior="position"
                        contentContainerStyle={{ flex: 1 }}
                        style={styles.flexView}>
                        <View style={styles.paddingView}>
                            <ScrollView alwaysBounceVertical={false}>
                                <TouchableOpacity onPress={this.handlePickImage} style={styles.imageSelfStyle}>
                                    <Image
                                        source={{uri: this.state.photo}}
                                        style={styles.imagePicker}/>
                                </TouchableOpacity>

                                <TextInput
                                    style={styles.inputStyle}
                                    label="Enter a recipe title"
                                    value={this.state.titleInputValue}
                                    onChangeText={this.handleChangeTitle}
                                />
                                <TextInput
                                    style={styles.inputStyle}
                                    label="Enter a description of recipe"
                                    value={this.state.descriptionValue}
                                    onChangeText={this.handleChangeDescription}
                                />
                                <TextInput
                                    style={styles.inputStyle}  
                                    label="Enter an ingredients"
                                    value={this.state.ingredientsValue}
                                    onChangeText={this.handleChangeIngredients}
                                />
                                <TouchableOpacity
                                    onPress={this.handleAddIngredients}>
                                    <Text style={styles.addButton}>
                                        + add
                                    </Text>
                                </TouchableOpacity>

                                {this.state.ingredientsList.map((item, index) => {
                                    return (
                                        <Text style={styles.listStyle} key={index}>{item}</Text>
                                    );
                                })}

                                <TextInput
                                    style={styles.inputStyle}
                                    label="Enter an instructions"
                                    value={this.state.instructionsValue}
                                    onChangeText={this.handleChangeInstructions}
                                />

                                <TouchableOpacity
                                    onPress={this.handleAddInstructions}>
                                    <Text style={styles.addButton}>
                                        + add
                                    </Text>
                                </TouchableOpacity>

                                {this.state.instructionsList.map((item, index) => {
                                    return (
                                        <Text style={styles.listStyle} key={index}>{item}</Text>
                                    );
                                })}
                                
                                <TouchableOpacity
                                    disabled={loading}
                                    onPress={async() => {
                                        if (
                                            this.state.descriptionValue.length !== 0 &&
                                            this.state.instructionsList.length !== 0 &&
                                            this.state.instructionsList.length !== 0 &&
                                            this.state.titleInputValue.length !== 0
                                        ) {
                                            let formatData = new FormData();
                                            formatData.append('data', {
                                                uri: this.state.photo,
                                                name: 'image.png',
                                                type: 'multipart/form-data'
                                            });
                                
                                            try {
                                                const res = await fetch(FILE_UPLOAD_URL, {
                                                    method: 'POST',
                                                    body: formatData
                                                });
                                
                                                const resJson = await res.json()
                                                console.log("START RESJSON ", resJson, "END RESJSON");
                                
                                                const result = await createRecipe({
                                                    variables: {
                                                        description: this.state.descriptionValue,
                                                        ingredients: this.state.ingredientsList,
                                                        instructions: this.state.instructionsList,
                                                        title: this.state.titleInputValue,
                                                        imageId: resJson.id
                                                    }
                                                });
                                
                                                console.log('result', result)
                                            }
                                            catch (err) { console.log(err) }
                                            this.props.navigation.goBack()
                                        }
                                        else {
                                            Alert.alert(
                                                'Error',
                                                'Fill all fields',
                                                [
                                                    { text: 'OK', onPress: () => console.log('OK Pressed') },
                                                ],
                                                { cancelable: false }
                                            )
                                        }
                                    }}
                                    style={{alignItems: 'center'}}
                                >
                                    {loading
                                        ? <ActivityIndicator/>
                                        : (
                                            <Text style={styles.submitButton}>
                                                Submit
                                            </Text>
                                        )  
                                    }
                                </TouchableOpacity>
                            </ScrollView>
                        </View>
                    </KeyboardAvoidingView>
                )}
            </Mutation>
        )
    }
}

const styles = StyleSheet.create({

    flexView: {
        flex: 1
    },

    paddingView: {
        paddingLeft: 15, 
        paddingRight: 15, 
        paddingBottom: 15
    },

    imagePicker: {
        width: 200,
        height: 200
    },

    imageSelfStyle: {
        alignSelf: 'center'
    },

    inputStyle: {
        fontSize: 20
    },

    addButton: {
        backgroundColor: '#939599', 
        width: 60, 
        padding: 5, 
        fontSize: 17, 
        borderRadius: 7
    },

    listStyle: {
        backgroundColor: 'white', 
        padding: 5, 
        fontSize: 18, 
        borderRadius: 7, 
        marginTop: 7
    },

    submitButton: {
        backgroundColor: '#BDBDCB',
        padding: 8,
        fontSize: 20,
        borderRadius: 10, 
        borderWidth: 1, 
        borderColor: '#5D6166'
    }
})