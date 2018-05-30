import { combineReducers } from 'redux';
import userrequest from 'modules/userrequest';
import userrequestList from 'modules/userrequestList';
import userrequestComments from 'modules/userrequestComments';
import authentication from 'modules/authentication';
import authenticationTimer from 'modules/authenticationTimer';

export default combineReducers({
  userrequest,
  userrequestList,
  userrequestComments,
  authentication,
  authenticationTimer,
});
