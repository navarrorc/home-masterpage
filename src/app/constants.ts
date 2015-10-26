interface IConstant {
  [index: string]: string;
  // see: http://stackoverflow.com/questions/25890521/typescript-access-property-with-dot-notation-using-dictionary-type
  CHIRP: string;
  CHIRPED: string;
  GOT_CHIRPS: string;
  GOT_CURRENT_USERS: string;
  GOT_USERS: string;
  FOLLOW: string;
  FOLLOWED: string;
  UNFOLLOW: string;
  UNFOLLOWED: string;

  GET_GROUPS: string;
}

export var constants: IConstant = {
  CHIRP: 'CHIRP',
  CHIRPED: 'CHIRPED',
  GOT_CHIRPS: 'GOT_CHIRPS',

  GOT_CURRENT_USERS: 'GOT_CURRENT_USERS',
  GOT_USERS: 'GOT_USERS',

  FOLLOW: 'FOLLOW',
  FOLLOWED: 'FOLLOWED',

  UNFOLLOW: 'UNFOLLOW',
  UNFOLLOWED: 'UNFOLLOWED',

  //SP
  GET_GROUPS: 'GET_GROUPS'


};
