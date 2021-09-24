/*
 * @Description:
 * @Version: 2.0
 * @Autor: Liyb
 * @Date: 2021-08-24 17:38:31
 * @LastEditors: Liyb
 * @LastEditTime: 2021-09-24 14:05:51
 */
import React, { useState, createRef } from 'react';
import { Container, Dimmer, Loader, Grid, Sticky, Message } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import 'antd/dist/antd';

import { SubstrateContextProvider, useSubstrate } from '../substrate-lib';
import { DeveloperConsole } from '../substrate-lib/components';

import Upgrade from '../Upgrade';
import Interactor from '../Interactor';
import Events from '../Events'

function Main () {
  const [accountAddress, setAccountAddress] = useState(null);
  const { apiState, keyring, keyringState, apiError } = useSubstrate();
  const accountPair =
    accountAddress &&
    keyringState === 'READY' &&
    keyring.getPair(accountAddress);
  const loader = text =>
    <Dimmer active>
      <Loader size='small'>{text}</Loader>
    </Dimmer>;

  const message = err =>
    <Grid centered columns={2} padded>
      <Grid.Column>
        <Message negative compact floating
          header='Error Connecting to Substrate'
          content={`${JSON.stringify(err, null, 4)}`}
        />
      </Grid.Column>
    </Grid>;

  if (apiState === 'ERROR') return message(apiError);
  else if (apiState !== 'READY') return loader('Connecting to Substrate' + apiState);

  if (keyringState !== 'READY') {
    return loader('Loading accounts (please review any extension\'s authorization)');
  }

  const contextRef = createRef();

  return (
    <div ref={contextRef}>
      <Container>
        <Grid stackable columns='equal'>
          <Grid.Row>
            <Upgrade accountPair={accountPair} />
            <Interactor/>
            <Events/>
          </Grid.Row>
        </Grid>
      </Container>
      <DeveloperConsole />
    </div>
  );
}

export default function Index () {
  return (
    <SubstrateContextProvider>
      <Main />
    </SubstrateContextProvider>
  );
}
