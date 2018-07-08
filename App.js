import React from 'react';
import {createStackNavigator} from 'react-navigation';
import ApolloClient from 'apollo-boost';
import {ApolloProvider} from 'react-apollo';
import {Constants} from 'expo';
import RecipeList from './components/RecipeList';
import CreateRecipe from './components/CreateRecipe';
import Details from './components/Details';

const client = new ApolloClient({
  uri: 'https://api.graph.cool/simple/v1/cjj7133zl1xfp0183epkv9j7n'
});

const AppStackNavigator = createStackNavigator(
  {
    'RecipeList': RecipeList,
    'CreateRecipe': CreateRecipe,
    'Details': Details
  },
  {
    initialRouteName: 'RecipeList',
  }
)

export default class App extends React.Component {

  render() {
    return (
      <ApolloProvider client={client}>
          <AppStackNavigator />
      </ApolloProvider>
    );
  }
}