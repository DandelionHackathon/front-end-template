/*
 * @Description:
 * @Version: 2.0
 * @Autor: Liyb
 * @Date: 2021-09-09 15:08:55
 * @LastEditors: Liyb
 * @LastEditTime: 2021-09-09 16:36:47
 */
import Home from './Home';
import User from './user'
import React, { useState, createRef } from 'react';
import AccountSelector from '../AccountSelector';
import Upload from './upload';
import { Container, Dimmer, Loader, Grid, Sticky, Message } from 'semantic-ui-react';
import { SubstrateContextProvider, useSubstrate } from '../substrate-lib';

// 在上面的对象数组中，查找在菜单中被选中的组件，条件渲染
function AllComponent (props) {
  const theselected = props.selected;
  let selectedComponent = <div></div>;
  const keyComponent = [
    {
      key: 1,
      name: 'addmaterial',
      component: <Home />
    },
    {
      key: 2,
      name: 'AccountSelector',
      component: <User/>
    },
    {
      key: 3,
      name: 'upgarde',
      component: <Upload />
    }
  ];
  selectedComponent = keyComponent.map((item) => {
    if (item.key.toString() === theselected) {
      return item.component;
    }
    return '';
  });
  console.log(selectedComponent);
  return (<div>
      {selectedComponent}
  </div>);
}
export default AllComponent;
