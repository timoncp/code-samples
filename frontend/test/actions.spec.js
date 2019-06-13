import { expect } from 'chai';
import createMockStore from 'redux-mock-store';
import _nock from 'nock';
import thunk from 'redux-thunk';
import { replace } from 'react-router-redux';

import * as actions from 'path/to/actions';
import { user } from 'path/to/constants';

const middlewares = [thunk];
const mockStore = createMockStore(middlewares);
const nock = () => _nock(window.CONFIG.API_URL);

describe('Auth.actions', () => {
  describe('logoutUser', () => {
    before(() => global.localStorage.setItem('accessToken', '123'));

    it('should remove accessToken from localStorage and dispatch LOGOUT', () => {
      const expected = [{ type: actions.LOGOUT }];

      const store = mockStore({});
      store.dispatch(actions.logoutUser());

      expect(global.localStorage.accessToken).to.be.equal(undefined);
      expect(store.getActions()).to.be.eql(expected);
    });
  });

  describe('setToken', () => {
    after(() => global.localStorage.removeItem('accessToken'));

    it('should set accessToken in localStorage and dispatch SET_TOKEN', () => {
      const token = '123';
      const expected = [{ type: actions.SET_TOKEN, payload: token }];

      const store = mockStore({});
      store.dispatch(actions.setToken(token));

      expect(global.localStorage.accessToken).to.be.equal(token);
      expect(store.getActions()).to.be.eql(expected);
    });
  });

  describe('submitLoginForm', () => {
    afterEach(() => _nock.cleanAll());

    it('should dispatch LOGIN_SUCCESS, SET_TOKEN for status 200 and success true', () => {
      const token = '1234';

      nock()
        .post('/api/login')
        .reply(200, { user, token, success: true });

      const expected = [
        actions.loginSuccess(user),
        { type: actions.SET_TOKEN, payload: token },
        replace('new/path'),
      ];

      const data = { username: 'useruser', password: '1234' };

      const store = mockStore({});

      store.dispatch(actions.submitLoginForm(data)).then(
        () => expect(store.getActions()).to.be.eql(expected)
      );
    });

    it('should dispatch LOGIN_ERROR for status 200 and success false', () => {
      nock()
        .post('/api/login')
        .reply(200, { success: false, message: 'msg' });

      const expected = [
        { type: actions.LOGIN_ERROR, payload: 'msg' },
      ];

      const data = { username: 'useruser', password: '1234' };

      const store = mockStore({});

      store.dispatch(actions.submitLoginForm(data)).then(
        () => expect(store.getActions()).to.be.eql(expected)
      );
    });

    it('should dispatch LOGIN_ERROR for status 500 and response error', () => {
      nock()
        .post('/api/login')
        .reply(500, { success: false, message: 'msg' });

      const expected = [
        { type: actions.LOGIN_ERROR, payload: 'Internal Server Error' },
      ];

      const data = { username: 'useruser', password: '1234' };

      const store = mockStore({});

      store.dispatch(actions.submitLoginForm(data)).then(
        () => expect(store.getActions()).to.be.eql(expected)
      );
    });
  });
});
