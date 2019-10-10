import React, {Component} from 'react';
import {Keyboard, ActivityIndicator} from 'react-native';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-community/async-storage';

import Icon from 'react-native-vector-icons/MaterialIcons';
//Isso é pau na lib depois do RN 0.60: https://github.com/oblador/react-native-vector-icons
Icon.loadFont();
import api from '../../services/api';

import {
  Container,
  Form,
  Input,
  SubmitButton,
  List,
  User,
  Avatar,
  Bio,
  Name,
  ProfilleButton,
  ProfilleButtonText,
} from './styles';

export default class Main extends Component {
  static navigationOptions = {
    title: 'Usuários',
  };

  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func,
    }).isRequired,
  };

  state = {
    newUser: '',
    users: [],
    loading: false,
  };

  async componentDidMount() {
    const users = await AsyncStorage.getItem('users');
    if (users) this.setState({users: JSON.parse(users)});
  }

  componentDidUpdate(_, prevState) {
    const {users} = this.state;

    if (prevState.users !== users) {
      AsyncStorage.setItem('users', JSON.stringify(users));
    }
  }

  handleAddUser = async () => {
    const {users, newUser} = this.state;
    this.setState({loading: true});

    const response = await api.get(`/users/${newUser}`);

    const {name, login, bio, avatar_url} = response.data;

    const data = {
      name,
      login,
      bio,
      avatar: avatar_url,
    };

    this.setState({users: [...users, data], newUser: '', loading: false});
    // para o teclado sumir
    Keyboard.dismiss();
  };

  handleNavigate = user => {
    const {navigation} = this.props;
    navigation.navigate('User', {user});
  };

  render() {
    const {users, newUser, loading} = this.state;

    return (
      <Container>
        <Form>
          <Input
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="Adicionar usuário"
            value={newUser}
            //Para setar o texto
            onChangeText={text => this.setState({newUser: text})}
            //Para o enter do teclado (do celular) funcionar
            returnKeyType="send"
            //Metodo quando o usuário clicar no botão de enviar do teclado
            onSubmitEditing={this.handleAddUser}
          />

          <SubmitButton loading={loading} onPress={this.handleAddUser}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Icon name="add" size={20} color="#fff"></Icon>
            )}
          </SubmitButton>
        </Form>

        <List
          data={users}
          keyExtractor={user => user.login}
          renderItem={({item}) => (
            <User>
              {/* Para enviar uma url, tenho que enviar um obj */}
              <Avatar source={{uri: item.avatar}} />
              <Name>{item.name}</Name>
              <Bio>{item.bio}</Bio>

              <ProfilleButton onPress={() => this.handleNavigate(item)}>
                <ProfilleButtonText>Ver perfil</ProfilleButtonText>
              </ProfilleButton>
            </User>
          )}
        />
      </Container>
    );
  }
}
