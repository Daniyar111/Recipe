import {Text, View, Image, ScrollView, StyleSheet} from 'react-native';
import React from 'react';


export default class Details extends React.Component{

    static navigationOptions = {
        title: 'Details',
      };

    render() {
        const recipe = this.props.navigation.getParam('recipe');
        return (
            <View style={{padding: 15}}>
                <ScrollView alwaysBounceVertical={false}>
                    <Image source={{uri: recipe.image.url}} style={styles.imageStyle}/>
                    <Text style={styles.titleStyle}>
                        {recipe.title}
                    </Text>
                    <Text style={styles.descriptionStyle}>
                        {recipe.description}
                    </Text>
                    <Text style={styles.infoStyle}>
                        What do you need?
                    </Text>

                    {recipe.ingredients.map((item, index) => {
                        return (
                            <Text key={index} style={styles.ingredientsStyle}>
                                {item}
                            </Text>
                        );
                    })}
                    <Text style={styles.infoStyle}>
                        How to cook?
                    </Text>
                    {recipe.instructions.map((item, index) => {
                        return (
                            <Text key={index} style={styles.ingredientsStyle}>
                                {item}
                            </Text>
                        );
                    })}
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    
    imageStyle: {
        width: 350, 
        height: 300, 
        alignSelf: 'center'
    },

    titleStyle: {
        alignSelf: 'center', 
        padding: 5, 
        fontSize: 22
    },

    descriptionStyle: {
        alignSelf: 'center', 
        fontStyle: 'italic', 
        padding: 5
    },

    infoStyle: {
        color: '#27AE60', 
        fontSize: 18
    },

    ingredientsStyle: {
        backgroundColor: 'white', 
        padding: 5, 
        fontSize: 17, 
        borderRadius: 7, 
        marginTop: 7
    }
})