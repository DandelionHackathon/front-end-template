/*
 * @Description:
 * @Version: 2.0
 * @Autor: Liyb
 * @Date: 2021-10-10 17:17:52
 * @LastEditors: Liyb
 * @LastEditTime: 2021-10-10 18:28:37
 */
/*
 * @Description:
 * @Version: 2.0
 * @Autor: Liyb
 * @Date: 2021-08-24 17:38:31
 * @LastEditors: Liyb
 * @LastEditTime: 2021-10-10 17:05:28
 */
import React, { useState, MutableRefObject, useRef } from 'react';
import { Form, Grid } from 'semantic-ui-react';
import { TxButton } from './substrate-lib/components';
import { Icon, Button, Input, Upload } from 'antd';

import '../src/views/style/layout.css';

function Query (props) {
  const [status, setStatus] = useState('');
  const { accountPair } = props;
  const { gainData } = props;
  const { infos } = props;
  const queryInfo = (e) => {
    gainData(accountPair);
  };
  return (
    <Grid.Column centered style={{ height: 250 }}>
      <h1>查询文件信息</h1>
      <Button type="primary"
         style={{ width: 200, height: 50, borderRadius: 20, textAlign: 'center' }}
          onClick= { queryInfo }>
              QUERY
      </Button>
      <div>
        {
          infos.map((item, index) => {
            return <div style={{ overflowWrap: 'break-word' }} key={index} >{item}</div>;
          })
        }
      </div>
    </Grid.Column>
  );
}
export { Query };
