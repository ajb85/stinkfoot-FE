import React from 'react';
import Builds from './Builds.js';
import DB from './Database.js';

export default function Providers(props) {
  return (
    <Builds>
      <DB>{props.children}</DB>
    </Builds>
  );
}
