import {ActivityIndicator, FlatList, Text, View, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {Query } from 'react-apollo';
import gql from 'graphql-tag';
import React from 'react';

const GET_ALL_RECIPES = gql`
{
    allRecipes {
        id
        title
        description
        ingredients
        instructions
        image {
            id 
            url
            name
        }
    }
}
`;

export default class RecipeList extends React.Component{

    static navigationOptions = {
        title: 'Home',
        backgroundColor: 'black'
      };

    keyExtractor = (item) => item.id;

    renderItem = ({item}) => (
        <View style={styles.itemStyle}>
            <TouchableOpacity onPress={() => this.handleGoToDetails(item)}>
                <Text style={styles.titleStyle}>
                    {item.title}
                </Text>
                <Image source={{uri: item.image.url}} style={styles.imageStyle}/>
                
                <Text style={styles.descriptionStyle}>
                    {item.description}
                </Text>
            </TouchableOpacity>
        </View>
    );

    handleGoToDetails = item =>{
        this.props.navigation.navigate('Details', {recipe: item});
    }

    handleGoToCreateRecipe = () => {
        this.props.navigation.navigate('CreateRecipe');
    };

    render() {
        return (
                <Query query={GET_ALL_RECIPES}>
                    {({loading, data, error, refetch}) => (
                        loading 
                            ? <ActivityIndicator/>
                            : (
                                <View style={styles.viewFlexStyle}>
                                    <FlatList
                                        refreshing={data.networkStatus === 4}
                                        onRefresh={() => refetch()}
                                        style={styles.flatlistStyle}
                                        keyExtractor={this.keyExtractor}
                                        data={data ? data.allRecipes : []}
                                        renderItem={this.renderItem}
                                    />
                                    <TouchableOpacity
                                        style={styles.buttonStyle}
                                        onPress={this.handleGoToCreateRecipe}>
                                        <Text>
                                            Create recipe
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )
                    )}
                </Query>
        )
    }
}

const styles = StyleSheet.create({
    
    itemStyle: {
        margin: 15,
        backgroundColor: 'white', 
        borderRadius: 10
    },

    titleStyle: {
        alignSelf: 'center', 
        padding: 5, 
        fontSize: 22
    },

    imageStyle: {
        width: 300, 
        height: 150, 
        alignSelf: 'center'
    },

    descriptionStyle: {
        alignSelf: 'center', 
        fontStyle: 'italic', 
        padding: 5
    },

    viewFlexStyle: {
        flex: 5
    },

    flatlistStyle: {
        flex: 4
    },

    buttonStyle: {
        padding: 10, 
        backgroundColor: '#939599', 
        marginLeft: 40, 
        marginRight: 40, 
        alignItems: 'center', 
        borderRadius: 10
    }
})