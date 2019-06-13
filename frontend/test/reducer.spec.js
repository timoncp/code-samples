import { expect } from 'chai';

import reducer from 'path/to/reducer';
import * as ActionType from 'path/to/actions';
import { user } from 'path/to/constant';

describe('Auth.reducer', () => {
  describe('error', () => {
    it('should have default value {}', () => {
      expect(
        reducer(undefined, {}).error
      ).to.be.eql({});
    });

    it('should store the payload in login for LOGIN_ERROR', () => {
      const payload = { message: 'Test' };
      expect(
        reducer({}, { type: ActionType.LOGIN_ERROR, payload }).error.login
      ).to.be.eql(payload);
    });

    it('should set the login state to null for LOGIN_SUCCESS', () => {
      expect(
        reducer({}, ActionType.loginSuccess(user)).error.login
      ).to.be.eql(null);
    });

    it('should store the payload in forgot for REQUEST_RESET_ERROR', () => {
      const payload = { message: 'Test' };
      expect(
        reducer({}, { type: ActionType.REQUEST_RESET_ERROR, payload }).error.forgot
      ).to.be.eql(payload);
    });

    it('should set the forgot state to null for REQUEST_RESET_SUCCESS', () => {
      expect(
        reducer({}, { type: ActionType.REQUEST_RESET_SUCCESS }).error.forgot
      ).to.be.eql(null);
    });
  });

  describe('success', () => {
    it('should have default value {}', () => {
      expect(
        reducer(undefined, {}).success
      ).to.be.eql({});
    });

    it('should store the payload in forgot for REQUEST_RESET_SUCCESS', () => {
      const payload = { message: 'Test' };
      expect(
        reducer({}, { type: ActionType.REQUEST_RESET_SUCCESS, payload }).success.forgot
      ).to.be.eql(payload);
    });

    it('should set the forgot state to null for REQUEST_RESET_ERROR', () => {
      expect(
        reducer({}, { type: ActionType.REQUEST_RESET_ERROR }).success.forgot
      ).to.be.eql(null);
    });
  });

  describe('isLoggedIn', () => {
    it('should have default value false', () => {
      expect(
        reducer(undefined, {}).isLoggedIn
      ).to.be.equal(false);
    });

    it('should set the state to true for LOGIN_SUCCESS', () => {
      expect(
        reducer({ isLoggedIn: false }, { type: ActionType.LOGIN_SUCCESS }).isLoggedIn
      ).to.be.equal(true);
    });
  });

  describe('token', () => {
    it('should have default value {}', () => {
      expect(
        reducer(undefined, {}).token
      ).to.be.eql({});
    });

    it('should store the payload in token for SET_TOKEN', () => {
      const payload = 'testToken';
      expect(
        reducer({}, { type: ActionType.SET_TOKEN, payload }).token
      ).to.be.eql(payload);
    });
  });
});
