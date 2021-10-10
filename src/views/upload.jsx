/*
 * @Description:
 * @Version: 2.0
 * @Autor: Liyb
 * @Date: 2021-08-24 17:38:31
 * @LastEditors: Liyb
 * @LastEditTime: 2021-10-10 21:58:25
 */
import React, { useState, createRef,useRef,useEffect  } from 'react';
import { Container, Dimmer, Loader, Grid, Sticky, Message } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import 'antd/dist/antd';

import { SubstrateContextProvider, useSubstrate } from '../substrate-lib';
import { DeveloperConsole } from '../substrate-lib/components';

import AccountSelector from '../AccountSelector';
import Upgrade from '../Upgrade';
import Interactor from '../Interactor';
import Events from '../Events'
import { TxButton, TxGroupButton } from '../substrate-lib/components';
import {Query} from '../Query'

function Main () {
  const [accountAddress, setAccountAddress] = useState(null);
  const [hash,setHash] = useState(null);
  const { apiState, keyring, keyringState, apiError } = useSubstrate();
  const [interxType,setInterxType] = useState('EXTRINSIC');
  const [palletRpc,setPalletRpc] = useState('dandelion');
  const [callable,setCallable] = useState('createProve');
  const [type,setType] = useState('SIGNED-TX')
  const [paramFields,setParamFields] = useState([]);
  const [status, setStatus] = useState(null);
  const [result,setResult] = useState(null);
  const [infos,setInfos] = useState([]) 
  const [inputParams,setInputParams] = useState([])
  const buttonRef = useRef(null);
  const accountPair =
    accountAddress &&
    keyringState === 'READY' &&
    keyring.getPair(accountAddress);
  useEffect(()=>{
    console.log(status)
    if (status != null && status.indexOf('0x') > -1) {
      setInfos([...infos,status])
    }
  },[status])
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
  const getData = (data) => {
    setHash(data)
    setInputParams([{type: "Bytes",value:data}])
    setParamFields([{name: "fileHash", type: "Bytes", optional: false}])
    buttonRef.current.changeVal()
  }
  const gainData = (data) => {
    setInterxType('QUERY')
    setCallable("allProvesArray")
    setType('QUERY')
    setInfos([])
    let res = []
      console.log('数据',status)
      setTimeout(() => {
        let i = 1
        while (i < 20) {
          setInputParams([{type: "8",value:i.toString()}])
          setParamFields([{name: "8", type: "8", optional: false}])
          buttonRef.current.changeVal()
          if (status == null) break
          if (status.indexOf('0x00000') > -1) {
           break
          } 
          i++
        }
        console.log(infos)
      }, 1000);
  }
  const contextRef = createRef();
  console.log(contextRef,buttonRef)

  return (
    <div ref={contextRef}>
       <Sticky context={contextRef}>
        <AccountSelector setAccountAddress={setAccountAddress} />
      </Sticky>
      <Container>
        <Grid stackable columns='equal'>
          <Grid.Row>
            <Upgrade accountPair={accountPair} getData = {getData}/>
            <TxButton
            style = {{display: 'none'}} 
            setStatus={setStatus}
            accountPair={accountPair} 
            attrs={{ interxType, palletRpc, callable,inputParams, paramFields }}
            cRef = {buttonRef}
            hash={hash}
            label='Signed'
            type={type}
            color='blue'/>
            <Events/>
            <Query accountPair={accountPair} gainData = {gainData} infos = {infos}/>
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
